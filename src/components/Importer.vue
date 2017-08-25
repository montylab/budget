<script>
	import papaParse from 'papaparse'
	import outcomeService from '@/services/outcome-service'
	import incomeService from '@/services/income-service'
	import importService from '@/services/import-service'
	import dateService from '@/services/date-service'
	import currencyService from '@/services/currency-service'
	import settingsService from '@/services/settings-service'
	import latToCyr from 'latin-to-cyrillic'

	import Dropzone from 'dropzone'

	const testinput = `"ЗАО «МТБанк»"
"улица Толстого, 10, 220007, г.Минск."
"http://www.mtbank.by"
"тел.: +375 17 229-98-89"
"Выписка по счету  BY06MTBK30140008000002006332"
"Клиент:","Коваленко Эдуард Евгеньевич","10.08.2017 г. 15:32:33"
"Название:","PayOkay"
"Номер счета:","BY06MTBK30140008000002006332"
"Номер и дата договора:","38779644 от 08.12.2015"
"Период выписки:","с 01.03.2017 г. по 31.03.2017 г."
"Входящий остаток:","89.34","BYN"
"поступило:","817.55","BYN"
"списано:","860.90","BYN"
"Исходящий остаток:","21.75","BYN"
Транзакции по счету с 01.03.2017 г. по 31.03.2017 г.
"1","Дата операции","Дата обработки","Место операции","Oписание операции","Карта","Валюта","Сумма в валюте операции","Сумма в валюте счета","Остаток счета"
"2","31.03.2017 23:27:30","31.03.2017","","Выплата рассчитанных процентов за период с 01.03.2017 по 31.03.2017 за остаток на тек.счете с банк.плат.карточкой для MASTERCARD MCW BYR 3Y (PAYOKAY).","","BYN","0.02","0.02","45.99"
"3","29.03.2017 10:12:22","31.03.2017","AZS N 22 BAPB / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-35.03","-35.03","45.97"
"4","29.03.2017 15:37:47","31.03.2017","PT MEDETSINSKI TSENTR / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-24.70","-24.70","81.00"
"5","29.03.2017 14:36:24","31.03.2017","UNIVERSAM "SOSEDI" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-4.49","-4.49","105.70"
"6","25.03.2017 16:32:39","28.03.2017","PIZZERIA "PIZZA TEMPO" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-16.07","-16.07","110.19"
"7","26.03.2017 20:43:31","28.03.2017","SHOP "EVROOPT" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-21.89","-21.89","126.26"
"8","25.03.2017 22:59:52","27.03.2017","P2P_MTBANK / MINSK / BY","Перевод на БПК МТБ в системе Р2Р","535104******1317","BYN","100.00","100.00","148.15"
"9","23.03.2017 15:14:16","27.03.2017","PLANETA SUSHI RESTAURA / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-6.40","-6.40","48.15"
"10","24.03.2017 23:57:10","27.03.2017","MTB INTERNET POS / MINSK / BY","Poezd.rw.by - Ж/д билеты | номер услуги 377801","535104******1317","BYN","-9.50","-9.50","54.55"
"11","24.03.2017 23:51:03","27.03.2017","MTB INTERNET POS / MINSK / BY","Poezd.rw.by - Ж/д билеты | номер услуги 377801","535104******1317","BYN","-10.92","-10.92","64.05"
"12","20.03.2017 14:20:27","22.03.2017","KAFE "AVTOGRAF" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-6.80","-6.80","84.87"
"13","18.03.2017 21:53:31","21.03.2017","I.-SHOP "MENU.BY" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-29.00","-29.00","91.67"
"14","20.03.2017 09:00:49","20.03.2017","MTB INTERNET POS / MINSK / BY","МТС по N телефона | номер услуги 393931","535104******1317","BYN","-11.39","-11.39","120.67"
"15","17.03.2017 16:08:10","20.03.2017","UNIVERSAM "SOSEDI" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-4.99","-4.99","132.06"
"16","18.03.2017 12:00:30","20.03.2017","MTB INTERNET POS / MINSK / BY","Сити-2011 | номер услуги 425101","535104******1317","BYN","-10.56","-10.56","137.05"
"17","15.03.2017 15:21:09","17.03.2017","UNIVERSAM "SOSEDI" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-0.77","-0.77","147.61"
"18","15.03.2017 15:10:19","17.03.2017","PLANETA SUSHI RESTAURA / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-6.80","-6.80","148.38"
"19","14.03.2017 20:36:10","16.03.2017","SHOP "EVROOPT" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-33.02","-33.02","155.18"
"20","14.03.2017 15:17:53","16.03.2017","PLANETA SUSHI RESTAURA / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-5.80","-5.80","188.20"
"21","15.03.2017 09:02:13","15.03.2017","MTB INTERNET POS / MINSK / BY","Оплата в Интернет-банке","535104******1317","BYN","-2.81","-2.81","194.00"
"22","15.03.2017 09:02:10","15.03.2017","MTB INTERNET POS / MINSK / BY","Оплата в Интернет-банке","535104******1317","BYN","-34.08","-34.08","196.81"
"23","13.03.2017 16:07:02","15.03.2017","PLANETA PIZZY SURGANOV / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-7.95","-7.95","230.89"
"24","11.03.2017 19:48:02","14.03.2017","Dominospizza / Minsk / BY","Оплата товаров и услуг","535104******1317","BYN","-14.20","-14.20","238.84"
"25","09.03.2017 21:37:56","13.03.2017","AZS N 43 MINSKAVTOZAPR / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-41.16","-41.16","253.04"
"26","07.03.2017 14:04:22","13.03.2017","DOMINOSPIZZA / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-69.90","-69.90","294.20"
"27","10.03.2017 12:27:49","10.03.2017","MTB INTERNET POS / MINSK / BY","Перевод на карту другого клиента","535104******1317","BYN","8.10","8.10","364.10"
"28","08.03.2017 12:25:36","10.03.2017","PARFUMERIA.BY STORE / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-82.00","-82.00","356.00"
"29","10.03.2017 05:31:07","10.03.2017","","Комиссия за снятие наличных в чужих ATM","","BYN","-0.75","-0.75","438.00"
"30","07.03.2017 14:01:20","10.03.2017","ATMMMB HO25 TC RIGA / MINSK / BY","Снятие наличных в чужих АТМ, ПВН, иных устройствах","535104******1317","BYN","-30.00","-30.00","438.75"
"31","09.03.2017 09:00:50","09.03.2017","MTB INTERNET POS / MINSK / BY","Byfly,ZALA,Максифон,Умный дом | номер услуги 4521","535104******1317","BYN","-12.00","-12.00","468.75"
"32","07.03.2017 20:54:38","09.03.2017","UNIVERSAM "SOSEDI" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-9.28","-9.28","480.75"
"33","07.03.2017 21:41:21","09.03.2017","SHOP "EVROOPT" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-15.53","-15.53","490.03"
"34","06.03.2017 15:09:23","09.03.2017","PIZZERIA "PIZZA TEMPO" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-16.20","-16.20","505.56"
"35","07.03.2017 14:58:00","07.03.2017","MTB INTERNET POS / MINSK / BY","Перевод на карту другого клиента","535104******1317","BYN","21.50","21.50","521.76"
"36","07.03.2017 14:53:32","07.03.2017","MTB INTERNET POS / MINSK / BY","Перевод на карту другого клиента","535104******1317","BYN","26.65","26.65","500.26"
"37","07.03.2017 14:53:03","07.03.2017","MTB INTERNET POS / MINSK / BY","Перевод на карту другого клиента","535104******1317","BYN","11.65","11.65","473.61"
"38","04.03.2017 12:45:34","07.03.2017","PT ZAKUSOCHN. "METROMI / BREST / BY","Оплата товаров и услуг","535104******1317","BYN","-24.00","-24.00","461.96"
"39","07.03.2017 11:50:01","07.03.2017","MTB INTERNET POS / MINSK / BY","Обучение | номер услуги 4401","535104******1317","BYN","-155.20","-155.20","485.96"
"40","04.03.2017 23:12:45","07.03.2017","SHOP "EVROOPT" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-22.24","-22.24","641.16"
"41","04.03.2017 17:21:03","06.03.2017","CAFES LA BRASILENA / BREST / BY","Оплата товаров и услуг в сети МТБанка","535104******1317","BYN","-15.00","-15.00","663.40"
"42","04.03.2017 15:22:32","06.03.2017","MTB RKC 19 / BREST / BY","Пополнение наличными в ПВН МТБанка","535104******1317","BYN","645.00","645.00","678.40"
"43","02.03.2017 21:16:30","06.03.2017",""GALILEO SILVER SCREEN / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-8.00","-8.00","33.40"
"44","02.03.2017 13:41:04","06.03.2017","KAFE "AVTOGRAF" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-7.67","-7.67","41.40"
"45","03.03.2017 13:06:29","03.03.2017","MTB INTERNET POS / MINSK / BY","Poezd.rw.by - Ж/д билеты | номер услуги 377801","535104******1317","BYN","-7.96","-7.96","49.07"
"46","03.03.2017 13:04:17","03.03.2017","MTB INTERNET POS / MINSK / BY","Poezd.rw.by - Ж/д билеты | номер услуги 377801","535104******1317","BYN","-7.96","-7.96","57.03"
"47","28.02.2017 14:42:37","02.03.2017","SHOP "EVROOPT" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-4.23","-4.23","64.99"
"48","28.02.2017 14:25:08","02.03.2017",""WWW.SILVERSCREEN.BY"B / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-16.00","-16.00","69.22"
"49","01.03.2017 11:36:30","01.03.2017","","Начисление Cash-back в рамках продукта PayOkay за Февраль по номеру договора 38779644","","BYN","4.63","4.63","85.22"
"50","26.02.2017 22:07:38","01.03.2017","RESTORAN "MCDONALDS" / MINSK / BY","Оплата товаров и услуг","535104******1317","BYN","-8.75","-8.75","80.59"
"Типы операций"
"T - сумма обработана"
"A - сумма блокирована (ожидает обработки)"
"E - ошибка выполнения операции"
"Исходящий остаток:","21.75","BYN"
`

	export default {
		name: 'importer',

		data() {
			return {
				raw: {
					data: {},
					mapColumns: [],
				},

				datasheetItems: [],
				categoriesIncome: [],
				categoriesOutcome: [],


				settings: {
					type: 'smart',
					inverse: false,
					defaultCurrency: currencyService.userCurrency,
					replace: false,
					replacers: [],
					translitConversion: false,
				},

				result: null,
				file: null,
				currencyService,
			}
		},

		computed: {
			positiveDatasheetItems() {
				return this.datasheetItems.filter(item => item.amount >= 0)
			},
			negativeDatasheetItems() {
				return this.datasheetItems.filter(item => item.amount < 0).map(item => ({
					...item,
					amount: -1 * item.amount,
				}))
			},

			categories() {
				return this.settings.type === 'income' ? this.categoriesIncome : this.categoriesOutcome

			},
		},

		watch: {
			result: function() {
				if (this.result !== null) {
					setTimeout(() => {
						this.result = null
						this.file = null
					}, 5000)
				}
			},

			settings: {
				deep: true,
				handler() {this.rawToDatasheet()},
			},
			raw: {
				deep: true,
				handler() {this.rawToDatasheet()},
			},
		},

		created: function() {
			outcomeService.events.$on('updated', (data) => {
				this.categoriesOutcome = data.categories
			})

			incomeService.events.$on('updated', (data) => {
				this.categoriesIncome = data.categories
			})

			this.categoriesOutcome = outcomeService.getCategories()
			this.categoriesIncome = incomeService.getCategories()

			settingsService.events.$on('updated', ({settings}) => {
				this.settings = {
					...this.settings,
					...settings
				}
			})
			this.settings = {
				...this.settings,
				...settingsService.getSettings()
			}
		},

		mounted: function() {
			this.parse()

			new Dropzone('div#file', {
				url: '#',
				autoProcessQueue: false,
				autoQueue: false,
				addedfile: this.processFile,
			})

		},

		methods: {
			parse: function(parsed) {
				const result = parsed || papaParse.parse(testinput)

				const len = {}
				result.data.forEach((item) => {
					len[item.length] = len[item.length] ? len[item.length] + 1 : 1
				})

				let max = 0
				let length
				for (let key in len) {
					if (len[key] > max) {
						max = len[key]
						length = key
					}
				}

				this.raw = {
					data: result.data.filter(item => item.length == length),
					mapColumns: [],
				}

				return this.raw
			},

			rawToDatasheet: function() {
				const cur = this.raw.mapColumns.indexOf('currency')
				const cat = this.raw.mapColumns.indexOf('category')
				const dat = this.raw.mapColumns.indexOf('date')
				const amo = this.raw.mapColumns.indexOf('amount')
				const des = this.raw.mapColumns.indexOf('description')

				const dateFormat = dateService.determineDateFormat(this.raw.data.map(item => item[dat]))

				this.datasheetItems = this.raw.data.map((row) => {
					let amount = amo != -1 ? row[amo] * (this.settings.inverse * -2 + 1) : '0'

					if (row[cur]) {
						amount = currencyService.convertToApp({currency: row[cur], value: amount})
					} else {
						amount = currencyService.convertToApp({currency: this.settings.defaultCurrency, value: amount})
					}

					let description = des != -1 ? row[des] : ''
					if (this.settings.replace && row[des]) {
						this.settings.replacers.forEach((repl) => {
							if (!repl.enabled) return
							description = description.replace(repl.from, repl.to)
						})
					}
					if (this.settings.translitConversion && description) {
						description = latToCyr(description)
					}

					return {
						category: cat != -1 ? row[cat] : '',
						date: dat != -1 ? dateService.strToTimestamp(row[dat], dateFormat) : +new Date(),
						amount,
						description,
					}
				})

			},

			importData: function() {
				switch (this.settings.type) {
					case 'income' :
						this.importCome(incomeService)
						return
					case 'outcome' :
						this.importCome(outcomeService)
						return
					case 'smart':
						this.importCome(incomeService, this.negativeDatasheetItems)
						this.importCome(outcomeService, this.positiveDatasheetItems)
						return
				}
			},

			importCome: function(service, data = this.datasheetItems) {
				service.importItems(data).then((result) => {
					this.result = result

					this.raw = {mapColumns: [], data: []}
					this.datasheetItems = []

					importService.updateApp()
				})
			},

			processFile: function(file) {
				this.file = file

				if (this.settings.type === 'backup') {
					this.readToBackup(file)
				} else {
					papaParse.parse(file, {
						complete: (results) => {
							this.parse(results)
						},
					})
				}
			},

			readToBackup: function handleFileSelect(evt) {
				const files = evt instanceof File ? [evt] : evt.target.files

				const output = []
				for (let i = 0, f; f = files[i]; i++) {
					const reader = new FileReader()
					reader.onload = (theFile => {
						return (e) => {
							try {
								const json = JSON.parse(e.target.result)
								importService.importBackup(json).then((result) => {
									this.result = result
									importService.updateApp()
								})
							} catch (ex) {
								this.result = false
							}
						}
					})(f)
					reader.readAsText(f)
				}
			},

			replaceModalCheck: function() {
				setTimeout(() => {
					this.settings.replace && this.$refs.modalReplace.open()
				}, 100)

			},
		},

	}
