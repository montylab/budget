<script>
	import Pikaday from '@/libs/pikaday'
	import dateService from '@/services/date-service'
	import authService from '@/services/auth-service'
	import currencyService from '@/services/currency-service'
	import Awesomplete from '@/libs/awesomplete'

	export default {
		name: 'app-datasheet-dropdown',
		props: ['items', 'query', 'input', 'canBeShown'],

		created: function() {
			this.eventsBinding()
		},

		updated: function() {
			this.recalc()
			this.eventsBinding()
		},

		mounted: function() {
			this.eventsBinding()
		},

		beforeDestroy: function () {
			this.eventsOn = false
		},

		computed: {
			filteredItems: function(flush = true) {
				let split = this.query.split(':')
				let filtered = this.items ? this.items.filter(item => item.indexOf(this.query) !== -1) : []

				if (this.query) {
					filtered = filtered.map(item => ({
						source: item,
						value: item.slice(this.query.indexOf(split[split.length - 1] || ':')),
					}))
				} else {
					filtered = filtered.map(item => ({
						source: item,
						value: item,
					}))
				}

				if (filtered.length === 1 && this.query === filtered[0].source) return []

				if (flush) this.selection = 0
				return filtered
			},

		},

		methods: {
			eventsBinding: function () {
				const eventsHolder = this.input || this.$parent.$refs.textfield
				if (eventsHolder && !this.eventsOn) {
					this.eventsOn = true
					eventsHolder.addEventListener('keydown', (e) => {
						if (e.keyCode == 38) {
							e.preventDefault()
							this.$set(this, 'selection', Math.max(0, this.selection - 1))
						}
						if (e.keyCode == 40) {
							e.preventDefault()
							this.selection = Math.min(this.filteredItems.length - 1, this.selection + 1)
						}

						if (e.key === 'Enter' && this.filteredItems.length) {
							e.preventDefault()
							this.selected()
						}
					})

					eventsHolder.addEventListener('blur', ()=> {
						this.mightBeVisible = false
					})
					eventsHolder.addEventListener('focus', ()=> {
						this.mightBeVisible = document.activeElement === this.input
						//this.mightBeVisible = document.getSelection().anchorNode.closest('.category')
					})
				}
			},

			selected: function(e) {
				const sel = this.selection
				this.$emit('select', e && e.target.getAttribute("value") || this.filteredItems[sel].source)
			},

			recalc: function() {
				if (!this.mightBeVisible) return

				let anchor = document.getSelection().anchorNode
				if (!anchor) return
				anchor = anchor.nodeType === 3 ? anchor.parentNode : anchor
				if (!anchor.closest('.categoryInputContainer')) return

				if (!anchor.textContent.trim() && anchor.previousSibling) {
					anchor = anchor.previousSibling
					if (anchor.childElementCount > 1) {
						anchor = anchor.children[anchor.childElementCount - 1]
					}
				}

				this.$el.style.display = 'block'
				this.$el.style.left = anchor.offsetLeft + 'px'
				this.$el.style.top = anchor.offsetTop + 30 + 'px'

			},
		},

		data() {
			return {
				selection: 0,
				mightBeVisible: false,
				eventsOn: false,

			}
		},
	}
</script>

<template>
	<ul >
		<li
			v-if="mightBeVisible && canBeShown"
			v-for="(item, index) in filteredItems"

			:value="item.source"
			:class="{selected: index==selection}"

			@mousedown="selected"
		>
			{{item.value}}
		</li>
	</ul>
</template>


<style scoped>
	ul {
		position: absolute;
		top: 35px;
		left: 0px;
		background: #FFF;
		padding: 0;
		margin: 0;
		list-style: none;
		box-shadow: 0px 3px 23px -4px #000000;
		z-index: 9999;
	}

	li {
		padding: 5px 10px;
	}

	li:hover, li.selected {
		cursor: pointer;
		background: coral;
	}
</style>
