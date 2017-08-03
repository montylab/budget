import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signin from '@/components/Signin';
import Statistic from '@/components/Statistic/Statistic'

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/stat',
			name: 'Statistics',
			component: Statistic
		},
		{
			path: '/signin',
			name: 'Signin',
			component: Signin
		},
		{
			path: '/',
			name: 'Dashboard',
			component: Dashboard
		},
		{
			path: '/:yyyy/:mm',
			name: 'Dashboard',
			component: Dashboard
		},
		{
			path: '/:yyyy/',
			name: 'Dashboard',
			component: Dashboard
		},

	]
})
