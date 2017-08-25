<script>
	export default {
		name: 'app-control-switcher',
		props: ['value', 'title'],

		data: function () {
			return {
				state: this.value
			}
		},


		watch: {
			value: function() {
				this.state = this.value
			},
			state: function () {
				this.$emit('input', this.state)
				this.$emit('change', this.state)
			}
		}
	}
</script>



<template>
	<label class="ctrl ctrlInlineLabel">
		<label class="switcher hovered">
			<input type="checkbox" v-model="state">
			<span></span>
			<span class="caption">{{state ? 'on' : 'off'}}</span>
		</label>
		<span class="ctrlLabel">{{title}}</span>
	</label>
</template>


<style scoped>
	.switcher {
		background: transparent;
		height: 24px;
		width: 48px;
		color: #333;
		border-radius: 3px;
		border: 2px solid #FFF;
		box-sizing: border-box;
		position: relative;
	}

	.switcher input {
		visibility: hidden;
	}

	.switcher input + span {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		transition: all .25s;
	}

	.switcher input:checked + span {
		background: #FFF;
	}

	.switcher input + span + .caption {
		color: #FFF;
		position: absolute;
		top: 0;
		left: 5px;
		line-height: 20px;
		font-size: 16px;
		transition: all .25s;
	}

	.switcher input:checked + span + .caption {
		left: 20px;
		color: #333;
	}
</style>
