import Vue from 'vue'
import * as firebase from 'firebase'

import utilsService from '@/services/utils-service'
import authService from '@/services/auth-service'
import dateService from '@/services/date-service'

export default class ComeService {
    events = new Vue()

    data = {
        categories: [],
        items: [],
    }

    constructor({type}) {
        this.type = type

        if (authService.authorized()) {
            this.dbFetch()
        } else {
            authService.events.$on('authStateChanged', () => this.dbFetch())
        }
    }

    updated() {
        // set priority for cats
        const categoriesRating = {};
        for (let key in this.data.items) {
            let item = this.data.items[key]
			categoriesRating[item.category] = categoriesRating[item.category] ? categoriesRating[item.category]+1 : 1
        }

		this.data.categories = this.data.categories.map(item => ({'name': item.name, priority: categoriesRating[item.name]}))
		this.data.categories = this.data.categories.filter(item => item.priority > 0 && item.name)


		this.events.$emit('updated', {
			items: this.getItemsArray(),
			categories: this.getCategories(),
		})
    }

	getCategories = () => {
        return this.data.categories.filter(item => item.name.trim()).map(item => item.name)
	}

	getPrioritizedCategories = () => {
		return this.data.categories.slice()
	}

    getItemsArray = function ({year, month} = {}) {
        const timestamps = year && month ? dateService.getMonthTimestamps(year, month) : {
            start: 0,
            end: Infinity,
        }

        const filteredArray = []

        for (let id in this.data.items) {
            const item = this.data.items[id]
            if (item.date >= timestamps.start && item.date < timestamps.end) {
                filteredArray.push({
                    ...item,
                    amount: +item.amount,
                })
            }
        }
        filteredArray.sort((a, b) => a.date - b.date)

        return filteredArray.length ? filteredArray : [{
            id: utilsService.generateId(10e3),
            category: '',
            description: '',
            amount: 0,
            date: dateService.endOfSelectedMonth(),
        }]
    }

    addNewItem = (itemOverrides, notLastItem = false) => {
        const id = utilsService.generateId()
        const item = {
            amount: 0,
            description: '',
            category: 'unknown',
            date: dateService.endOfSelectedMonth(),
            id: id,

            ...itemOverrides
        }
        this.data.items[id] = item

        this.dbPushItem(item)
        this.updated()
    }

    importItems = (items) => {
        items.forEach(item => this.addNewItem(item))

        return new Promise((rs, rj) => rs(true))
    }

    changeItem = (item) => {
		if (JSON.stringify(this.data.items[item.id]) === JSON.stringify(item)) return

        this.data.items[item.id] = {...item}
        this.dbPushItem(item)
    }

    delete = (id) => {
        this.dbDeleteItem(id)
        this.data.items[id] = null
        delete this.data.items[id]
		this.updated()
    }

    dbFetch = () => {
        const uid = authService.getUid()
        if (!uid) {
            console.warn('There is no uid at data fetch')
            return
        }

        const db = firebase.database()
        db.ref('users/' + uid + '/data/' + this.type).orderByChild('date').once('value').then(snapshot => {
            this.data.items = snapshot.val() || {}
			this.updated()
        })

        db.ref('users/' + uid + '/data/categories/' + this.type).once('value').then(snapshot => {
            const cats = snapshot.val() || []

            const filtered = cats.reduce((acc, item) => {
                const value = item.trim()
                if (value) {
                    acc[value] = true
                }
                return acc
            }, {})

            this.data.categories = Object.keys(filtered).map(item => ({
                name: item,
                priority: 0,
            }))

			this.updated()

            window.guesser = this.guesser
            this.guessTest()
        })
    }

    dbPushItem = (item) => {
        const uid = authService.getUid()
        if (!uid) {
            console.warn('There is no uid')
            return
        }

        const db = firebase.database()
        db.ref('users/' + uid + '/data/' + this.type + '/' + item.id).set(item)

        // debugger
        if (!this.data.categories.find(el => item.category == el.name)) {
            this.data.categories.push({
				name: item.category,
				priority: 1
			})
            db.ref('users/' + uid + '/data/categories/' + this.type).set(this.getCategories())
			this.updated()
        }
    }

    dbDeleteItem = (id) => {
        const uid = authService.getUid()
        if (!uid) {
            console.warn('There is no uid')
            return
        }

        const db = firebase.database()
        db.ref('users/' + uid + '/data/' + this.type + '/' + id).remove().then(function () {
            console.log('Remove succeeded.')
        }).catch(function (error) {
            console.log('Remove failed: ' + error.message)
        })
    }



    generateId = () => Math.abs(~~(Math.random() * 1e15))

    guesserTime = 0

    guesser = (phrase) => {
        const start = +new Date()

        // console.time('guesser')
        // if (!this.guessDic) {
            this.generateGuesserDictionary()
        // }

        const split = phrase
            .replace(/[\.\,\?\-]+/gim, ' ')
            .replace(/\s+/gim, ' ')
            .trim()
            .split(' ')

        const len = split.length
        const result = {}
        // console.log(this.guessDic)
        split.forEach(word => {
            for (let cat in this.guessDic[word]) {
                result[cat] = result[cat] ? result[cat] + this.guessDic[word][cat] : this.guessDic[word][cat]
            }
        })

        let max = 0
        let name = undefined
        for (let cat in result) {
            if (max < result[cat]) {
                max = result[cat]
                name = cat
            }
        }
        let guess = name



        this.guesserTime += +new Date() - start

        console.log(this.guesserTime + "ms")
        return {
            guess: name,
            phrase,
            categories: result
        }
    }
    generateGuesserDictionary = () => {
        this.guessDic = this.getItemsArray().reduce((acc, item) => {
            const split = item.description
                .replace(/[\.\,\?\-]+/gim, ' ')
                .replace(/\s+/gim, ' ')
                .trim()
                .split(' ')

            const len = split.length
            split.forEach(word => {
                if (word && item.category && item.category.trim()) {
                    const score = word.length > 4 ? 1 : word.length > 2 ? 0.5 : 0.1

                    acc[word] = acc[word] || {}
                    acc[word][item.category] = acc[word][item.category] || 0
                    acc[word][item.category] += score / len
                }
            })
            return acc
        }, {})

        return this.guessDic
    }
    guessTest = () => {
        // console.log('- - - - - - - - - - - -')
        let cnt = 0
        this.getItemsArray().forEach(item => {
            if (item.description.trim() && guesser(item.description).guess != item.category) {
                // console.log(cnt++, item.description, guesser(item.description).guess, item.category)
            }

        })
    }
}
