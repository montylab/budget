<script>
	export default {
		name: 'app-datasheet-input',
		props: ['categories', 'description', 'category'],

		mounted: function() {
			this.interpolate()
		},

		methods: {
			emitChange: function(e) {
				this.$emit('change', {
					category: this.input.category.trim(),
					description: this.input.description.trim(),
				})
			},

			enterDown: function (e) {
				e.preventDefault()
				if (this.focusType == 'description') {
					if (this.canLeaveAfter + 150 < +new Date()) {
						this.$emit('leave')
						this.emitChange()
					}
				} else {
					this.focusType = 'description'
					this.selectZone(this.$el.querySelector('.description'))
				}
			},

			change: function(e) {
				if (e) {
				}

				this.input.cursor.offset = this.getCursorAbsoluteIndex()

				const value = this.$refs.textfield.innerText.replace(/\u00A0| |&nbsp;/gim, ' ')
				let rerender = value !== this.text
				const cat = value.split(' ')[0]
				const desc = value.indexOf(' ') !== -1 ? value.slice(value.indexOf(' ') + 1) : ''

				if (this.input.cursor.offset) {
					this.focusType = this.input.cursor.offset > cat.length ? 'description' : this.focusType = 'category'
				}


					this.input.category = cat
				this.input.description = desc.replace(/ /gim, '\u00A0')

				if (rerender) {
					this.interpolate()
					if (!!document.activeElement.closest('.categoryInput')) {
						this.setCursorAbsoluteIndex()
					}
				}
			},

			focus: function(e) {
				this.change()
			},

			blur: function(e) {
				this.canLeaveAfter = +new Date()
				this.change()
				this.emitChange()
			},

			interpolate: function() {
				let {category, description} = this.input

				let categoryTemplate = this.splittedCategories.reduce((acc, item) => {
					return acc += `<span class="subcategory">${item}</span>:`
				}, '')
				categoryTemplate = categoryTemplate.replace(/:$/, '')

				let template = `<span class="category">${categoryTemplate}</span><span class="sepatator">&nbsp;</span><span class="description">${description}</span>`

				if (this.$refs.textfield.innerHTML === template) {
					return
				}

				this.$refs.textfield.innerHTML = template
			},

			getCursorAbsoluteIndex: function(node = this.$refs.textfield) {
				if (!document.getSelection().anchorNode) return

				const selectedNode = document.getSelection().anchorNode
				let offset = document.getSelection().anchorOffset

				const map = this.roadmap()
				for (let i = 0; i < map.length; i++) {
					if ((map[i].node === selectedNode )) { //|| map[i].node === selectedNode.parentNode    && map[i].offset === offset
						return i + offset
					}
				}
			},

			setCursorAbsoluteIndex: function(index = this.input.cursor.offset) {
				const map = this.roadmap()
				if (map.length > index) {
					const pos = map[index]
					this.setFocus(pos.node, pos.offset)
				} else {
					this.setFocus()
				}
			},

			roadmap: function(root, offset = 0) {
				const el = root || this.$refs.textfield
				const roadmap = []

				if (!el.childNodes.length) {
					for (let i = 0; i < el.length; i++) {
						roadmap.push({
							offset: i,
							node: el,
						})
					}

					return roadmap
				}
				if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
					return this.roadmap(el.childNodes[0], offset)
				}

				el.childNodes.forEach((item) => {
					if (item.childNodes && item.childNodes.length) {
						if (item.childNodes.length > 1) {
							item.childNodes.forEach(elem => {
								roadmap.push(...this.roadmap(elem, offset))
								offset = roadmap.length
							})
						} else {
							roadmap.push(...this.roadmap(item.childNodes[0], offset))

						}
					}
				})
				return roadmap
			},

			setFocus: function(node = this.$refs.textfield, offset, focusOn = this.$refs.textfield) {

				const range = new Range()

				if (node.textContent.trim()) {
					range.setStart(node, offset || node.childNodes.length)
					range.setEnd(node, offset || node.childNodes.length)
				} else {
					range.setStart(node, 0)
					range.setEnd(node, 0)
				}
				const sel = window.getSelection()
				sel.removeAllRanges()
				sel.addRange(range)

				focusOn.focus()
			},

			selectZone: function (zone) {
				this.setFocus()

				const node = zone
				const end = node.childNodes.length

				const range = new Range()

				range.setStart(node, 0)
				range.setEnd(node, end)

				const sel = window.getSelection()
				sel.removeAllRanges()
				sel.addRange(range)

				this.$refs.textfield.focus()
			},

			selectCategory: function() {
				this.focusType = 'category'
				this.selectZone(this.$el.querySelector('.category'))
			},

			selectDescription: function() {
				this.focusType = 'description'
				this.selectZone(this.$el.querySelector('.description'))
			},

			dropdownSelect: function(selectItemText) {
				this.input.category = selectItemText
				this.interpolate()
				this.change()


				setTimeout(()=>{
					this.focusType = 'description'
					this.selectZone(this.$el.querySelector('.description'))
				})




				this.canLeaveAfter = +new Date() + 100
			},

			tab: function() {

			},
		},

		watch: {
			category: function() {
				this.input.category = this.category
				this.interpolate()
//				this.change()

			},
			description: function() {
				this.input.description = this.description
				this.interpolate()
//				this.change()
			},
		},

		computed: {
			splittedCategories: function() {
				return this.input.category.split(':')
			},
			text: function() {
				return (this.input.category + ' ' + this.input.description).trim()
			},
			canDropdown: function() {
				return this.focusType === 'category'
			},
		},

		data: function() {
			return {
				input: {
					category: this.category,
					description: this.description,
					cursor: {
						offset: 0,
					},
				},
				canLeaveAfter: 0,
				focusType: 'category', // null || category || description
			}
		},
	}
</script>

<template>
	<div class="categoryInputContainer">
		<pre class="categoryInput"
			 contenteditable
			 @keyup="change"
			 @change="change"
			 @click="change"
			 @blur="blur"
			 @focus="focus"

			 @keyup.enter="emitChange"
			 @keydown.enter="enterDown"
			 @keydown.tab="enterDown"

			 ref="textfield"
		></pre>

		<app-datasheet-dropdown
			:canBeShown="canDropdown"

			:items="categories"
			:query="input.category"
			:input="$refs.textfield"

			@select="dropdownSelect"

			ref="dropdown"
		></app-datasheet-dropdown>
	</div>
</template>

<style>
	.categoryInputContainer {
		position: relative;
		height: 100%
	}

	.categoryInput {
		font: 400 18px/32px segoe UI, arial, sans-serif;
		box-sizing: border-box;
		margin: 0;
		padding: 0 15px;
		white-space: nowrap;
		overflow: hidden;
		border: 0;
		height: 100%;
		width: 100%;
		line-height: 2;
		text-indent: 5px;
		outline: none;
		border-bottom: 2px solid transparent;
		background: transparent;
		transition: all .4s;
	}

	.categoryInput:focus {
		border-bottom: 2px solid #00BCD4;
	}

	.categoryInput .category {
		color: red;
	}

	.categoryInput .description {
		color: #888
	}

	.subcategory {
		color: darkorange
	}

	.subcategory + .subcategory {
		color: #00a7c0
	}

	.subcategory + .subcategory + .subcategory {
		color: darkmagenta;
	}

	input, select, pre {

	}


</style>

<style>

</style>
