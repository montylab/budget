<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-precision',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.precision = settings.precision
			})

			this.precision = settingsService.getSettings().precision
		},

		methods: {
			change: function() {
				settingsService.change({
					precision: this.precision
				})
			},
		},
		data() {
			return {
				precision: null
			}
		}
	}
</script>

<template>
	<div class="settings-currency-widget">
		<label>Precision digits:</label>
		<input type="number" v-model="precision" @change="change">
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
