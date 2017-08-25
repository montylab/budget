<script>
	export default {
		name: 'app-control-checkbox',
		props: ['title', 'value', 'val', 'name', 'disabled'],

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
	<label :class="{ctrlInlineLabel: true, ctrl:true, disabled:disabled}">
		<label class="radio hovered">
			<input type="radio" v-model="state" :value="val" :name="name" :disabled="disabled">
			<span></span>
		</label>
		<span class="ctrlLabel">{{title}}</span>
	</label>
</template>


<style scoped>
	.radio {
		width: 24px;
		height: 24px;
		background: #FFF;
		border-radius: 50%;
		display: inline-block;
		position: relative;
	}

	.disabled {
		opacity: 0.3;
	}

	.radio input[type=radio] {
		opacity: 0.0001;
	}

	.radio input[type=radio]:checked + span {
		top: 7px;
		left: 7px;
		position: absolute;
		width: 10px;
		height: 10px;
		background: #00bcd4;
		border-radius: 50%;

	}


</style>
