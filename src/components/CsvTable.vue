<script>
	import Papa from 'papaparse'

	export default {
		name: 'importer',
		props: ['value'], // {data: [], mapOptions}

		data() {
			return {
				mapOptions: [
					{name: 'date', disabled: false},
					{name: 'amount', disabled: false},
					{name: 'currency', disabled: false},
					{name: 'description', disabled: false},
					{name: 'category', disabled: false}
				]
			}
		},

		watch: {
			value: {
				deep: true,
				handler() {
					this.$emit('input', this.value)
					this.$emit('change', this.value)
				}
			}
		},


		methods: {
			deleteRow: function({target}) {
				const index = target.getAttribute('value')
				this.value.data.splice(index, 1)
			},
			deleteColumn: function({target}) {
				const index = target.getAttribute('value')

				this.value.data = this.value.data.map((item) => {
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
			}
		},
	}
</script>

<template>
	<div class="widget layout-widget csvtable-widget">
		<table v-if="value.data.length">
			<tr class="centrify">
				<td></td>
				<td v-for="(field, i) in value.data[0]">
					<a class="btn btn-remove" @click="deleteColumn" :value="i">X</a>
				</td>
			</tr>
			<tr>
				<td></td>
				<td v-for="(field, i) in value.data[0]">
					<select @change="selectMapOption" v-model="value.mapColumns[i]">
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
				v-for="(item, index) in value.data"
			>
				<td>
					<a class="btn btn-remove" @click="deleteRow" :value="index">X</a>
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
	.widget {
		background: #FFF;
		overflow: auto;
	}

	.centrify {
		text-align: center;
	}

	table {
		border: 0;
		border-collapse: collapse;
	}

	td {
		padding: 3px;
	}

	tr {
		overflow: hidden;
		transition: all 0.3s;
	}

	tr:hover {
		background: #c0f3ff;
	}
</style>
