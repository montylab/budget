<script>
	export default {
		name: 'app-control-checkbox',
		props: ['title', 'value'],

		data: function () {
			return {
				state: this.value
			}
		},

		watch: {
			value: function () {
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
	<label class="ctrlInlineLabel ctrl">
		<label class="checkbox hovered">
			<input type="checkbox" v-model="state">
			<span></span>
		</label>
		<span class="ctrlLabel">{{title}}</span>
	</label>
</template>


<style scoped>
	.checkbox {
		width: 24px;
		height: 24px;
		background: #FFF;
		border-radius: 3px;
		display: inline-block;
		position: relative;
	}

	.checkbox input[type=checkbox] {
		opacity: 0.0001;
	}

	.checkbox input[type=checkbox] + span {
		position: absolute;
		transform: rotate(0.625turn);
		transform-origin: bottom;
		top: 23px;
		left: 9px;
	}

	.checkbox input[type=checkbox] + span:before, input[type=checkbox] + span:after {
		transition: all .25s;
		position: absolute;
		background: #333;
		content: '';
		left: 2px;
		top: 4px;
		width: 0;
		height: 0;
	}

	.checkbox input[type=checkbox]:checked + span:before {
		width: 10px;
		height: 3px;

	}

	.checkbox input[type=checkbox]:checked + span:after {
		width: 3px;
		height: 14px;
	}

</style>
