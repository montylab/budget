<template>
	<div :class="{background: true, goout: !isVisible, ready: ready}">
		<div class="centered" v-if="!hasChance">
			<div class="slider">
				<div class="slides">
					<div class="slide">
						<h3>Watch</h3>
						<h2>Your</h2>
						<h1>Budget</h1>
					</div>

					<div class="slide">
						<h3>Money</h3>
						<h2>Is Melting</h2>
						<h1>Away?</h1>
					</div>

					<div class="slide">
						<h3>Track</h3>
						<h2>Your</h2>
						<h1>Plastic</h1>
					</div>
				</div>

			</div>

			<button class="btn btn-bordered" @click="enter">Enter</button>
		</div>
		<div class="centered loader" v-else>
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
					<rect x="0" y="0" width="4" height="10" fill="#333">
					  <animateTransform attributeType="xml"
						attributeName="transform" type="translate"
						values="0 0; 0 20; 0 0"
						begin="0" dur="0.6s" repeatCount="indefinite" />
					</rect>
					<rect x="10" y="0" width="4" height="10" fill="#333">
					  <animateTransform attributeType="xml"
						attributeName="transform" type="translate"
						values="0 0; 0 20; 0 0"
						begin="0.2s" dur="0.6s" repeatCount="indefinite" />
					</rect>
					<rect x="20" y="0" width="4" height="10" fill="#333">
					  <animateTransform attributeType="xml"
						attributeName="transform" type="translate"
						values="0 0; 0 20; 0 0"
						begin="0.4s" dur="0.6s" repeatCount="indefinite" />
					</rect>
			  </svg>
		</div>
	</div>
</template>

<script>
	import authService from '@/services/auth-service.js'

	export default {
		name: 'app-splash',
		props: ['isVisible'],

		created: function() {
			this.hasChance = authService.hasChance()

			authService.events.$on('ready', ()=>this.ready = true)
			authService.events.$on('notready', ()=>this.ready = false)
		},

		methods: {
			enter() {
				authService.signin();
			},
		},
		data() {
			return {
				ready: true
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.background {
		background: #00a7c0;
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;

		display: flex;
		align-items: center;
		justify-content: space-around;

		transition: all .75s 10s;

		z-index: 9999;

		transform: translate3d(0, 0, 1px);
	}

	.goout.ready {
		transition: all .75s 0.5s;
		transform: translate3d(101%, 0, 1px);
	}

	.ready {
		transition: all .75s 0.5s;
	}

	.goout {
		transform: translate3d(100%, 0, 1px);
	}

	svg path,
	svg rect {
		fill: #FFF;
	}

	.centered {
		text-align: center;
	}

	.slider {
		overflow: hidden;
		position: relative;
		width: 100vw;
		height: 60vh;
	}

	.slides {
		display: flex;
		animation: slider3 10s forwards infinite;
	}

	@keyframes slider2 {
		0% {transform: translateX(0)}
		5% {transform: translateX(-100%)}
		50% {transform: translateX(-100%)}
		55% {transform: translateX(0)}
		100% {transform: translateX(0)}
	}

	@keyframes slider3 {
		0%   {transform: translateX(0)}
		27%  {transform: translateX(0)}
		32%  {transform: translateX(-100%)}
		59%  {transform: translateX(-100%)}
		66%  {transform: translateX(-200%)}
		91%  {transform: translateX(-200%)}
		100% {transform: translateX(0)}

	}

	.slide {
		min-width: 100%;
		height: 100%;
	}

	h1 {
		font-size: 144px;
		margin: .5em;
	}

	h2 {
		font-size: 120px;
		margin: .5em;
	}

	h3 {
		font-size: 96px;
		margin: 0 0 .5em;
	}

	.btn.btn {
		font-size: 32px;
		height: 60px;
		line-height: 60px;
		padding: 0 60px;
	}

</style>
