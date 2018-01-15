<script>
	import 'amcharts3'
	import 'amcharts3/amcharts/serial'

	export default {
		props: ['service', 'title'],

		data() {
			return {
				rawData: [],
				categories: [],
				type: 'percent'
			}
		},

		computed: {
			chartData: function () {
				const data = this.rawData
				const result = {}

				data.forEach(item => {
					const category = item.category.split(':')
					if (category.length) {
						const cat = category[0].trim() || 'unknown'

						if (!result[cat]) {
							result[cat] = {
								type: cat,
								percent: 0,
								amount: 0,
								value: 0,
								subs: {}
							}
							console.log(cat)
						}


						if (category[1]) {
							if (!result[cat].subs[category[1]]) {
								result[cat].subs[category[1]] = {
									type: category[1],
									percent: 0,
									amount: 0,
									value: 0
								}
							}
							result[cat].subs[category[1]].amount += item.amount
						}
						result[cat].amount += item.amount
					}
				})

				// normalize
				const total = Object.values(result).reduce((acc, item) => acc + item.amount, 0)
				for (let key in result) {
					const item = result[key]
					item.color = '#' + Math.random().toString(16).slice(5, 8)

					item.subs = Object.values(item.subs)
					const sunsTotal = item.subs.reduce((acc, item) => acc + item.amount, 0)
					item.subs.forEach(sub => {
						sub.percent = (sub.amount * 100 / total).toFixed(1)
						sub.value = this.type === 'percent' ? sub.percent : sub.amount
					})


					item.percent = (item.amount * 100 / total).toFixed(1)
					item.amount = ~~item.amount
					item.value = this.type === 'percent' ? item.percent : item.amount
				}

				return Object.values(result).sort((a,b)=>b.amount - a.amount)
			}
		},


		created: function () {
			this.service.events.$on('updated', (data) => {
				this.rawData = data.items
				this.categories = data.categories

				this.init()
			})
		},

		mounted() {
			this.rawData = this.service.getItemsArray()
			this.categories = this.service.getCategories()

			this.init()
		},

		methods: {
			init: function () {
				var chart = AmCharts.makeChart(this.$el.querySelector('.categoryBarChart'), {
					'type': 'serial',
					'theme': 'light',
					'dataProvider': this.chartData,
					'valueAxes': [{
						'gridColor': '#FFFFFF',
						'gridAlpha': 0.2,
						'dashLength': 0
					}],
					'gridAboveGraphs': true,
					'startDuration': 1,
					'graphs': [{
						'balloonText': '[[category]]: <b>[[value]]</b>',
						'fillAlphas': 0.8,
						'lineAlpha': 0.2,
						'type': 'column',
						'valueField': 'amount'
					}],
					'chartCursor': {
						'categoryBalloonEnabled': false,
						'cursorAlpha': 0,
						'zoomable': false
					},
					'categoryField': 'type',
					'categoryAxis': {
						'gridPosition': 'start',
						'gridAlpha': 0,
						'tickPosition': 'start',
						'tickLength': 20
					},
					'export': {
						'enabled': true
					}

				})
			},

			switchChartType: function () {
				this.type = this.type === 'percent' ? 'absolute' : 'percent'
				this.init()
			}
		}
	}


</script>

<template>
    <div class="flex">
        <h1>{{title}} +1</h1>
        <div class="categoryBarChart"></div>
        <a class="btn" v-on:click="switchChartType">Percent / Absolute</a>
    </div>


</template>

<style scoped>
    .categoryBarChart {
        width: 100%;
        height: 500px;
        font-size: 11px;
    }
</style>
