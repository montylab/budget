<script>

	let cnt = 0

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

			change: function(e) {
				if (e && e.key === "Enter") {
					e.preventDefault()
				}

				this.$set(this.input, 'cursor', {
					offset: this.getCursorAbsoluteIndex(),
				})

				const value = this.$refs.textfield.innerText.replace(/\u00A0| /gim, ' ')

				let rerender = false
				if (value !== this.input.text) {
					rerender = true
				}

				const cat = value.split(' ')[0]
				const desc = value.indexOf(' ') !== -1 ? value.slice(value.indexOf(' ') + 1) : ''
				const cats = cat.split(':')

				this.$set(this, 'input', {
					category: cat,
					cats: cats,
					description: desc.replace(/ /gim, '\u00A0'),
					text: value,
					cursor: this.input.cursor,
				})

				if (rerender) {
					console.log('rerender')
					this.interpolate()
					this.setCursorAbsoluteIndex()
				}
			},

			focus: function(e) {
				this.change()
			},

			blur: function(e) {
				this.change()
				this.emitChange()
			},

			interpolate: function() {
				let {category, cats, description} = this.input

				let categoryTemplate = cats.reduce((acc, item) => {
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

			dropdownSelect: function(selectItemText) {
				this.input.category = selectItemText
				this.input.cats = selectItemText.split(':')
				this.interpolate()
				this.change()

			},
		},

		data: function() {
			return {
				input: {
					category: this.category,
					cats: this.category.split(':'),
					description: this.description,
					text: this.category + ' ' + this.description,
					cursor: {
						offset: 0,
					},
					hint: {
						text: 'category',
					},
				},
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

			 ref="textfield"
		></pre>

		<app-datasheet-dropdown
			:items="categories"
			:query="input.category"
			:input="$refs.textfield"

			@select="dropdownSelect"
		></app-datasheet-dropdown>
	</div>
</template>

<style>
	.categoryInputContainer {
		position: relative;
	}

	.categoryInput {
		background: transparent;
		font: 400 18px/32px segoe UI, arial, sans-serif;
		box-sizing: border-box;
		margin: 10px 0;
		padding: 0 15px;
		width: 100%;
		height: 32px;
		white-space: nowrap;
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
</style>

<style>

</style>
