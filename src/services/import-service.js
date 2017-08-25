import * as firebase from 'firebase'

import authService from '@/services/auth-service'
import incomeService from '@/services/income-service'
import outcomeService from '@/services/outcome-service'
import settingsService from '@/services/settings-service'

export default {
	importBackup: (backup) => {
		const uid = authService.getUid()
		if (!uid) {
			console.warn('There is no uid')
			return
		}

		return new Promise((rs,rj) => {
			const isValid = backup && backup.data && backup.data.income && backup.data.outcome && backup.data.categories && backup.settings
			if (!isValid) {
				rs(false)
				return
			}

			const db = firebase.database()
			db.ref('users/' + uid).set(backup).then(()=>{
				db.ref('users/' + uid).once('value').then((snapshot)=>{
					rs(JSON.stringify(snapshot.val()) === JSON.stringify(backup))
				})
			})
		})
	},

	updateApp: () => {
		incomeService.dbFetch()
		outcomeService.dbFetch()
		settingsService.dbFetch()
	}
}
