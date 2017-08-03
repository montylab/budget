import Vue from 'vue';
import moment from 'moment';

export default {
	events: new Vue(),

	current: {
		year: moment().format('YYYY'),
		month: moment().format('MM')
	},

	selected: {
		year: null,
		month: null
	},

	changeSelected: function (year, month) {
		this.selected.year = +year;
		this.selected.month = +month;
		this.events.$emit('selectedChanged', this.selected);
	},

	update: function (year, month) {
		this.events.$emit('selectedChanged', this.selected);
	},

	getMonthTimestamps(year, month) {
		if (!year || !month) {
			month = this.current.month;
			year = this.current.year;
		}

		const start = +moment('01-'+month+'-'+year, "DD-MM-YYYY")._d;
		month = month+1 < 13 ? month+1 : 1;
		const end = +moment('01-'+month+'-'+year, "DD-MM-YYYY")._d;

		return {
			start: start,
			end: end
		}
	},

	getYearTimestamps(year) {
		return {
			start: +moment('01-01-'+year, "DD-MM-YYYY")._d,
			end: +moment('01-01-'+(year+1), "DD-MM-YYYY")._d
		}
	},

	getYearArrayFrom(year) {
		if (!year || moment().format('YYYY') < year) {
			return [moment().format('YYYY')];
		}
		const arr=[];
		for (let i=year; i<=moment().format('YYYY'); i++) {
			arr.push(i);
		}
		return arr;
	},

	getMonthNameArray() {
		return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];
	},

	toTimestamp(date, format) {
		return +moment(date, format)._d;
	},
	fromTimestamp(date, format) {
		return moment(date).format(format);
	},

  endOfSelectedMonth(){
	  const date = new Date(0)
    date.setFullYear(this.selected.year)
    date.setMonth(this.selected.month)
    date.setDate(1)
    date.setHours(0)

	  return date-1
  }
}
