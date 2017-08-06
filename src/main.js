// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'

import App from './App'
import Header from '@/components/Header'
import Calendar from '@/components/Calendar'
import Settings from '@/components/Settings'

import SummaryChart from '@/components/Statistic/SummaryChart'
import InOutChart from '@/components/Statistic/InOutChart.vue'
import CategoryPieChart from '@/components/Statistic/CategoryPieChart'

import Datasheet from '@/components/datasheet'
import DatasheetItem from '@/components/datasheet/item'

import * as firebase from 'firebase'

import authService from './services/auth-service'
import currencyService from './services/currency-service'

Vue.component('app-header', Header)
Vue.component('app-calendar-widget', Calendar)
Vue.component('app-settings-widget', Settings)
Vue.component('app-datasheet-widget', Datasheet)
Vue.component('app-datasheet-item',   DatasheetItem)


Vue.component('app-chart-summary', SummaryChart)
Vue.component('app-chart-in-out', InOutChart)
Vue.component('app-chart-category-pie', CategoryPieChart)



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App,
		Calendar,
    Settings,

		Datasheet,
		DatasheetItem,

		SummaryChart,
		InOutChart,
		CategoryPieChart
	}
});


// Initialize Firebase & Auth
authService.init()
currencyService.fetchCurrencyRate()

