<template>
	<div id="app">
		<app-header v-if="authorized"></app-header>

		<div class="wrapper">
			<router-view></router-view>
		</div>

		<app-splash :isVisible="!authorized"></app-splash>
	</div>

</template>

<script>


	import authService from '@/services/auth-service'

	export default {
		name: 'app',

		created() {
			authService.events.$on('authStateChanged', (user) => {
				this.authorized = !!user
				console.log(this.authorized)
			})
		},


		data() {
			return {
				authorized: authService.authorized(),
			}
		},
	}
</script>


<style>
	@import url('https://fonts.googleapis.com/css?family=Noto+Sans:400,700&subset=cyrillic');

	body {
		font: 400 14px/18px Noto Sans, Arial, sans-serif;

		margin: 0;
		padding-bottom: 90px;
		background: #00BCD4;
		color: #333;

		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.btn.btn {
		height: 36px;
		line-height: 36px;
		font-size: 18px;
		text-align: center;
		color: #00bcd4;
		border: 0;
		border-radius: 3px;
		padding: 0 25px;
		cursor: pointer;
		outline: none;
		background-color: #FFF;
		display: inline-block;
		transition: all .2s;
		text-decoration: none;
	}

	.btn:hover {
		box-shadow: 0 1px 9px -5px #000;
	}


	.hovered{
		transition: bpx-shadow .2s;
	}
	.hovered:hover {
		box-shadow: 0 1px 9px -5px #000;
	}

	.inversed .btn {
		color: #FFF;
		background-color: #00bcd4;
	}

	.btn.btn-dark {
		background-color: #333;
		color: #FFF
	}

	.btn.btn-red {
		background-color: coral;
		color: #FFF
	}

	.btn.btn-remove {
		background-color: coral;
		text-indent: -9999px;
		position: relative;
		width: 24px;
		height: 24px;
		padding: 0;
	}

	.btn.btn-remove:before, .btn.btn-remove:after {
		content: '';
		position: absolute;
		background: #FFF;
		width: 16px;
		height: 2px;
		left: 4px;
		top: 11px;
		transform: rotate(0.125turn);
	}

	.btn.btn-remove:after {
		width: 2px;
		height: 16px;
		top: 4px;
		left: 11px;
	}

	.btn.btn-bordered {
		border: 2px solid #FFF;
		background: transparent;
		color: #FFF;
	}

	.btn.btn-bordered:hover {
		background: #FFF;
		color: #00a7c0;
	}


	h1, h2, h3, h4, h5 {
		margin: 0.5em 0;
		font-weight: normal;
		line-height: 100%;
		color: #FFF;
	}

	h1 {
		font-size: 24px;
	}

	h2 {
		font-size: 18px;
	}

	a {
		color: #00BCD4;
		cursor: pointer;
	}

	a:hover {
		color: #00a7c0;
	}

	input, textarea, select {
		font: 400 18px/36px Noto Sans, Arial, sans-serif;
		border: 0;
		box-sizing: border-box;
		padding: 0 10px;
		outline: none;
	}

	label {
		display: block;
		font-size: 18px;
		line-height: 36px;
		color: #FFF;
	}

	table {
		border-collapse: collapse;
		border: 0;
	}

	td {
		height: 32px;
		margin: 0;
		padding: 0;
	}

	th {
		text-align: left;
		font-weight: normal;
	}

	.ctrl {
		margin: 20px 0;
	}

	.ctrlInlineLabel {
		display: flex;
		align-items: center;
	}

	.ctrlLabel {
		margin-left: 20px;
		color: #FFF;
		font-size: 18px;
	}

	.controlSize {
		max-width: 300px;
		width: 100%;
	}

	.wrapper {
		width: 90%;
		max-width: 1080px;
		margin: 0 auto;
		display: flex;
	}

	.layout-widget {
		width: 100%;
		margin: 0 0 40px;
	}

	.widget {
		flex: 1;
	}

	.flexGroup {
		display: flex;
	}

	.flex {
		flex: 1;
	}

	.table-lined tr:nth-child(2n) {
		background: rgba(0, 188, 212, 0.25);
	}

	/* PIKADAY */
	#publishedDate {
		cursor: pointer;
	}

	.pika-single {
		z-index: 9999;
		display: block !important;
		margin-top: 12px;
		padding: 10px 16px;
		color: #33aaff;
		background: white;
		border-radius: 4px;
		box-shadow: 0 2px 8px 0 rgba(50, 77, 93, 0.24);
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		transition: none;
		margin-left: -52px;
	}

	.pika-single:before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		background: white;
		width: 50px;
		height: 50px;
		box-shadow: 0 2px 8px 0 rgba(50, 77, 93, 0.24);
		transform: rotate(45deg);
		z-index: -1;
	}

	.pika-single:after {
		content: '';
		position: absolute;
		background: white;
		z-index: -1;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: block;
		border-radius: 5px;
	}

	.pika-single.is-hidden {
		visibility: hidden;
		display: none !important;
		overflow: hidden;
		top: -9990px !important;
	}

	.pika-lendar {
		float: left;
		width: 208px;
		margin: 8px;
	}

	.pika-title {
		width: 208px;
		position: relative;
		text-align: center;
		text-transform: uppercase;
	}

	.pika-label {
		display: inline-block;
		position: relative;
		z-index: 9999;
		overflow: hidden;
		margin: 0;
		padding: 2px 3px;
		font-size: 14px;
		line-height: 20px;
		font-weight: 700;
		background-color: #fff;
	}

	.pika-title select {
		cursor: pointer;
		position: absolute;
		z-index: 9998;
		margin: 0;
		left: 0;
		top: 5px;
		filter: alpha(opacity=0);
		opacity: 0;
	}

	.pika-next, .pika-prev {
		display: block;
		cursor: pointer;
		position: relative;
		border: none;
		outline: 0;
		width: 24px;
		height: 24px;
		font-size: 0;
		overflow: hidden;
	}

	.pika-prev:hover,
	.pika-next:hover {
		opacity: 1;
	}

	.pika-prev,
	.is-rtl .pika-next {
		float: left;
		background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiLz4gICAgICAgIDxwYXRoIGZpbGw9IiM3MDgwOEIiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTE1LjQxIDE2LjU5TDEwLjgzIDEybDQuNTgtNC41OUwxNCA2bC02IDYgNiA2eiIvPiAgICA8L2c+PC9zdmc+) transparent;
	}

	.pika-next,
	.is-rtl .pika-prev {
		float: right;
		background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4gICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gICAgICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiLz4gICAgICAgIDxwYXRoIGZpbGw9IiM3MDgwOEIiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTggMTYuNTlMMTIuNTggMTIgOCA3LjQxIDkuNDEgNmw2IDYtNiA2eiIvPiAgICA8L2c+PC9zdmc+) transparent;
	}

	.pika-prev.is-disabled,
	.pika-next.is-disabled {
		cursor: default;
		opacity: .2;
	}

	.pika-select {
		display: inline-block;
		*display: inline;
	}

	.pika-table {
		width: 208px;
		border-collapse: collapse;
		border-spacing: 0;
		border: 0;
		margin-top: 9px;
	}

	.pika-table th,
	.pika-table td {
		width: 14.285714285714286%;
		padding: 0;
	}

	.pika-table th {
		color: #999;
		font-size: 12px;
		line-height: 25px;
		padding-bottom: 5px;
		font-weight: bold;
		text-align: center;
	}

	.pika-button {
		width: 30px;
		height: 26px;
		line-height: 18px;
		font-weight: 700;
		text-align: center;
		cursor: pointer;
		display: block;
		box-sizing: border-box;
		outline: none;
		border: 0;
		margin: 0;
		font-size: 13px;
		color: #33aaff;
		background: white;
		border-radius: 2px;
		transition: all .25s;
	}

	.is-today .pika-button {
		color: white;
		background-color: #EFEFEF;
	}

	.is-selected .pika-button {
		background-color: #33aaff;
		color: #FFF;
	}

	.is-disabled .pika-button,
	.is-inrange .pika-button {
		background: white;
		color: #33aaff;
	}

	.is-startrange .pika-button {
		color: #fff;
		background: #6CB31D;
		box-shadow: none;
		border-radius: 3px;
	}

	.is-endrange .pika-button {
		color: #fff;
		background: #33aaff;
		box-shadow: none;
		border-radius: 3px;
	}

	.is-disabled .pika-button,
	.is-outside-current-month .pika-button {
		cursor: default;
		color: #999;
	}

	.pika-button:hover,
	.pika-row.pick-whole-week:hover .pika-button {
		background: #CCC;
	}

	/* styling for abbr */
	.pika-table abbr {
		text-decoration: none;
		text-transform: uppercase;
		border-bottom: none;
		cursor: help;
		font-size: 11px;
		text-align: center;
		color: #777);
		font-weight: 400;
	}

	/* AWESOMEPLETE */
	.awesomplete [hidden] {
		display: none;
	}

	.awesomplete .visually-hidden {
		position: absolute;
		clip: rect(0, 0, 0, 0);
	}

	.awesomplete {
		display: inline-block;
		position: relative;
	}

	.awesomplete > input {
		display: block;
	}

	.awesomplete > ul {
		position: absolute;
		left: 0;
		z-index: 1;
		min-width: 100%;
		box-sizing: border-box;
		list-style: none;
		padding: 0;
		margin: 0;
		background: #fff;
	}

	.awesomplete > ul:empty {
		display: none;
	}

	.awesomplete > ul {
		border-radius: .3em;
		margin: .2em 0 0;
		background: hsla(0, 0%, 100%, .9);
		background: linear-gradient(to bottom right, white, hsla(0, 0%, 100%, .8));
		border: 1px solid rgba(0, 0, 0, .3);
		box-shadow: .05em .2em .6em rgba(0, 0, 0, .2);
		text-shadow: none;
	}

	@supports (transform: scale(0)) {
		.awesomplete > ul {
			transition: .3s cubic-bezier(.4, .2, .5, 1.4);
			transform-origin: 1.43em -.43em;
		}

		.awesomplete > ul[hidden],
		.awesomplete > ul:empty {
			opacity: 0;
			transform: scale(0);
			display: block;
			transition-timing-function: ease;
		}
	}

	/* Pointer */
	.awesomplete > ul:before {
		content: "";
		position: absolute;
		top: -.43em;
		left: 1em;
		width: 0;
		height: 0;
		padding: .4em;
		background: white;
		border: inherit;
		border-right: 0;
		border-bottom: 0;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	.awesomplete > ul > li {
		position: relative;
		padding: .2em .5em;
		cursor: pointer;
	}

	.awesomplete > ul > li:hover {
		background: hsl(200, 40%, 80%);
		color: black;
	}

	.awesomplete > ul > li[aria-selected="true"] {
		background: hsl(205, 40%, 40%);
		color: white;
	}

	.awesomplete mark {
		background: hsl(65, 100%, 50%);
	}

	.awesomplete li:hover mark {
		background: hsl(68, 100%, 41%);
	}

	.awesomplete li[aria-selected="true"] mark {
		background: hsl(86, 100%, 21%);
		color: inherit;
	}


</style>
