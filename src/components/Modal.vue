<template>
	<div :class="{'modal-widget': true, 'hidden': hidden, 'inversed': true}">
		<div class="modal-body">
			<h2 v-if="title">
				{{title}}
			</h2>

			<div class="body">
				<slot>lol keke</slot>
			</div>

			<div class="btns">
				<a v-if="btns.cancel" class="btn btn-dark btn-cancel" @click="cancel">Cancel</a>
				<a v-if="btns.ok" class="btn btn-ok" @click="ok">Ok</a>
				<a v-if="btns.save" class="btn btn-save" @click="save">Save</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'modal',
		props: {
			'title': String,
			'child': true,
			'btns': {
				'default': () => ({
					ok: true,
				}),
			},
		},

		methods: {
			ok: function() {
				this.$emit('ok')
				this.close()
			},
			save: function() {
				this.$emit('save')
				this.close()
			},
			cancel: function() {
				this.$emit('cancel')
				this.close()
			},

			close: function () {
				this.hidden = true
			},

			open: function () {
				this.hidden = false
			}
		},
		data() {
			return {
				hidden: true
			}
		},
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.modal-widget {
		position: fixed;
		z-index: 999;

		display: flex;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;

		background: rgba(0, 0, 0, 0.7);

		transition: all 0.25s cubic-bezier(0.42, -0.15, 0.71, 1.25);

		opacity: 1;
		visibility: visible;
	}

	.hidden {
		opacity: 0;
		visibility: hidden;
	}

	.modal-body {
		min-width: 200px;
		min-height: 200px;

		max-width: 80vw;
		max-height: 80vh;

		background: #FFF;
		padding: 20px;

		overflow: auto;
	}

	.btns {
		display: flex;
		justify-content: space-around;
		margin: 20px;
	}
</style>
