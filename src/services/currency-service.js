const defaultCurrency = 'USD'

export default {
  url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22{%curencies%}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
  appCurrency: 'USD',
  userCurrency: 'BYN',
  rates: {
    'USDBYN': 1.93
  },

  getCurrencyUrl: function () {
    return this.url.replace("{%curencies%}", this.appCurrency+this.userCurrency)
  },

  fetchCurrencyRate: function () {
    fetch(this.getCurrencyUrl()).then(blob => blob.json()).then(data => {
      if (data && data.query && data.query.results && data.query.results.rate) {
        const {rate} = data.query.results
        this.rates[rate.id] = (+rate.Ask + +rate.Bid)/2
      }

      console.info(this.rates)
    })
  },

  getCurrencyRate: function (id) {
    return this.rates[id || this.appCurrency+this.userCurrency]
  },

  setCurrencies({from, to}) {
    this.appCurrency = to || this.appCurrency || defaultCurrency
    this.userCurrency = from || this.userCurrency || defaultCurrency
  }

}
