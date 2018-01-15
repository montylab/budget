<script>
	import authService from '@/services/auth-service.js'
	import settingsService from '@/services/settings-service.js'

	export default {
		name: 'header',
		created: function() {
			authService.events.$on('authStateChanged', user => {
				this.userAuthorized = !!user
				this.name = user && user.displayName
				this.email = user && user.email
				this.$nextTick()
			})

			settingsService.events.$on('updated', ({settings}) => {
				this.greetingType = settings.greetings
			})

			window.addEventListener('click', this.toggleDropdown)
		},

		beforeDestroy() {
			window.removeEventListener('click', this.toggleDropdown)
		},

		methods: {
			toggleDropdown(e) {
				if (e.currentTarget === this.$refs.toggler) {
					setTimeout(() => this.$refs.dropdown.classList.toggle('open'))
					console.log('toggle')
				} else if (this.$refs.dropdown.classList.contains('open') && e.target !== this.$refs.toggler) {
					this.$refs.dropdown.classList.remove('open')
					console.log('remove')
				}
			},
			signout() {
				authService.signout()
				setTimeout(()=>this.$router.push('/'), 500)
			},

			tutorial() {
				introJs().start()
			}
		},

		computed: {
			greeting: function() {
				return this[this.greetingType]
			},
		},

		data() {
			return {
				userAuthorized: !!authService.user,
				name: authService.user && authService.user.displayName,
				email: authService.user && authService.user.email,
				none: 'menu',
				greetingType: settingsService.data.greetings,
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
			<a @click="tutorial">Tutorial</a>

			<div class="right">
				<router-link to="/signin" v-if="!userAuthorized">Sign in</router-link>
				<b
					v-if="userAuthorized"
					@click="toggleDropdown"
					ref="toggler"
					data-step="1"
					data-intro="The option menu"
				>{{greeting}}</b>

				<div class="dropdown" ref="dropdown">
					<router-link to="/import">Import</router-link>
					<router-link to="/export">Export</router-link>
					<router-link to="/backup">Backup</router-link>
					<a @click="signout">Sign Out</a>
				</div>
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

	.dropdown {
		max-height: 0;
		overflow: hidden;
		position: absolute;
		top: 40px;
		right: 0;
		background: #FFF;
		line-height: 36px;
		min-width: 100px;
		box-shadow: 0 1px 14px -2px #888;

		animation: dropdown-close .25s forwards;
	}

	.dropdown.open {
		animation: dropdown-open .25s forwards;
	}

	.dropdown:before {
		content: '';
		position: absolute;

		left: calc(50% - 4px);

		background: #FFF;

		border: 1px solid #eee;
		border-width: 0;

		top: 10px;

		width: 8px;
		height: 8px;

		transform: rotate(0.125turn);
		transition: top 0.2s, z-index 0.2s;
		z-index: -1;
	}

	.dropdown.open:before {
		top: -5px;
		z-index: 1;
		border-width: 1px 0 0 1px;
	}

	@keyframes dropdown-open {
		0% {
			overflow: hidden;
			max-height: 0;
			opacity: 0;
		}
		20% {
			opacity: 0;
		}
		80% {
			top: 74px;
		}
		100% {
			opacity: 1;
			top: 72px;
			max-height: 200px;
			overflow: visible
		}
	}

	@keyframes dropdown-close {
		100% {
			overflow: hidden;
			max-height: 0;
			opacity: 0;
		}
		80% {
			opacity: 0;
		}
		20% {
			top: 74px;
		}
		0% {
			opacity: 1;
			top: 72px;
			max-height: 200px;
			overflow: visible
		}
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
		align-items: center;
		position: relative;
	}

	.right .dropdown a {
		margin: 0;
		padding: 0 0 0 10px;
		font-size: 16px;
		line-height: 28px;
		border-bottom: 1px solid #EEE;
		display: block;
		position: relative;
		z-index: 2;
	}

	.right .dropdown a:hover {
		background: #F6F6F6;

	}

	.right b {
		cursor: pointer;
		line-height: 32px;
	}
</style>
