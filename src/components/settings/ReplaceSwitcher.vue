<script>
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'settings-replace-switcher',

		created() {
			settingsService.events.$on('updated', ({settings}) => {
				this.replace = settings.replace
			})
			this.replace = settingsService.getSettings().replace
		},

		watch: {
			replace: function () {
				settingsService.change({replace: this.replace})
			}
		},
		data() {
			return {
				replace: null,
			}
		},
	}
</script>

<template>
	<app-controls-switcher v-model="replace" title="Enable Auto Replace"></app-controls-switcher>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
