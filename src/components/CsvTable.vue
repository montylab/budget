<script>
	import Papa from 'papaparse'

	export default {
		name: 'importer',
		props: ['input'],


		watch: {
			input: {
				handler: function() {
					this.result = JSON.parse(JSON.stringify(this.input))
					console.log(this.result.length)
				},
				deep: true
			},

			result: function () {
				this.$emit('change', {
					items: JSON.parse(JSON.stringify(this.result)),
					mapNames: this.mapNames
				})
			},

			mapNames: function() {
				this.$emit('change', {
					items: JSON.parse(JSON.stringify(this.result)),
					mapNames: this.mapNames
				})
			}
		},


		methods: {
			deleteRow: function({target}) {
				const index = target.getAttribute('value')
				//target.closest('tr').style.transform = 'scaleY(0.1)'

				setTimeout(() => {
					this.result.splice(index, 1)
				}, 300)

			},
			deleteColumn: function({target}) {
				const index = target.getAttribute('value')

				this.result = this.result.map((item) => {
					item.splice(index, 1)
					return item
				})
			},

			selectMapOption: function ({target}) {
				const val = target.value
				const prevVal = target.getAttribute('prevValue')
				target.setAttribute('prevValue', val)
				const el = this.mapOptions.find(item => item.name == val)
				const prevEl = this.mapOptions.find(item => item.name == prevVal)
				el && (el.disabled = !el.disabled)
				prevEl && (prevEl.disabled = !prevEl.disabled)

				console.log(this.mapNames)
			}
		},

		data() {
			return {
				result: [],
				mapNames: [],
				mapOptions: [
					{name: 'date', disabled: false},
					{name: 'amount', disabled: false},
					{name: 'curency', disabled: false},
					{name: 'description', disabled: false},
					{name: 'category', disabled: false}
				]
			}
		},
	}
</script>

<template>
	<div>
		<table v-if="result.length">
			<tr>
				<td></td>
				<td v-for="(field, i) in result[0]">
					<a class="btn delete" @click="deleteColumn" :value="i">X</a>
				</td>
			</tr>
			<tr>
				<td></td>
				<td v-for="(field, i) in result[0]">
					<select @change="selectMapOption" v-model="mapNames[i]">
						<option>none</option>
						<option
							v-for="option in mapOptions"
							:value="option.name"
							:disabled="option.disabled"
						>{{option.name}}</option>
					</select>
				</td>
			</tr>
			<tr
				v-for="(item, index) in result"
			>
				<td>
					<a class="btn delete" @click="deleteRow" :value="index">X</a>
				</td>
				<td
					v-for="field in item"
				>{{field}}
				</td>
			</tr>
		</table>
	</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.delete {
		background: coral;
		border: 0;
	}

	table {
		border: 0;
		border-collapse: collapse;
	}

	tr {
		overflow: hidden;
		transition: all 0.3s;
	}

	tr:hover {
		background: #FFF;
	}
</style>
