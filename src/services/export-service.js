import * as firebase from 'firebase'

import authService from '@/services/auth-service'

export default {
	fetchBackup: () => {
		const uid = authService.getUid()
		if (!uid) {
			console.warn('There is no uid at data fetch')
			return
		}

		const db = firebase.database()

		return db.ref('users/' + uid).once('value').then(snapshot => snapshot.val())
	},
}
