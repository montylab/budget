import Vue from 'vue'
import * as firebase from 'firebase'

import utilsService from '@/services/utils-service'
import authService from '@/services/auth-service'
import dateService from '@/services/date-service'

export default class ComeService {
  events = new Vue()

  data = {
    categories: null,
    items: null
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
    const timestamps = year && month ? dateService.getMonthTimestamps(year, month) : {
      start: 0,
      end: Infinity
    }

    const filteredArray = []

    for (let id in this.data.items) {
      const item = this.data.items[id]
      if (item.date >= timestamps.start && item.date < timestamps.end) {
        filteredArray.push({
          ...item,
          amount: +item.amount
        })
      }
    }
    filteredArray.sort((a, b) => a.date - b.date)
    return filteredArray
  }

  addNewItem = () => {
    const id = utilsService.generateId()
    const item = {
      amount: 0,
      description: '',
      category: 'unknown',
      date: dateService.endOfSelectedMonth(),
      id: id
    }
    Vue.set(this.data.items, id, item)

    this.dbPushItem(item)

    this.events.$emit('updated', {
      items: this.getItemsArray(),
      categories: this.data.categories
    })
  }

  delete = (id) => {
    this.dbDeleteItem(id)
    this.data.items[id] = null
    delete this.data.items[id]
     this.events.$emit('updated', {
     	items: this.getItemsArray(),
     	categories: this.data.categories
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
        categories: this.data.categories
      })
    })

    db.ref('users/' + uid + '/data/categories/' + this.type).once('value').then(snapshot => {
      this.data.categories = snapshot.val() || {}
      this.events.$emit('updated', {
        items: this.getItemsArray(),
        categories: this.data.categories
      })
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

    if (this.data.categories && this.data.categories.indexOf(item.category) == -1) {
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
    db.ref('users/' + uid + '/data/' + this.type + '/' + id)
      .remove()
      .then(function () {
        console.log('Remove succeeded.')
      }).catch(function (error) {
      console.log('Remove failed: ' + error.message)
    })
  }

  generateId = () => Math.abs(~~(Math.random() * 1e15))
}
