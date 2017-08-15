<template>
	<div class="hello">
		<app-calendar-widget></app-calendar-widget>

		<app-datasheet-serviced-widget title="Income" :service="incomeService"></app-datasheet-serviced-widget>
		<app-datasheet-serviced-widget title="Outcome" :service="outcomeService"></app-datasheet-serviced-widget>
	</div>
</template>

<script>
	import incomeService from '@/services/income-service'
	import outcomeService from '@/services/outcome-service'
	import AppDatasheetInput from './datasheet/input.vue'

	export default {
		components: {AppDatasheetInput},
		name: 'dashboard',

		created: function() {
			outcomeService.events.$on('updated', (data) => {
				this.$data.categories = data.categories
			})
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
	h1, h2 {
		font-weight: normal;
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
</style>
