<style scoped>
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
		<h1>{{title}}</h1>
		<app-datasheet-widget
			:items="items"
			:categories="categories"
			:selectedDate="selectedDate"

			@change="itemChange"
			@delete="itemDelete"

			@enter="processEnter"

			ref="datasheet"
		></app-datasheet-widget>

		<button @click="newItem" class="addone">+</button>
	</div>
</template>

<script>
	import authService from '@/services/auth-service'
	import dateService from '@/services/date-service'

	export default {
		name: 'app-datasheet-serviced-widget',
		props: ['service', 'title'],

		data: function() {
			return {
				items: [],
				categories: [],
				selectedDate: dateService.current,
			}
		},

		created: function() {
			this.service.events.$on('updated', (data) => {
				this.items = this.service.getItemsArray(this.selectedDate)
				console.log(this.items)
				this.categories = data.categories
			})

			dateService.events.$on('selectedChanged', (selected) => {
				this.selectedDate = selected
				this.items = this.service.getItemsArray(selected)
			})

			this.items = this.service.getItemsArray(this.selectedDate)
			this.categories = this.service.getCategories()
		},

		methods: {
			itemChange: function(item) {
				this.service.changeItem(item)
			},

			itemDelete: function({id}) {
				this.service.delete(id)
			},

			newItem: function(item) {
				this.service.addNewItem(item)
				this.focusItem()
			},

			focusItem(index = 1e3) {
				const el = this.$refs.datasheet.$el
				setTimeout(() => {
					const inputs = el.querySelectorAll('input.amount')
					if (inputs.length) {
						index = Math.max(0, index)
						index = Math.min(index, inputs.length-1)
						inputs[index].select()
						inputs[index].focus()
					}
				}, 50)
			},

			processEnter: function({event, id}) {
				if (this.items[this.items.length-1].id === id) {
					this.newItem()
					return
				}

				if (event.metaKey) {
					const item = this.items.find((item)=>item.id===id)
					const index = this.items.indexOf(item)+1
					this.newItem({date: item.date+1e3})
					this.focusItem(index)
				}

			}
		},
	}
</script>

