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
			this.pikaday = new Pikaday({
				field: this.$el.querySelector('input.date'),
				onClose: date => {
					setTimeout(()=>this.$refs.notifyer.focus())
				}
			})

			this.updateRow()
		},

		watch: {
			item: function () {
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
				this.emitChange()
			},

			moneyChanged: function({target: {value}}) {
				debugger

				let amount = parseFloat(value)
				if (value.toString().indexOf('$') != -1) {
					this.row.amount = amount
				} else {
					this.row.amount = currencyService.convertToApp({value: amount}) //(amount / currencyService.getCurrencyRate())
				}

				this.emitChange()
			},

			inputChanged: function(e) {
				this.row.category = this.$refs.catdesc.input.category
				this.row.description = this.$refs.catdesc.input.description

				this.emitChange()
			},

			emitChange: function () {
				this.lastEmitted = {...this.row}
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

				setTimeout(()=> {
					try {
						const tr = e.target.closest('tr')
						const nextTr = tr.nextElementSibling
						const amountInput = nextTr.querySelector('.amount')
						amountInput.select()
					} catch (e) {
						console.warn(e)
					}
				}, 50)
			}
		}
	}
</script>



<template>
	<tr>
		<td
			data-step="11"
			data-intro="How much money? It convert sum you enter to application currency (USD by default). You can prevent conversion by adding '$' sign at the end"
		>
			<button class="btn btn-remove" @click="deleteItem" tabindex="-1">X</button>
			<input type="text" class="amount" :value="amountFixed" @change="moneyChanged" @keydown.tab="focusToCategory" @keydown.enter="focusToCategory">
		</td>
		<td
			data-step="12"
			data-intro="Category and Description has following syntax: ''category1:category2 description'' - where category1 is parent category of category2. After space you can enter description. any symbols allowed"
		>
			<app-datasheet-input
				:categories="categories"
				:category="row.category"
				:description="row.description"

				@change="inputChanged"
				@leave="focusToDate"

				ref="catdesc"
			></app-datasheet-input>
		</td>
		<td
			data-step="13"
			data-intro="Simple calendar widget">
			<input @change="dateChange" class="date" ref="date">
			<input
				type="text"
				class="invisible"

				@keydown.enter="emitEnter"

				ref="notifyer"

				data-step="14"
				data-intro="You can go through the row using TAB or ENTER key. Press any to go to the next line or CTRL/CMD + ENTER to insert new after this "
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

	.btn-remove {
		background: coral;
		position: absolute;
		left: 0;
		top: 7px;

		margin: 0;
		max-width: 0;
		width: 100%;
		overflow: hidden;

		transition-delay: 0.25s;
	}

	tr:hover .btn-remove, .btn-remove:hover {
		left: -32px;
		max-width: 24px;
	}

	.amount {
		font-weight: bold;
		text-align: right;
		padding-right: 10px;
		box-sizing: border-box;
	}
</style>
