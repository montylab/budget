<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-replace',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.replacers = settings.replacers
			})
			this.replacers = settingsService.getSettings().replacers
		},

		methods: {
			addNew: function() {
				this.replacers.push({from: '', to: '', enabled: true})
				this.change()
			},

			remove: function({target}) {
				const index = +target.getAttribute('index')
				this.replacers = [
					...this.replacers.slice(0, index),
					...this.replacers.slice(index + 1)
				]
				this.change()
			},

			change: function() {
				settingsService.change({replacers: this.replacers})
			},
		},
		data() {
			return {
				replacers: [],
			}
		},
	}
</script>

<template>
	<div class="settings-replace-widget">
		<table>
			<tr>
				<th><label>Enabled</label></th>
				<th><label>Replace from</label></th>
				<th><label>Replace to</label></th>
				<th><label>Remove</label></th>
			</tr>
			<tr v-for="(replacer, index) in replacers">
				<td>
					<app-controls-checkbox
						v-model="replacer.enabled"
						@change="change"
					></app-controls-checkbox>
				</td>
				<td>
					<input type="text" v-model="replacer.from" @change="change" placeholder="Empty string">
				</td>
				<td>
					<input type="text" v-model="replacer.to" @change="change" placeholder="Empty string">
				</td>
				<td>
					<a class="btn btn-remove" @click="remove" :index="index">X</a>
				</td>
			</tr>
		</table>

		<a class="btn btn-add" @click="addNew">Add New Replacer</a>
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.ctrlInlineLabel {
		margin: 0 auto;
		width: 24px;
	}


	table {
		/*width: 100%;*/
	}

	td {
		text-align: center;
	}

	td, th {
		border: 20px solid transparent;
		border-width: 10px 20px
	}

	th {
		border-bottom: 0;
	}

</style>
