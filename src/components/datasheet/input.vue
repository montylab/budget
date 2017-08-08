<script>

	let cnt = 0

	export default {
		name: 'app-datasheet-input',
		props: ['categories', 'description', 'category'],

		mounted: function() {
			this.interpolate()

			let hinter = document.querySelector('#hinter')
			if (!hinter) {
				const hinterEl = document.createElement('div')
				hinterEl.id = 'hinter'
				document.body.appendChild(hinterEl)
				hinter = document.querySelector('#hinter')
			}

			this.hinter = hinter
		},


		methods: {
			change: function(e) {
				this.$set(this.input, 'cursor', {
					offset: this.getCursorAbsoluteIndex(),
				})

				const value = this.$el.innerText.replace(/\u00A0| /gim, ' ')

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
				this.hinterRecalc()
			},

			focus: function (e) {
				this.change()
				setTimeout(()=>this.hinterRecalc())
			},

			blur: function (e) {
				//window.clearInterval(this.watcher)
				this.change()
				this.hinter.style.display = 'none'
			},

			hinterRecalc: function () {
				let anchor = document.getSelection().anchorNode
				if (!anchor) return
				anchor = anchor.nodeType === 3 ? anchor.parentNode : anchor
				if (!anchor.closest('.'+this.$el.className)) return

				this.hinter.style.display ='block'
				this.hinter.style.left = anchor.offsetLeft  + 'px'
				this.hinter.style.top  = anchor.offsetTop   + 30 + 'px'



				this.hintRender()
			},

			hintRender: function () {
				const node = this.roadmap()[Math.max(0, this.getCursorAbsoluteIndex()-1)].node
				const text = node.textContent

				console.log(text)

				const cats = this.$props.categories.filter(item => item.indexOf(text) !== -1)

				let template = '<ul>'
//				debugger
				template += cats.reduce((acc, item) => `${acc}<li>${item}</li>`, '')
				template = template + '</ul>'


				this.hinter.innerHTML = template
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

			getCursorAbsoluteIndex: function(node = this.$el) {
				if (!document.getSelection().anchorNode) return

				const selectedNode = document.getSelection().anchorNode
				let offset = document.getSelection().anchorOffset

				const map = this.roadmap()
				for (let i = 0; i < map.length; i++) {
					if ((map[i].node === selectedNode ) ) { //|| map[i].node === selectedNode.parentNode    && map[i].offset === offset
						return i+offset
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
				const el = root || this.$el
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

			setFocus: function(node = this.$el, offset, focusOn = this.$el) {
				const range = new Range()
				range.setStart(node, offset || node.childNodes.length)
				range.setEnd(node, offset || node.childNodes.length)
				const sel = window.getSelection()
				sel.removeAllRanges()
				sel.addRange(range)

				focusOn.focus()
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
						offset: 0
					},
					hint: {
						text: 'category'
					}
				},
			}
		},
	}
</script>

<template>
  <pre class="categoryInput"
	   contenteditable
	   @keyup="change"
	   @change="change"
	   @click="change"
	   @blur="blur"
	   @focus="focus"

	   ref="textfield"
  >
  </pre>
</template>

<style>

	.categoryInput {

		background: #FFF;
		font: 400 18px/32px segoe UI, arial, sans-serif;
		box-sizing: border-box;
		margin: 10px 0;
		padding: 0 15px;
		width: 100%;
		height: 32px;
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

<style >
	#hinter {
		position: absolute;
		top: 50px;
		left: 50px;
		/*width: 100px;*/
		/*height: 80px;*/
		padding: 10px;

		background: coral;
	}

	#hinter ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
</style>
