<script>
	import authService from '@/services/auth-service'
	import exportService from '@/services/export-service'
	import papaParse from 'papaparse'

	export default {
		name: 'exporter',

		created: function() {
			if (authService.authorized()) {
				this.fetchData()
			} else {
				authService.events.$on('authStateChanged', () => this.fetchData())
			}
		},

		watch: {
			format: function() {
				if (this.format === this.constants.CSV) {
					this.type = this.constants.DATA
				}
			},
		},

		methods: {
			fetchData: function() {
				exportService.fetchBackup().then(response => {
					this.backup = response
				})
			},

			toCSV: function() {
				let result = ''

				if (this.dataIncome) {
					result += 'INCOME \n'
					for (let key in this.backup.data.income) {
						const row = this.backup.data.income[key]
						if (row.date >= this.dateRangeTimestamp.start && row.date <= this.dateRangeTimestamp.end) {
							result += `${key},${row.amount},${row.category},${row.description},${row.date}\n`
						}
					}
				}

				if (this.dataOutcome) {
					result += 'OUTCOME \n'
					for (let key in this.backup.data.outcome) {
						const row = this.backup.data.outcome[key]
						if (row.date >= this.dateRangeTimestamp.start && row.date <= this.dateRangeTimestamp.end) {
							result += `${key},${row.amount},${row.category},${row.description},${row.date}\n`
						}
					}
				}

				return result
			},

			toJSON() {
				let data = {}

				if (this.type === this.constants.BACKUP) {
					data = this.backup
				} else {
					this.dataOutcome && (data.outcome = this.backup.data.outcome)
					this.dataIncome && (data.income = this.backup.data.income)
				}

				return JSON.stringify({...data, backup: true})
			},
		},

		computed: {
			filename: function() {
				let filename = 'budget-'
				filename += this.type + '-'
				if (this.type === this.constants.DATA && (this.dataIncome + this.dataOutcome === 1)) {
					filename += this.dataIncome ? this.constants.INCOME : ''
					filename += this.dataOutcome ? this.constants.OUTCOME : ''
					filename += '-'
				}

				filename += (new Date()).toISOString().slice(0, 10)

				filename += '.' + this.format

				return filename
			},
			link: function() {
				let link = `data:text/${this.format}};charset=utf-8,`

				link += encodeURIComponent(
					this.format === this.constants.JSON ? this.toJSON() : this.toCSV())

				return link
			},

			dateRangeTimestamp: function() {
				return {
					start: +Date.parse(this.dateRange.start),
					end: +Date.parse(this.dateRange.end),
				}
			},
		},
		data() {
			return {
				backup: null,

				format: 'json',
				type: 'backup',
				dataIncome: true,
				dataOutcome: true,
				dateRange: {
					start: new Date(0).toISOString().slice(0, 10),
					end: new Date().toISOString().slice(0, 10),
				},

				downloadLink: '',

				constants: {
					JSON: 'json',
					CSV: 'csv',
					BACKUP: 'backup',
					DATA: 'data',
					INCOME: 'income',
					OUTCOME: 'outcome',
				},
			}
		},
	}
</script>

<template>
	<div class="widget widget-layout">
		<div class="group">
			<h1>Format:</h1>
			<div class="flexGroup ">
				<app-controls-radio v-model="format" :val="constants.JSON" name="format" title="JSON"></app-controls-radio>
				<app-controls-radio v-model="format" :val="constants.CSV" name="format" title="CSV"></app-controls-radio>
			</div>
		</div>

		<div class="group">
			<h1>Export type:</h1>
			<div class="flexGroup ">
				<app-controls-radio v-model="type" :val="constants.BACKUP" name="type" title="Full Backup"
									:disabled="this.format === this.constants.CSV"
				></app-controls-radio>
				<app-controls-radio v-model="type" :val="constants.DATA" name="type" title="Money Data only"></app-controls-radio>
			</div>
		</div>

		<div class="group" v-if="type==='data'">
			<h1>Choose data</h1>
			<div class="flexGroup">
			<app-controls-checkbox v-model="dataIncome" :value="constants.INCOME" title="Income"></app-controls-checkbox>
			<app-controls-checkbox v-model="dataOutcome" :value="constants.OUTCOME" title="Outcome"></app-controls-checkbox>
			</div>
		</div>
		<div class="group" v-if="type==='data'">
			<h1>Date Range</h1>
			<div class="flexGroup">

			<label class="ctrl ">
				Start Date <br>
				<input type="date" v-model="dateRange.start">
			</label>
			<label class="ctrl ">
				End Date <br>
				<input type="date" v-model="dateRange.end">
			</label>
			</div>
		</div>

		<div class="btns">
		<a
			v-if="this.link.length > 50"
			:href="link"
			ref="download"
			:download="filename"
			class="btn"
		>Download File</a>

		</div>
	</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.group {
		margin: 40px 0;
		max-width: 500px;
	}

	.ctrl {
		flex: 1;
		margin-top: 0
	}


</style>
