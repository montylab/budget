import Vue from 'vue'
import * as firebase from 'firebase'

import utilsService from '@/services/utils-service'
import authService from '@/services/auth-service'
import dateService from '@/services/date-service'

export default class ComeService {
    events = new Vue()

    data = {
        categories: null,
        items: null,
    }

    constructor({type}) {
        this.type = type

        if (authService.authorized()) {
            this.dbFetch()
        } else {
            authService.events.$on('authStateChanged', () => this.dbFetch())
        }
    }

    getCategories = () => {
        if (this.data.categories && this.data.categories.length) {
            return this.data.categories.slice()
        }
        return []
    }

    getItemsArray = function ({year, month} = {}) {
        const timestamps = year && month ? dateService.getMonthTimestamps(year,
            month) : {
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
        return filteredArray
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

        //if (!notLastItem) {
        this.dbPushItem(item)
        this.events.$emit('updated', {
            items: this.getItemsArray(),
            categories: this.data.categories,
        })
        //}
    }

    importItems = (items) => {
        items.forEach(item => this.addNewItem(item))

        return new Promise((rs, rj) => rs(true))
    }

    changeItem = (item) => {
        this.data.items[item.id] = item
        this.dbPushItem(item)
    }

    delete = (id) => {
        this.dbDeleteItem(id)
        this.data.items[id] = null
        delete this.data.items[id]
        this.events.$emit('updated', {
            items: this.getItemsArray(),
            categories: this.data.categories,
        })
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
            this.events.$emit('updated', {
                items: this.getItemsArray(),
                categories: this.data.categories,
            })
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

            this.data.categories = Object.keys(filtered)

            this.events.$emit('updated', {
                items: this.getItemsArray(),
                categories: this.data.categories,
            })

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

        if (this.data.categories &&
            this.data.categories.indexOf(item.category) == -1) {
            this.data.categories.push(item.category)
            db.ref('users/' + uid + '/data/categories/' + this.type).set(this.data.categories)
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
    guesser = (phrase) => {
        // console.time('guesser')
        if (!this.guessDic) {
            this.generateGuesserDictionary()
        }

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

        // console.timeEnd('guesser')
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
                if (word && item.category) {
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
