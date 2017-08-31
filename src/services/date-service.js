import Vue from 'vue'
import moment from 'moment'
import momentParseFormat from 'moment-parseformat'

export default {
	events: new Vue(),

	current: {
		year: moment().format('YYYY'),
		month: moment().format('MM'),
	},

	selected: {
		year: null,
		month: null,
	},

	changeSelected: function(year, month) {
		this.selected.year = +year
		this.selected.month = +month
		this.events.$emit('selectedChanged', this.selected)
	},

	update: function(year, month) {
		this.events.$emit('selectedChanged', this.selected)
	},

	getMonthTimestamps(year, month) {
		if (!year || !month) {
			month = this.current.month
			year = this.current.year
		}

		const start = +moment('01-' + this.zeroify(month) + '-' + year,
			'DD-MM-YYYY')._d
		month = +month + 1 < 13 ? +month + 1 : 1
		const end = +moment('01-' + this.zeroify(month) + '-' + year,
			'DD-MM-YYYY')._d

		return {
			start: start,
			end: end,
		}
	},

	zeroify(x) {
		return (+x) < 10 ? '0' + +x : x
	},

	getYearTimestamps(year) {
		return {
			start: +moment('01-01-' + year, 'DD-MM-YYYY')._d,
			end: +moment('01-01-' + (year + 1), 'DD-MM-YYYY')._d,
		}
	},

	getYearArrayFrom(year) {
		if (!year || moment().format('YYYY') < year) {
			return [moment().format('YYYY')]
		}
		const arr = []
		for (let i = year; i <= moment().format('YYYY'); i++) {
			arr.push(i)
		}
		return arr
	},

	getMonthNameArray() {
		return [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December']
	},

	toTimestamp(date, format) {
		return +moment(date, format)._d
	},
	fromTimestamp(date, format) {
		return moment(date).format(format)
	},

	fromNow(date) {
		return moment(date).fromNow()
	},

	endOfSelectedMonth() {
		const date = new Date(0)
		date.setFullYear(this.selected.year)
		date.setMonth(this.selected.month)
		date.setDate(1)
		date.setHours(0)

		return date - 1
	},

	determineDateFormat: function (dateArray) {
		if (!(dateArray instanceof Array)) return this.determineDateFormat([dateArray])

		const formats = {}
		dateArray.forEach(item => {
			if (item) {
				const format = momentParseFormat(item)
				formats[format] = formats[format] ? formats[format] + 1 : 1
			}
		})

		let format = null
		let max = 0
		for (let key in formats) {
			if (formats[key] > max) {
				max = formats[key]
				format = key
			}
		}

		return format
	},

	strToTimestamp: function(str, format) {
		return +moment(str, format)._d
	}
}
