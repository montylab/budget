<template>
    <div class="signin-widget">
        <h2>
            Looks like you have no choice : )
        </h2>
        <br>
        <button class="btn google" @click="google">Google</button>
        <!--<button class="btn facebook" @click="facebook">Facebook</button>-->
    </div>
</template>

<script>
    import authService from '@/services/auth-service.js';

	export default {
		name: 'signin',
        methods: {
			google: ()=> {
				authService.signin();
			},
			facebook: ()=> {
				alert('lol, kek, wrong choice!');
			}
        },
		data () {
			return {}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .google {
        background: #ff504a;
        border-color: #bf3833;
    }

    .facebook {
        background: #068eff;
        border-color: #0469be;
    }

</style>
