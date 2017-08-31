import Vue from 'vue'
import * as firebase from 'firebase'

import utilsService from '@/services/utils-service'
import authService from '@/services/auth-service'

const staticSettings = {
	greetingsOptions: ['name', 'email', 'none'],
}

const defaultSettings = {
	precision: 2,
	greetings: 'name',
	appCurrency: 'USD',
	userCurrency: 'BYN',

	replace: false,
	replacers: [
		{from: ' / MINSK / BY', to: ''},
	],

	// hidden options
	...staticSettings
}

export default {
	events: new Vue(),

	data: defaultSettings,
	fetchedSnapshot: null,

	getSettings() {
		return JSON.parse(JSON.stringify({
			...this.data,
			...staticSettings
		}))
	},

	change(changes) {
		const snapshot = JSON.stringify(this.data)
		this.data = {
			...this.data,
			...changes
		}

		if (JSON.stringify(this.data) !== snapshot) {
			this.dbPush()
		}
	},

	dbFetch() {
		window.setting = this;

		const uid = authService.getUid()
		if (!uid) {
			console.warn('There is no uid at data fetch')
			return
		}

		const db = firebase.database()
		db.ref('users/' + uid + '/settings').
			once('value').
			then(snapshot => {
				this.change(snapshot.val())
				this.events.$emit('updated', {
					settings: this.getSettings(),
				})
			})
	},

	dbPush() {
		const uid = authService.getUid()
		if (!uid) {
			console.warn('There is no uid')
			return
		}

		const db = firebase.database()
		console.log('set', this.data)
		db.ref('users/' + uid + '/settings').set(this.data)

		this.events.$emit('updated', {
			settings: this.getSettings()
		})
	},
}
