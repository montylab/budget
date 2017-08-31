<script>
	import authService from '@/services/auth-service'
	import importService from '@/services/import-service'
	import exportService from '@/services/export-service'
	import settingsService from '@/services/settings-service'
	import dateService from '@/services/date-service'


	export default {
		name: 'backup',

		created: function() {
			const str = localStorage.getItem('app-backup')
			this.backups =  str ? JSON.parse(str) : []

			this.backups.sort((a, b) => b.date-a.date)

			settingsService.events.$on('updated', ({settings}) => {
				this.settings = settings
				this.$forceUpdate()
			})
			this.settings = settingsService.getSettings()
		},


		methods: {
			createLocalBackup() {
				const hash = Math.random().toString(32).slice(3, 13)
				settingsService.change({lastLocalBackup: hash})

				exportService.fetchBackup().then(backup => {
					this.backups.unshift({
						hash: hash,
						date: +new Date(),
						data: backup
					})

					localStorage.setItem('app-backup', JSON.stringify(this.backups))
				})
			},

			deleteItem(index) {
				this.backups.splice(index, 1)
				localStorage.setItem('app-backup', JSON.stringify(this.backups))
			},

			applyItem(index) {
				const backup = this.backups[index]
				settingsService.change({lastLocalBackup: backup.hash})
				importService.importBackup(backup.data).then(result=>console.log(result))
			}
		},

		data() {
			return {
				backups: [],
				dateService
			}
		},
	}
</script>

<template>
	<div class="widget widget-layout">
		<h1>Backup</h1>

		<h2>Local section allows you to time travel between saved backup copies. It wares data on your machine only.</h2>

		<div class="btn" @click="createLocalBackup">Create Local Backup</div>

		<table class="table backupList">
			<tr>
				<th></th>
				<th>Date</th>
				<th>Hasg</th>
				<th>Actions</th>
			</tr>
			<tr v-for="(backup, index) in backups" :class="{current: backup.hash == settings.lastLocalBackup}">
				<td><a class="btn btn-remove" @click="deleteItem(index)"></a></td>
				<td>{{dateService.fromNow(backup.date)}}</td>
				<td>{{backup.hash}}</td>
				<td>
					<a class="btn" @click="applyItem(index)">Apply</a>
				</td>
			</tr>
		</table>

	</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.link {
		color: #FFF
	}

	.current {
		background: #6cb31d;
	}

	.table {
		/*width: 100%*/
		background: #FFF;
		margin: 20px 0;
	}

	td, th {
		padding: 5px 10px;
		vertical-align: middle;
	}

	.btn-remove {
		opacity: 0;
	}

	tr:hover  {
		background: #00a7c0;
	}
	tr:hover .btn-remove {
		opacity: 1;
	}
</style>
