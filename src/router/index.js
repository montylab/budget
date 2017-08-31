import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Signin from '@/components/Signin'
import Statistic from '@/components/Statistic/Statistic'
import Settings from '@/components/Settings'
import Importer from '@/components/Importer'
import Exporter from '@/components/Exporter'
import Backup from '@/components/Backup'

import Splash from '@/components/Splash'

import authService from '@/services/auth-service'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/stat',
			name: 'Statistics',
			component: Statistic,
		},
		{
			path: '/backup',
			name: 'Backup',
			component: Backup,
		},
		{
			path: '/settings',
			name: 'Settings',
			component: Settings,
		},
		{
			path: '/signin',
			name: 'Signin',
			component: Signin,
		},
		{
			path: '/import',
			name: 'Import',
			component: Importer,
		},
		{
			path: '/export',
			name: 'Export',
			component: Exporter,
		},
		{
			path: '/',
			name: 'Dashboard',
			component: Dashboard,
		},
		{
			path: '/:yyyy/:mm',
			name: 'DashboardMonth',
			component: Dashboard,
		},
		{
			path: '/:yyyy/',
			name: 'DashboardYear',
			component: Dashboard,
		},

	]
})

router.beforeEach( (to, from, next) => {
	if (!authService.authorized()) {
		authService.events.$on('authStateChanged', user => !!user && next())
	} else {
		next()
	}

	// ...
})


export default router
