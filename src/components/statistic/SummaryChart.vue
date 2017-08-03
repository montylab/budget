<template>
    <svg width="960" height="500" id="chart_summary" data-svg-summary></svg>
</template>

<script>
	import outcomeService from '@/services/outcome-service'

	export default {
		data () {
			return {
				outcome: {}
			}
		},

		computed: {
			outcomeSummarized: function () {
				let acc = 0

				const result = this.outcome.map((x) => {
					acc += x.amount
					return {
						amount: acc,
						date: new Date(x.date)
                    }
				})
				return result
			}
		},


		created: function () {
			outcomeService.events.$on('updated', (data) => {
				if (data.items && Object.keys(data.items).length) {

					this.$data.outcome = data.items;
					this.$data.categories = data.categories;
                	this.init()
				}
			})
		},


		mounted: function () {
			const outcome = outcomeService.getItemsArray()
			if (outcome.length) {
				this.$data.outcome = outcome
				this.$data.categories = outcomeService.getCategories()

				this.init()
			}
		},

		methods: {
			init () {
				var svg = d3.select("#chart_summary"),
					margin = {
						top: 20,
						right: 20,
						bottom: 110,
						left: 40
					},
					margin2 = {
						top: 430,
						right: 20,
						bottom: 30,
						left: 40
					}

				if (!svg || !svg._groups[0][0]) return
				svg.selectAll("*").remove()

				const width = +svg.attr("width") - margin.left - margin.right
				const height = +svg.attr("height") - margin.top - margin.bottom
				const height2 = +svg.attr("height") - margin2.top - margin2.bottom


				const x = d3.scaleTime().range([0, width])
				const x2 = d3.scaleTime().range([0, width])
				const y = d3.scaleLinear().range([height, 0])
				const y2 = d3.scaleLinear().range([height2, 0])

				const xAxis = d3.axisBottom(x)
				const xAxis2 = d3.axisBottom(x2)
				const yAxis = d3.axisLeft(y)

				const brush = d3.brushX()
					.extent([[0, 0], [width, height2]])
					.on("brush end", brushed)

				const zoom = d3.zoom()
					.scaleExtent([1, Infinity])
					.translateExtent([[0, 0], [width, height]])
					.extent([[0, 0], [width, height]])
					.on("zoom", zoomed)

				const area = d3.area()
					.curve(d3.curveMonotoneX)
					.x(function (d) {
						return x(d.date)
					})
					.y0(height)
					.y1(function (d) {
						return y(d.amount)
					});

				const area2 = d3.area()
					.curve(d3.curveMonotoneX)
					.x(function (d) {
						return x2(d.date)
					})
					.y0(height2)
					.y1(function (d) {
						return y2(d.amount)
					})

				svg.append("defs").append("clipPath")
					.attr("id", "clip")
					.append("rect")
					.attr("width", width)
					.attr("height", height)

				const focus = svg.append("g")
					.attr("class", "focus")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

				const context = svg.append("g")
					.attr("class", "context")
					.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
				
				if (this.outcomeSummarized && this.outcomeSummarized.length) {
					processData(null, this.outcomeSummarized)
				}

				function processData(error, data) {
					if (error) throw error

					x.domain(d3.extent(data, function (d) {
						return d.date
					}));
					y.domain([0, d3.max(data, function (d) {
						return d.amount
					})]);

					x2.domain(x.domain())
					y2.domain(y.domain())

					focus.append("path")
						.datum(data)
						.attr("class", "area")
						.attr("d", area);

					focus.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					focus.append("g")
						.attr("class", "axis axis--y")
						.call(yAxis);

					context.append("path")
						.datum(data)
						.attr("class", "area")
						.attr("d", area2);

					context.append("g")
						.attr("class", "axis axis--x")
						.attr("transform", "translate(0," + height2 + ")")
						.call(xAxis2)

					context.append("g")
						.attr("class", "brush")
						.call(brush)
						.call(brush.move, x.range())

					svg.append("rect")
						.attr("class", "zoom")
						.attr("width", width)
						.attr("height", height)
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
						.call(zoom);
				}

				function brushed() {
					if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return // ignore brush-by-zoom
					const s = d3.event.selection || x2.range()
					x.domain(s.map(x2.invert, x2))
					focus.select(".area").attr("d", area)
					focus.select(".axis--x").call(xAxis)
					svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
						.scale(width / (s[1] - s[0]))
						.translate(-s[0], 0))
				}

				function zoomed() {
					if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return // ignore zoom-by-brush
					const t = d3.event.transform
					x.domain(t.rescaleX(x2).domain())
					focus.select(".area").attr("d", area)
					focus.select(".axis--x").call(xAxis)
					context.select(".brush").call(brush.move, x.range().map(t.invertX, t))
				}
			}
		}
	}
</script>

<style>
    svg .area {
        fill: white;
        clip-path: url(#clip);
    }

    svg .zoom {
        cursor: move;
        fill: none;
        pointer-events: all;
    }

    svg .focus {
        fill: azure;
    }
</style>