// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'

import App from './App'
import Header from '@/components/Header'
import Splash from '@/components/Splash'
import Calendar from '@/components/Calendar'
import Settings from '@/components/Settings'
import Importer from '@/components/Importer'
import Exporter from '@/components/Exporter'
import Backup from '@/components/Backup'

import Modal from '@/components/Modal'

import Replace from '@/components/settings/Replace'
import Currency from '@/components/settings/Currency'
import Precision from '@/components/settings/Precision'
import Greetings from '@/components/settings/Greetings'
import ReplaceSwitcher from '@/components/settings/ReplaceSwitcher'
import Autocategoriser from '@/components/settings/Autocategoriser'

import Switcher from '@/components/controls/Switcher'
import Radio from '@/components/controls/Radio'
import Checkbox from '@/components/controls/Checkbox'

import SummaryChart from '@/components/Statistic/SummaryChart'
import InOutChart from '@/components/Statistic/InOutChart.vue'
import CategoryPieChart from '@/components/Statistic/CategoryPieChart'
import CategoryBarChart from '@/components/Statistic/CategoryBarChart'

import Datasheet from '@/components/datasheet'
import ServicedDatasheet from '@/components/datasheet/serviced'
import DatasheetItem from '@/components/datasheet/item'
import DatasheetInput from '@/components/datasheet/input'
import DatasheetDropdown from '@/components/datasheet/dropdown'
import CsvTable from '@/components/CsvTable'

import * as firebase from 'firebase'

import authService from './services/auth-service'
import currencyService from './services/currency-service'

//todo make service for app setting or move to settings service
import {introJs} from 'intro.js/intro'
window.introJs = introJs


Vue.component('app-header', Header)
Vue.component('app-splash', Splash)
Vue.component('app-backup', Backup)
Vue.component('app-calendar-widget', Calendar)

Vue.component('app-settings-widget', Settings)
Vue.component('app-importer-widget', Importer)
Vue.component('app-exporter-widget', Exporter)
Vue.component('app-csv-table-widget', CsvTable)
Vue.component('app-datasheet-widget', Datasheet)
Vue.component('app-datasheet-serviced-widget', ServicedDatasheet)
Vue.component('app-datasheet-item',   DatasheetItem)
Vue.component('app-datasheet-input',   DatasheetInput)
Vue.component('app-datasheet-dropdown',   DatasheetDropdown)

Vue.component('app-modal-widget', Modal)
Vue.component('app-settings-replace-widget', Replace)
Vue.component('app-settings-currency-widget', Currency)
Vue.component('app-settings-precision-widget', Precision)
Vue.component('app-settings-greetings-widget', Greetings)
Vue.component('app-settings-replace-switcher-widget', ReplaceSwitcher)
Vue.component('app-autocategoriser', Autocategoriser)

Vue.component('app-controls-switcher', Switcher)
Vue.component('app-controls-radio', Radio)
Vue.component('app-controls-checkbox', Checkbox)


Vue.component('app-chart-summary', SummaryChart)
Vue.component('app-chart-in-out', InOutChart)
Vue.component('app-chart-category-pie', CategoryPieChart)
Vue.component('app-chart-category-bar', CategoryBarChart)



Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App,
		Calendar,
		Importer,
		Exporter,
		Datasheet,
		ServicedDatasheet,
		DatasheetItem,
		CsvTable,
		SummaryChart,
		InOutChart,
		CategoryPieChart,
		Modal,
		Settings,

	}
});


// Initialize Firebase & Auth
authService.init()
currencyService.init()

