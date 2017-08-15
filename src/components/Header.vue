
<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'header',
		created: function() {
			authService.events.$on('authStateChanged', user => {
				this.userAuthorized = !!user
				this.name = user.displayName
				this.email = user.email
				this.$nextTick()
			})

			settingsService.events.$on('updated', ({settings}) => {
				this.greetingType = settings.greeting
			});
		},

		methods: {},

		computed: {
			greeting: function () {
				return this[this.greetingType]
			}
		},

		data() {
			return {
				userAuthorized: false,
				username: null,
				email: null,
				none: '',
				greetingType: 'none'
			}
		},
	}
</script>

<template>
	<div class="header">
		<div class="wrapper">
			<router-link to="/">Dashboard</router-link>
			<router-link to="/stat">Statistics</router-link>
			<router-link to="/settings">Settings</router-link>
			<router-link to="/import">Import</router-link>
			<router-link to="/export">Export</router-link>

			<div class="right">
				<router-link to="/signin" v-if="!userAuthorized">Sign in</router-link>
				<h3 v-if="userAuthorized">{{greeting}}</h3>
			</div>
		</div>
	</div>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	a {
		color: #222;
		font-size: 18px;
		text-decoration: none;
		margin-right: 40px;
	}

	.right a {
		margin: 0 0 0 40px;
	}

	.header {
		height: 60px;
		line-height: 60px;
		background: #FFF;
		margin-bottom: 40px;
	}

	.right {
		margin: 0 0 0 auto;
		display: flex;
		align-items: center
	}
</style>
