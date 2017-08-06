<script>

  let cnt = 0;

  export default {
    name: 'app-datasheet-input',
    props: ['categories', 'description', 'category'],

    mounted: function () {
      this.interpolate()
    },

    updated: function () {
      //this.interpolate()
//      if (spans.length !== 2) {
//        //div.innerHTML =     '<span class="category">{{input.category}}</span> <span class="description">{{input.description}}</span>'
//        if (cnt < 100) {
//          this.$forceUpdate();
//          this.$nextTick(()=>{console.log('upd')})
//
//        }
//        cnt ++
//      }
    },

    methods: {
      change: function (e) {
        if (document.getSelection().anchorNode) {
          const cursorParent = document.getSelection().anchorNode.parentNode
          const cursorOffset = document.getSelection().anchorOffset

          this.$set(this.input, 'cursor', {
            offset: cursorOffset,
            parent: cursorParent.className,
            blur: e.type === 'blur'
          })
        }

        const value = e.target.innerText.replace(/\u00A0| /gim, ' ')
        console.info(value)

        const cat = value.split(' ')[0]
        const desc = value.indexOf(' ') !== -1 ? value.slice(value.indexOf(' ') + 1) : ''
        console.info(`|${cat}| |${desc}|`)

        this.$set(this, 'input', {
          category: cat,
          description: desc.replace(/ /gim, '\u00A0'),
          cursor: this.input.cursor
        })

        this.interpolate()
      },

      interpolate: function () {
        let {cursor: {offset, parent, blur}, category, description} = this.input

        this.$refs.textfield.innerHTML = `
          <span class="category">${category}</span><span class="sepatator"> </span><span class="description">${description}</span>
        `

        if (parent) {
          const parentNode = this.$el.querySelector('.'+parent)
          if (!parentNode) return
          let node = this.$el.querySelector('.'+parent).childNodes[0]
          const range = document.createRange()

          if (offset > node.length && parent==='category') {
            offset = 0
            node = this.$el.querySelector('.description')
          }

          range.setStart(node, offset)
          range.setEnd(node, offset)
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        }

        //if (!blur) div.focus()
      }
    },

    data() {
      return {
        input: {
          category: 'lol:kek',
          description: 'wo1w!',
          cursor: {
            offset: 0,
            parent: null,
            blur: false
          }
        }
      }
    }
  }
</script>

<template>
  <div class="categoryInput"
       contenteditable
       @keyup="change"
       @change="change"
       @blur="change"
       ref="textfield"
  >
  </div>
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
</style>
