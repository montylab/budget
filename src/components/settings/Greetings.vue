<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-greetings',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.greetings = settings.greetings
				this.greetingsOptions = settings.greetingsOptions
			})

			this.greetings = settingsService.getSettings().greetings
			this.greetingsOptions = settingsService.getSettings().greetingsOptions
		},

		methods: {
			change: function() {
				settingsService.change({
					greetings: this.greetings,
				})
			},
		},
		data() {
			return {
				greetings: null,
				greetingsOptions: []
			}
		},
	}
</script>

<template>
	<div class="settings-currency-widget">
		<label>Greetings</label>

		<select v-model="greetings" @change="change">
			<option
				v-for="item in greetingsOptions"
				:value="item"
			>{{item}}
			</option>
		</select>
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