</script>

<template>
	<div class="widget import-widget">

		<div id="file" class="dropper">
			<div class="fallback">
				<input name="file" type="file" :accept="settings.type === 'backup' ? 'application/json' : '*/*'"/>
			</div>

			<h1>Choose file or drop it here</h1>
			<div class="filename" v-if="file">{{file.name}}</div>
		</div>


		<div class="flexGroup">
			<div class="flex">
				<h1>Choose import type</h1>
				<app-controls-radio
					v-model="settings.type"
					name="type"
					val="smart"
					title="Smart Mode"
				></app-controls-radio>
				<app-controls-radio
					v-model="settings.type"
					name="type"
					val="income"
					title="Income"
				></app-controls-radio>
				<app-controls-radio
					v-model="settings.type"
					name="type"
					val="outcome"
					title="Outcome"
				></app-controls-radio>
				<app-controls-radio
					v-model="settings.type"
					name="type"
					val="backup"
					title="Backup"
				></app-controls-radio>
			</div>
			<div class="flex">
				<h1>Options</h1>
				<app-controls-switcher v-model="settings.replace" title="Enable Auto Replace"
									   @click.native="replaceModalCheck"></app-controls-switcher>
				<app-controls-switcher v-model="settings.translitConversion"
									   title="Translit to Russian Conversion"></app-controls-switcher>
				<app-controls-switcher v-model="settings.inverse" title="Inverse amount column"></app-controls-switcher>

				<div>
					<label>
						<select v-model="settings.defaultCurrency">
							Default currency:
							<option
								v-for="currency in currencyService.currencyList"
								:value="currency">
								{{currency}}
							</option>
						</select>
					</label>
				</div>
			</div>
		</div>

		<div v-if="settings.type != 'backup'">
			<div class="tableContainer">
				<app-csv-table-widget v-model="raw"></app-csv-table-widget>

				<div v-if="settings.type === 'smart'">
					<div v-if="negativeDatasheetItems.length">
						<h1>Income</h1>
						<app-datasheet-widget
							:items="negativeDatasheetItems"
							:categories="categoriesIncome"
							title="income"
						></app-datasheet-widget>
					</div>
					<div v-if="positiveDatasheetItems.length">
						<h1>Outcome</h1>
						<app-datasheet-widget
							:items="positiveDatasheetItems"
							:categories="categoriesOutcome"
							title="outcome"
						></app-datasheet-widget>
					</div>
				</div>

				<app-datasheet-widget
					v-else
					:items="datasheetItems"
					:categories="categories"
				></app-datasheet-widget>
			</div>

			<div class="btns"><a class="btn" @click="importData">Import</a></div>
		</div>


		<div class="message" v-if="result !== null">
			<div class="success" v-if="result">
				Success
			</div>
			<div class="error" v-else>
				Error, try again
			</div>
		</div>

		<app-modal-widget ref="modalReplace">
			<app-settings-replace-widget></app-settings-replace-widget>
		</app-modal-widget>
	</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.widget {
		width: 100%;
		overflow: hidden;
		padding-bottom: 10px;
	}

	.tableContainer {
		width: 100%;
		overflow: auto;
	}

	h1, h2 {
		font-weight: normal;
		margin: 10px 0
	}

	.section {
		margin: 0 0 40px
	}

	.dropper {
		border: 2px dashed #fff;
		background: transparent;
		width: 100%;
		height: 100px;
		margin-bottom: 40px;
		display: flex;
		justify-content: center;
		text-align: center;
		flex-direction: column;
		box-sizing: border-box;
	}

	.dropper:hover {
		cursor: pointer;
	}

	.dropper > * {
		z-index: -1;
		position: relative;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		display: inline-block;
		margin: 0 10px;
	}

	a {
		color: #42b983;
	}

	.btns {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}

	.message {
		background: #FFF;
		padding: 20px;
		margin: 20px 0;
		font-size: 16px;
		opacity: 1;
		transition: all 5s 2s;
		animation: fadeout 5s;
	}

	@keyframes fadeout {
		0% {
			opacity: 0
		}
		5% {
			opacity: 1
		}
		75% {
			opacity: 1
		}
		100% {
			opacity: 0
		}
	}

	.success {
		color: #00bcd4;
	}

	.error {
		color: coral;
	}


