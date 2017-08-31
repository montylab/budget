<script>
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-autocategoriser-switcher',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.autocategoriser = settings.autocategoriser
			})
			this.autocategoriser = settingsService.getSettings().autocategoriser
		},

		watch: {
			autocategoriser: function () {
				settingsService.change({autocategoriser: this.autocategoriser})
			}
		},
		data() {
			return {
				autocategoriser: null,
			}
		},
	}
</script>

<template>
	<app-controls-switcher v-model="autocategoriser" title="Enable Autocategoriser"></app-controls-switcher>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
