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
				let filtered = this.items ? this.items.filter(item => !this.query.trim() || item.name.indexOf(this.query) !== -1) : []

				if (this.query && this.query.trim()) {
					filtered = filtered.map(item => ({
                        source: item.name,
                        priority: item.priority,
                        value: item.name.slice(this.query.indexOf(split[split.length - 1] || ':')),
                    }))
				} else {
					filtered = filtered.map(item => ({
						source: item.name,
						value: item.name,
						priority: item.priority,
					}))
				}

				if (filtered.length === 1 && this.query === filtered[0].source) return []

				if (flush) this.selection = 0

				filtered.sort((a,b) => b.priority-a.priority)

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
							this.selected(e.metaKey)
						}
					})

					eventsHolder.addEventListener('blur', ()=> {
						this.mightBeVisible = false
					})

					eventsHolder.addEventListener('keydown', (e)=> {
						if (e.metaKey) {
							if (+e.key > 0 && +e.key < 10) {
							    e.preventDefault()

                                if (+e.key <= this.filteredItems.length) {
									this.selection = +e.key - 1
									this.selected()
								}
                            }
                        }
					})

					eventsHolder.addEventListener('focus', ()=> {
						this.mightBeVisible = true
                        this.$forceUpdate()
						//this.mightBeVisible = document.getSelection().anchorNode.closest('.category')
					})
				}
			},

			selected: function(e) {
				const sel = this.selection
				this.$emit('select', {
					value: e && e.target && e.target.getAttribute("value") || this.filteredItems[sel].source,
					meta: e === true
				})
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
	<ul :class="{maxHeight10: true, open: mightBeVisible && canBeShown}">
		<li
			v-for="(item, index) in filteredItems"

			:value="item.source"
			:class="{selected: index==selection}"

			@mousedown="selected"
		>
			<span v-if="index<9" class="hint">⌘ {{index+1}}</span>
			<!--<span>{{item.priority}}</span>-->
			{{item.value}}
		</li>
	</ul>
</template>


<style scoped>
	ul {
		position: absolute;
		top: 35px;
		left: 0;
		background: #FFF;
		padding: 0;
		margin: 0;
		list-style: none;
		box-shadow: 0 3px 23px -4px #000000;
		z-index: 9999;
        transition: all 0.2s;

        opacity: 0;
        visibility: hidden;
	}

    .open {
        opacity: 1;
        visibility: visible;
        transition: all .2s .2s;
    }



    .hint {
        float: right;
    }

    .maxHeight10 {
        max-height: 295px;
        overflow: auto;
    }

	li {
		padding: 5px 10px;
	}

	li span {
		color: #9a9a9a;
	}

	li:hover, li.selected {
		cursor: pointer;
		background: coral;
	}
</style>
