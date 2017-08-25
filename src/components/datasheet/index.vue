<style scoped>
	.datasheet-widget {
		background: #FFF;
	}

	.debug-table {
		margin-top: 20px;
		position: absolute;
	}

	a {
		color: #FFF;
	}

	.addone {
		background: #FFF;
		border: 0;
		height: 32px;
		width: 100%;
		color: #00BCD4;
		font-size: 32px;
		outline: none;
		border-top: 1px solid #00bcd4;
		cursor: pointer;
	}
</style>

<template>
	<div class="widget datasheet-widget">
		<div class="widget-body">
			<table class="outcome-table table table-lined">
				<app-datasheet-item
					v-for="item in items"
					:key="item.id"
					:item="item"
					:categories="categories"

					@change="itemChange"
					@delete="itemDelete"

					@enter="emitEnter"
				></app-datasheet-item>
			</table>
		</div>
	</div>
</template>

<script>
	import authService from '@/services/auth-service'
	import dateService from '@/services/date-service'

	export default {
		name: 'app-datasheet-widget',
		props: ['items', 'title', 'categories', 'selectedDate'],

		methods: {
			itemChange: function (item) {
				this.$emit('change', item)
			},
			itemDelete: function (item) {
				this.$emit('delete', item)
			},
			emitEnter: function(data) {
				this.$emit('enter', data)
			}
		},
	}
</script>

