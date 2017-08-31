<script>
    export default {
        name: 'app-datasheet-input',
        props: ['categories', 'description', 'category'],

        data: function () {
            return {
                input: {
                    category: this.category || ' ',
                    description: this.description || ' ',
                    cursor: {
                        offset: 0,
                    },
                },
                canLeaveAfter: 0,
                focusType: 'category', // null || category || description
            }
        },

        computed: {
            splittedCategories: function () {
                return this.input.category.split(':')
            },
            text: function () {
                return (this.input.category + ' ' + this.input.description).trim()
            },
            canDropdown: function () {
                return this.focusType === 'category'
            },
        },

        watch: {
            category: function () {
                this.input.category = this.category
                this.interpolate()

            },
            description: function () {
                this.input.description = this.description
                this.interpolate()
            }
        },

        mounted: function () {
            this.interpolate()
        },

        methods: {
            emitChange: function () {
                this.$emit('change', {
                    category: this.input.category.trim(),
                    description: this.input.description.trim(),
                })
            },

            enterDown: function (e) {
                e.preventDefault()

                if (this.focusType === 'description') {
                    if (this.canLeaveAfter + 150 < +new Date()) {
                        this.$emit('leave')
                        this.emitChange()
                    }
                } else {
                    if (e.metaKey) {
                        try {
                            const zone = e.target.closest('tr').nextElementSibling.querySelector('.category')
                            this.selectZone(zone)
                        } catch (e) {
                        }
//						debugger
                        return
                    }

                    this.focusType = 'description'
                    this.selectZone(this.$el.querySelector('.description'))
                }
            },

            check: function (e) {
                if (e && e.type === 'keyup' && e.metaKey) return

                const value = this.normalizeString(this.$refs.textfield.innerText).trim()
                const category = value.split(' ')[0]
                const description = (value.indexOf(' ') !== -1 ? value.slice(value.indexOf(' ') + 1) : '') || ' '

                this.input.cursor.offset = this.getCursorAbsoluteIndex()
                console.log(this.input.cursor.offset)
                if (this.input.cursor.offset) {
                    this.focusType = this.input.cursor.offset > category.length ? 'description' : this.focusType = 'category'
                }

                if (this.sameString(value, this.text)) {
                    return false
                } else {
                    this.change({category, description});
                }
            },

            change: function ({category, description}) {
                console.log('change!')
                if (category !== undefined) {
                    this.input.category = this.normalizeString(category)
                }
                if (description !== undefined) {
                    this.input.description = this.normalizeString(description)
                }

                this.interpolate()

                if (!!document.activeElement.closest('.categoryInput')) {
                    this.setCursorAbsoluteIndex()
                }

                this.emitChange()
            },

            blur: function (e) {
                this.canLeaveAfter = +new Date()
                this.check()
            },

            focus() {
                if (!this.text) {
                    this.selectCategory()
                }
            },

            interpolate: function () {
//				console.log('interpolate');

                let {description} = this.input

                let categoryTemplate = this.splittedCategories.reduce((acc, item) => {
                    item = item || ' '
                    return acc += `<span class="subcategory">${item}</span>:`
                }, '')
                categoryTemplate = categoryTemplate.replace(/:$/, '')

                let template = `<span class="category">${categoryTemplate}</span><span class="separator"> </span><span class="description">${description}</span>`

                if (this.sameString(this.$refs.textfield.innerHTML, template)) {
                    return
                }

//				console.log('interpolate done');
                this.$refs.textfield.innerHTML = template
            },

            sameString: function (a, b) {
                return this.normalizeString(a) === this.normalizeString(b)
            },

            normalizeString(str) {
                return str.replace(/\s|&nbsp;/gim, ' ')
            },

            getCursorAbsoluteIndex: function (node = this.$refs.textfield) {
                if (!document.getSelection().anchorNode) return

                let selectedNode = document.getSelection().anchorNode
                if (selectedNode.childNodes.length) {
                    selectedNode = selectedNode.childNodes[0]
                }

                let offset = document.getSelection().anchorOffset

                const map = this.roadmap()
                for (let i = 0; i < map.length; i++) {
                    if ((map[i].node === selectedNode )) { //|| map[i].node === selectedNode.parentNode    && map[i].offset === offset
                        console.info()
                        return i + offset
                    }
                }

                console.log('undefined position')
                return 0
            },

            setCursorAbsoluteIndex: function (index = this.input.cursor.offset) {
//				console.log('setCursorAbsoluteIndex')
                const map = this.roadmap()
                if (map.length > index) {
                    const pos = map[index]
                    this.setFocus(pos.node, pos.offset)
                } else {
                    this.setFocus()
                }
            },

            roadmap: function (root, offset = 0) {
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

//                console.log(roadmap)
                return roadmap
            },

            setFocus: function (node = this.$refs.textfield, offset, focusOn = this.$refs.textfield) {
                //console.log('set focus')
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
//				console.log('select zone',  zone)
//                setTimeout(() => {
                    try {
                        if (!zone) return
                        this.setFocus(zone.closest('pre'))

                        const node = zone
                        const end = node.childNodes.length

                        const range = new Range()

                        range.setStart(node, 0)
                        range.setEnd(node, end)

                        const sel = window.getSelection()
                        sel.removeAllRanges()
                        sel.addRange(range)

                        zone.closest('pre').focus()
                    } catch (e) {
                        console.warn(e)
                    }
//                }, 50)
            },

            selectCategory: function () {
                this.focusType = 'category'
                this.selectZone(this.$el.querySelector('.category'))
            },

            selectDescription: function () {
                this.focusType = 'description'
                this.selectZone(this.$el.querySelector('.description'))
            },

            dropdownSelect: function ({value, meta}) {
                this.change({category: value})

                if (meta) {
                    try {
                        const zone = this.$refs.textfield.closest('tr').nextElementSibling.querySelector('.category')
                        this.selectZone(zone)
                    } catch (e) {
                    }
                } else {
                    setTimeout(() => {
                        this.focusType = 'description'
                        this.selectZone(this.$el.querySelector('.description'))
                    }, 100)
                }

                this.canLeaveAfter = +new Date() + 100
            }
        },
    }
</script>

<template>
    <div class="categoryInputContainer">
		<pre class="categoryInput"
             contenteditable
             @keyup="check"
             @change="check"
             @click="check"
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
        max-height: 38px;
        width: 100%;
        line-height: 2;
        text-indent: 5px;
        outline: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        transition: all .4s;
    }

    .categoryInput br {
        display: none;
    }

    .categoryInput:focus {
        border-bottom: 2px solid #00BCD4;
    }

    .categoryInput .category, .categoryInput .subcategory, .categoryInput .description {
        /*background-color: olive;*/
        display: inline-block;
        vertical-align: top;
        min-width: 4px;
        min-height: 100%;
        text-indent: 0;
    }

    .categoryInput .description {
        color: #666;
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
