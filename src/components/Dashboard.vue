<template>
	<div class="widget layout-widget">
		<app-calendar-widget
			data-step="2"
			data-intro="The calendar allows you select the date interval to see statistic"
		></app-calendar-widget>

		<app-datasheet-serviced-widget
			title="Income"
			:service="incomeService"

			data-step="3"
			data-intro="Income shows how much you got"
		></app-datasheet-serviced-widget>
		<app-datasheet-serviced-widget
			title="Outcome"
			:service="outcomeService"
			data-step="10"
			data-intro="Outcome shows how much you spent"
		></app-datasheet-serviced-widget>
	</div>
</template>

<script>
	import incomeService from '@/services/income-service'
	import outcomeService from '@/services/outcome-service'
	import AppDatasheetInput from './datasheet/input.vue'
	import authService from '@/services/auth-service'

	export default {
		components: {AppDatasheetInput},
		name: 'dashboard',

		created: function() {
			outcomeService.events.$on('updated', (data) => {
				this.$data.categories = data.categories
			})

			authService.notReady()
		},

		methods: {
			change: (data)=>console.log(data)
		},

		data() {
			return {
				incomeService,
				outcomeService,
				categories: outcomeService.getCategories(),
				category: 'category:subcategory',
				description: 'description',
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
