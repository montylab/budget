import Vue from 'vue'
import * as firebase from 'firebase'

import utilsService from '@/services/utils-service'
import authService from '@/services/auth-service'

const defaultSettings = {
	precision: 2,
	greeting: 'name',
}

const settingsOptions = {
	greeting: ['name', 'email', 'none'],
}

export default {
	events: new Vue(),

	data: defaultSettings,
	options: settingsOptions,

	change(changes) {
		this.data = {
			...this.data,
			...changes
		}
		this.dbPush()
	},

	dbFetch() {
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
					settings: this.data,
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
		db.ref('users/' + uid + '/settings').set(this.data)

		this.events.$emit('updated', {
			settings: this.data,
		})
	},
}
