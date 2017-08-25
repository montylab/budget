import settingsService from './settings-service'

const defaultCurrency = 'USD'

export default {
	url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22{%curencies%}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys',
	appCurrency: 'USD',
	userCurrency: 'BYN',
	currencyList: ['USD','BYN', 'EUR'],
	rates: {
		'USDBYN': 1.93,
		'BYNUSD': 1/1.93,
	},

	init() {
		this.fetchCurrencyRate()

		settingsService.events.$on('updated', ({settings}) => {
			this.appCurrency = settings.appCurrency || 'USD'
			this.userCurrency = settings.userCurrency || 'BYN'
		})

		this.appCurrency = settingsService.data.appCurrency || 'USD'
		this.userCurrency = settingsService.data.userCurrency || 'BYN'
	},


	getCurrencyUrl() {
		return this.url.replace('{%curencies%}', this.appCurrency +
			this.userCurrency)
	},

	fetchCurrencyRate() {
		fetch(this.getCurrencyUrl()).then(blob => blob.json()).then(data => {
			if (data && data.query && data.query.results &&
				data.query.results.rate) {
				const {rate} = data.query.results
				this.rates[rate.id] = (+rate.Ask + +rate.Bid) / 2
				this.rates[rate.id.slice(3, 6) + rate.id.slice(0, 3)] = 1 / this.rates[rate.id]
			}

			console.info(this.rates)
		})
	},

	getCurrencyRate(id) {
		return this.rates[id || this.appCurrency + this.userCurrency]
	},

	setCurrencies({from, to}) {
		this.appCurrency = to || this.appCurrency || defaultCurrency
		this.userCurrency = from || this.userCurrency || defaultCurrency
	},

	convertToApp({currency, value}) {
		if (!currency) {
			currency = settingsService.data.userCurrency
		}
		if (typeof currency !== 'string') return NaN
		if (value === undefined) return 0
		return this.convert({
			from: currency,
			to: this.appCurrency,
			value,
		})
	},

	convert({from, to, value}) {
		from = from.toUpperCase()
		to = to.toUpperCase()
		value = +value

		if (from === to) return value

		if (this.rates[from + to]) {
			return value * this.rates[from + to]
		} else {
			console.error(
				`there is no currency rate for ${from} => ${to} exchange`)
		}
	},
}


