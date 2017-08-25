<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-replace',
		props: ['showCurrency'],

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.appCurrency = settings.appCurrency || 'USD'
				this.userCurrency = settings.userCurrency || 'BYN'
			})

			this.appCurrency = settingsService.getSettings().appCurrency || 'USD'
			this.userCurrency = settingsService.getSettings().userCurrency || 'BYN'
		},

		methods: {
			change: function() {
				settingsService.change({
					appCurrency: this.appCurrency,
					userCurrency: this.userCurrency,
				})
			},
		},

		computed: {
			showUser: function() {
				return !this.showCurrency || this.showCurrency === 'user'
			},
			showApp: function() {
				return !this.showCurrency || this.showCurrency === 'app'
			},
		},

		data() {
			return {
				appCurrency: 'USD',
				userCurrency: 'BYN',
			}
		},
	}
</script>

<template>
	<div class="settings-currency-widget">
		<div v-if="showUser">
			<label>User Currency</label>
			<select v-model="userCurrency" @change="change">
				<option value="USD">USD</option>
				<option value="BYN">BYN</option>
				<option value="EUR">EUR</option>
			</select>
		</div>


		<div v-if="showApp">
			<label>App Currency</label>
			<select v-model="appCurrency" @change="change">
				<option value="USD">USD</option>
				<option value="BYN">BYN</option>
				<option value="EUR">EUR</option>
			</select>
		</div>


	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
