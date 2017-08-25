<template>
	<div class="settings-widget layout-widget">
		<h1>Application Interface</h1>

		<div class="flexGroup">
			<div class="flex controlSize">
				<app-settings-greetings-widget></app-settings-greetings-widget>
			</div>
			<div class="flex controlSize">
				<app-settings-precision-widget></app-settings-precision-widget>
			</div>
		</div>

		<h1>Currency Settings</h1>

		<div class="flexGroup">
			<div class="flex controlSize">
				<app-settings-currency-widget showCurrency="user"></app-settings-currency-widget>
			</div>
			<div class="flex controlSize">
				<app-settings-currency-widget showCurrency="app"></app-settings-currency-widget>
			</div>
		</div>

		<h1>Replace</h1>

		<app-settings-replace-switcher-widget></app-settings-replace-switcher-widget>

		<app-settings-replace-widget v-if="settings.replace"></app-settings-replace-widget>



		<br>
		<br>
		<small>it saves automatically, magic</small>
	</div>
</template>

<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.settings = settings
			})
		},

		methods: {
			save: () => {

			},

			change: ({target}) => {
				settingsService.change({[target.id]: target.value})

			},
		},
		data() {
			return {
				settings: settingsService.data,
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
