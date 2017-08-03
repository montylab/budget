<template>
    <div class="hello">
        <app-calendar-widget></app-calendar-widget>
        <!--<app-income-widget></app-income-widget>-->
        <!--<app-outcome-widget></app-outcome-widget>-->
        <app-datasheet-widget title="Income" :service="incomeService"></app-datasheet-widget>
        <app-datasheet-widget title="Outcome" :service="outcomeService"></app-datasheet-widget>
    </div>
</template>

<script>
    import incomeService from '@/services/income-service'
    import outcomeService from '@/services/outcome-service'

	export default {
		name: 'dashboard',
		data () {
			return {
				incomeService,
				outcomeService
            }
		}
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
