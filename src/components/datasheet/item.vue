<script>
	import Pikaday from '@/libs/pikaday'
	import dateService from '@/services/date-service'
	import authService from '@/services/auth-service'
	import currencyService from '@/services/currency-service'
	import settingsService from '@/services/settings-service'

	export default {
		name: 'app-datasheet-item',
		props: ['item', 'categories'],

		data: function () {
			return {
				row: {
					category: '',
					description: '',
					date: 0,
					amount: 0,
					pikaday: null
				},
				lastEmitted: {...this.item}
			}
		},

		mounted: function() {
			this.pikaday = new Pikaday({field: this.$el.querySelector('input.date')})

			console.log('mounted')
			this.updateRow()

		},

		watch: {
			item: function () {
				console.log('watched')
				this.updateRow()
			}
		},

		computed: {
			date: function() {
				return dateService.fromTimestamp(this.row.date, 'DD.MM.YYYY')
			},
			amountFixed: function () {
				const val = parseFloat(this.row.amount)
				return val.toFixed(settingsService.data.precision) / 1
			},
			dateOffset: function() {
				return Math.abs(this.row.date % 1e5)
			},
		},

		methods: {
			updateRow: function () {
				this.row = {...this.item}
				this.pikaday.setDate(new Date(this.item.date))
				this.lastEmitted = {...this.item}

			},

			dateChange: function(event) {
				const val = event.target.value
				this.row.date = dateService.toTimestamp(val, 'DD.MM.YYYY') + this.dateOffset
				console.log(val)
				this.emitChange()
			},

			moneyChanged: function({target: {value}}) {
				let amount = parseFloat(value)
				if (value.toString().indexOf('$') != -1) {
					this.row.amount = amount
				} else {
					this.row.amount = (amount / currencyService.getCurrencyRate())
				}

				this.emitChange()
			},

			inputChanged: function(e) {
				this.row.category = this.$refs.catdesc.input.category
				this.row.description = this.$refs.catdesc.input.description

				this.emitChange()
			},

			emitChange: function () {
				if (JSON.stringify(this.lastEmitted) === JSON.stringify(this.row)) {
					console.log('emit skipped')
					return
				} else {
					console.log('emit this.lastEmitted', this.lastEmitted)
					console.log('emit this.row', this.row)
				}
				this.lastEmitted = {...this.row}
				console.log('emit')
				this.$emit('change', this.row)
			},

			deleteItem: function() {
				this.$emit('delete', this.row)
			},

			focusToDate: function() {
				setTimeout(()=>this.$refs.date.focus())
			},

			focusToCategory: function(e) {
				setTimeout(()=>{
					this.$refs.catdesc.selectCategory()
				}, 200)
			},

			emitEnter: function(e) {
				this.$emit('enter', {event: e, id: this.row.id})
			}
		}
	}
</script>



<template>
	<tr>
		<td>
			<button class="btn btn-delete" @click="deleteItem" tabindex="-1">X</button>
			<input type="text" class="amount" :value="amountFixed" @change="moneyChanged" @keydown.tab="focusToCategory" @keydown.enter="focusToCategory">
		</td>
		<td>
			<app-datasheet-input
				:categories="categories"
				:category="row.category"
				:description="row.description"

				@change="inputChanged"
				@leave="focusToDate"

				ref="catdesc"
			></app-datasheet-input>
		</td>
		<td>
			<input @change="dateChange" class="date" ref="date">
			<input
				type="text"
				class="invisible"

				@keydown.enter="emitEnter"
			>
			<div>
				Enter or Tab to go next
				<br>
				Ctrl + Enter to insert new
			</div>
		</td>

	</tr>
</template>


<style scoped>
	td {
		position: relative;
	}

	td:nth-child(1) {
		width: 5%;
		min-width: 50px;
	}

	td:nth-child(2) {
		width: 45%;
		position: relative
	}

	td:nth-child(3) {
		width: 30%;
	}

	td:nth-child(4) {
		width: 15%;
	}

	input, select, pre {
		border: 0;
		height: 100%;
		width: 100%;
		line-height: 100%;
		text-indent: 5px;
		outline: none;
		border-bottom: 2px solid transparent;
		background: transparent;
		transition: all .4s;
	}

	input:focus {
		border-bottom: 2px solid #00BCD4;
	}

	input.invisible {
		width: 0;
		height: 0;
		position: absolute;
		padding: 0;
		border: 0;
	}
	.invisible + div {
		font-size: 11px;
		visibility: hidden;
		position: absolute;
		top: 0;
		right: -1px;
		bottom: 0;
		color: #FFF;
		background: #00bcd4;
		line-height: 14px;
		padding: 13px 15px 0;
	}

	.invisible:focus + div {
		visibility: visible;
	}

	.btn-delete {
		background: coral;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		border-radius: 0;
		border: 0;
		outline: none;
		margin: 0;
		padding: 0;
		text-align: center;
		transition: all 0.3s cubic-bezier(0, 0.96, 0.89, 1.58);
		max-width: 0;
		width: 100%;
		overflow: hidden;
	}

	tr:hover .btn-delete, .btn-delete:hover {
		left: -40px;
		max-width: 40px;
	}

	.amount {
		font-weight: bold;
		text-align: right;
		padding-right: 10px;
		box-sizing: border-box;
	}
</style>
