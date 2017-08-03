<template>
    <div class="header">
        <div class="wrapper">
            <router-link to="/">Dashboard</router-link>
            <router-link to="/stat">Statistics</router-link>
            <router-link to="/settings">Settings</router-link>

            <div class="right">
                {{userAuthorized}}
                <router-link to="/signin" v-if="!userAuthorized">Sign in</router-link>
            </div>
        </div>
    </div>
</template>

<script>
	import authService from '@/services/auth-service.js';

	export default {
		name: 'header',
        created: function () {
			authService.events.$on('authStateChanged', user => {
				this.$data.userAuthorized = !!user;
            });
        },

        methods: {

        },

		data () {
			return {
				userAuthorized: false
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    a {
        color: #222;
        font-size: 18px;
        text-decoration: none;
        margin-right:  40px;
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
    }
</style>