</style>


<style scoped>
	/*
 * The MIT License
 * Copyright (c) 2012 Matias Meno <m@tias.me>
 */
	@-webkit-keyframes passing-through {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30%, 70% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
		100% {
			opacity: 0;
			-webkit-transform: translateY(-40px);
			-moz-transform: translateY(-40px);
			-ms-transform: translateY(-40px);
			-o-transform: translateY(-40px);
			transform: translateY(-40px);
		}
	}

	@-moz-keyframes passing-through {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30%, 70% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
		100% {
			opacity: 0;
			-webkit-transform: translateY(-40px);
			-moz-transform: translateY(-40px);
			-ms-transform: translateY(-40px);
			-o-transform: translateY(-40px);
			transform: translateY(-40px);
		}
	}

	@keyframes passing-through {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30%, 70% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
		100% {
			opacity: 0;
			-webkit-transform: translateY(-40px);
			-moz-transform: translateY(-40px);
			-ms-transform: translateY(-40px);
			-o-transform: translateY(-40px);
			transform: translateY(-40px);
		}
	}

	@-webkit-keyframes slide-in {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
	}

	@-moz-keyframes slide-in {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
	}

	@keyframes slide-in {
		0% {
			opacity: 0;
			-webkit-transform: translateY(40px);
			-moz-transform: translateY(40px);
			-ms-transform: translateY(40px);
			-o-transform: translateY(40px);
			transform: translateY(40px);
		}
		30% {
			opacity: 1;
			-webkit-transform: translateY(0px);
			-moz-transform: translateY(0px);
			-ms-transform: translateY(0px);
			-o-transform: translateY(0px);
			transform: translateY(0px);
		}
	}

	@-webkit-keyframes pulse {
		0% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
		10% {
			-webkit-transform: scale(1.1);
			-moz-transform: scale(1.1);
			-ms-transform: scale(1.1);
			-o-transform: scale(1.1);
			transform: scale(1.1);
		}
		20% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
	}

	@-moz-keyframes pulse {
		0% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
		10% {
			-webkit-transform: scale(1.1);
			-moz-transform: scale(1.1);
			-ms-transform: scale(1.1);
			-o-transform: scale(1.1);
			transform: scale(1.1);
		}
		20% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
	}

	@keyframes pulse {
		0% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
		10% {
			-webkit-transform: scale(1.1);
			-moz-transform: scale(1.1);
			-ms-transform: scale(1.1);
			-o-transform: scale(1.1);
			transform: scale(1.1);
		}
		20% {
			-webkit-transform: scale(1);
			-moz-transform: scale(1);
			-ms-transform: scale(1);
			-o-transform: scale(1);
			transform: scale(1);
		}
	}

	.dropzone, .dropzone * {
		box-sizing: border-box;
	}

	.dropzone {
		min-height: 150px;
		border: 2px solid rgba(0, 0, 0, 0.3);
		background: white;
		padding: 20px 20px;
	}

	.dropzone.dz-clickable {
		cursor: pointer;
	}

	.dropzone.dz-clickable * {
		cursor: default;
	}

	.dropzone.dz-clickable .dz-message, .dropzone.dz-clickable .dz-message * {
		cursor: pointer;
	}

	.dropzone.dz-started .dz-message {
		display: none;
	}

	.dropzone.dz-drag-hover {
		border-style: solid;
	}

	.dropzone.dz-drag-hover .dz-message {
		opacity: 0.5;
	}

	.dropzone .dz-message {
		text-align: center;
		margin: 2em 0;
	}

	.dropzone .dz-preview {
		position: relative;
		display: inline-block;
		vertical-align: top;
		margin: 16px;
		min-height: 100px;
	}

	.dropzone .dz-preview:hover {
		z-index: 1000;
	}

	.dropzone .dz-preview:hover .dz-details {
		opacity: 1;
	}

	.dropzone .dz-preview.dz-file-preview .dz-image {
		border-radius: 20px;
		background: #999;
		background: linear-gradient(to bottom, #eee, #ddd);
	}

	.dropzone .dz-preview.dz-file-preview .dz-details {
		opacity: 1;
	}

	.dropzone .dz-preview.dz-image-preview {
		background: white;
	}

	.dropzone .dz-preview.dz-image-preview .dz-details {
		-webkit-transition: opacity 0.2s linear;
		-moz-transition: opacity 0.2s linear;
		-ms-transition: opacity 0.2s linear;
		-o-transition: opacity 0.2s linear;
		transition: opacity 0.2s linear;
	}

	.dropzone .dz-preview .dz-remove {
		font-size: 14px;
		text-align: center;
		display: block;
		cursor: pointer;
		border: none;
	}

	.dropzone .dz-preview .dz-remove:hover {
		text-decoration: underline;
	}

	.dropzone .dz-preview:hover .dz-details {
		opacity: 1;
	}

	.dropzone .dz-preview .dz-details {
		z-index: 20;
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		font-size: 13px;
		min-width: 100%;
		max-width: 100%;
		padding: 2em 1em;
		text-align: center;
		color: rgba(0, 0, 0, 0.9);
		line-height: 150%;
	}

	.dropzone .dz-preview .dz-details .dz-size {
		margin-bottom: 1em;
		font-size: 16px;
	}

	.dropzone .dz-preview .dz-details .dz-filename {
		white-space: nowrap;
	}

	.dropzone .dz-preview .dz-details .dz-filename:hover span {
		border: 1px solid rgba(200, 200, 200, 0.8);
		background-color: rgba(255, 255, 255, 0.8);
	}

	.dropzone .dz-preview .dz-details .dz-filename:not(:hover) {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
		border: 1px solid transparent;
	}

	.dropzone .dz-preview .dz-details .dz-filename span, .dropzone .dz-preview .dz-details .dz-size span {
		background-color: rgba(255, 255, 255, 0.4);
		padding: 0 0.4em;
		border-radius: 3px;
	}

	.dropzone .dz-preview:hover .dz-image img {
		-webkit-transform: scale(1.05, 1.05);
		-moz-transform: scale(1.05, 1.05);
		-ms-transform: scale(1.05, 1.05);
		-o-transform: scale(1.05, 1.05);
		transform: scale(1.05, 1.05);
		-webkit-filter: blur(8px);
		filter: blur(8px);
	}

	.dropzone .dz-preview .dz-image {
		border-radius: 20px;
		overflow: hidden;
		width: 120px;
		height: 120px;
		position: relative;
		display: block;
		z-index: 10;
	}

	.dropzone .dz-preview .dz-image img {
		display: block;
	}

	.dropzone .dz-preview.dz-success .dz-success-mark {
		-webkit-animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
		-moz-animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
		-ms-animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
		-o-animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
		animation: passing-through 3s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.dropzone .dz-preview.dz-error .dz-error-mark {
		opacity: 1;
		-webkit-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
		-moz-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
		-ms-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
		-o-animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
		animation: slide-in 3s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.dropzone .dz-preview .dz-success-mark, .dropzone .dz-preview .dz-error-mark {
		pointer-events: none;
		opacity: 0;
		z-index: 500;
		position: absolute;
		display: block;
		top: 50%;
		left: 50%;
		margin-left: -27px;
		margin-top: -27px;
	}

	.dropzone .dz-preview .dz-success-mark svg, .dropzone .dz-preview .dz-error-mark svg {
		display: block;
		width: 54px;
		height: 54px;
	}

	.dropzone .dz-preview.dz-processing .dz-progress {
		opacity: 1;
		-webkit-transition: all 0.2s linear;
		-moz-transition: all 0.2s linear;
		-ms-transition: all 0.2s linear;
		-o-transition: all 0.2s linear;
		transition: all 0.2s linear;
	}

	.dropzone .dz-preview.dz-complete .dz-progress {
		opacity: 0;
		-webkit-transition: opacity 0.4s ease-in;
		-moz-transition: opacity 0.4s ease-in;
		-ms-transition: opacity 0.4s ease-in;
		-o-transition: opacity 0.4s ease-in;
		transition: opacity 0.4s ease-in;
	}

	.dropzone .dz-preview:not(.dz-processing) .dz-progress {
		-webkit-animation: pulse 6s ease infinite;
		-moz-animation: pulse 6s ease infinite;
		-ms-animation: pulse 6s ease infinite;
		-o-animation: pulse 6s ease infinite;
		animation: pulse 6s ease infinite;
	}

	.dropzone .dz-preview .dz-progress {
		opacity: 1;
		z-index: 1000;
		pointer-events: none;
		position: absolute;
		height: 16px;
		left: 50%;
		top: 50%;
		margin-top: -8px;
		width: 80px;
		margin-left: -40px;
		background: rgba(255, 255, 255, 0.9);
		-webkit-transform: scale(1);
		border-radius: 8px;
		overflow: hidden;
	}

	.dropzone .dz-preview .dz-progress .dz-upload {
		background: #333;
		background: linear-gradient(to bottom, #666, #444);
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 0;
		-webkit-transition: width 300ms ease-in-out;
		-moz-transition: width 300ms ease-in-out;
		-ms-transition: width 300ms ease-in-out;
		-o-transition: width 300ms ease-in-out;
		transition: width 300ms ease-in-out;
	}

	.dropzone .dz-preview.dz-error .dz-error-message {
		display: block;
	}

	.dropzone .dz-preview.dz-error:hover .dz-error-message {
		opacity: 1;
		pointer-events: auto;
	}

	.dropzone .dz-preview .dz-error-message {
		pointer-events: none;
		z-index: 1000;
		position: absolute;
		display: block;
		display: none;
		opacity: 0;
		-webkit-transition: opacity 0.3s ease;
		-moz-transition: opacity 0.3s ease;
		-ms-transition: opacity 0.3s ease;
		-o-transition: opacity 0.3s ease;
		transition: opacity 0.3s ease;
		border-radius: 8px;
		font-size: 13px;
		top: 130px;
		left: -10px;
		width: 140px;
		background: #be2626;
		background: linear-gradient(to bottom, #be2626, #a92222);
		padding: 0.5em 1.2em;
		color: white;
	}

	.dropzone .dz-preview .dz-error-message:after {
		content: '';
		position: absolute;
		top: -6px;
		left: 64px;
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-bottom: 6px solid #be2626;
	}

</style>
