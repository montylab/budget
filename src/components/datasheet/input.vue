<script>

  let cnt = 0;

  export default {
    name: 'app-datasheet-input',
    props: ['categories', 'description', 'category'],

    mounted: function() {
      window.aaa = (n) => {
        setTimeout(() => {
          this.setCursorAbsoluteIndex(n);
        }, 2000);
      };

      this.interpolate();
    },

    updated: function() {

    },

    methods: {
      change: function(e) {
        if (e.ctrlKey || e.shiftKey || e.altKey) {
          return;
        }

        console.log(this.getCursorAbsoluteIndex());

        this.$set(this.input, 'cursor', {
          offset: this.getCursorAbsoluteIndex(),
          blur: e.type === 'blur',
        });

        const value = e.target.innerText.replace(/\u00A0| /gim, ' ');
        //console.info(value);

        const cat = value.split(' ')[0];
        const desc = value.indexOf(' ') !== -1 ? value.slice(value.indexOf(' ') + 1) : '';
        //console.info(`|${cat}| |${desc}|`);

        this.$set(this, 'input', {
          category: cat,
          description: desc.replace(/ /gim, '\u00A0'),
          cursor: this.input.cursor,
        });

        this.interpolate();
      },

      interpolate: function() {
        let {cursor: {offset, blur}, category, description} = this.input;

        let template = `<span class="category">${category}</span><span class="sepatator">&nbsp;</span><span class="description">${description}</span>`;
//        if (description) {
//          template += `<span class="sepatator">&nbsp;</span><span class="description">${description}</span>`;
//        }

        if (this.$refs.textfield.innerHTML === template) {
          //console.log(this.$refs.textfield.innerHTML);
          return;
        }

        this.$refs.textfield.innerHTML = template;

        this.setCursorAbsoluteIndex(offset);

        //if (!blur) div.focus()
      },

      getCursorAbsoluteIndex: function() {
        if (!document.getSelection().anchorNode) return;

        const cursorParent = document.getSelection().anchorNode.parentNode;
        let offset = document.getSelection().anchorOffset;

        let elem = cursorParent;
        while (elem.previousSibling) {
          elem = elem.previousSibling;
          if (elem.childNodes.length) {
            offset += elem.childNodes[0].length;
          } else {

          }
        }

        return offset;
      },

      setCursorAbsoluteIndex: function(index) {

        let node = null, offset = null;

        Array.from(this.$el.childNodes).every((item) => {
          if (item.childNodes && item.childNodes[0]) {
            const len = item.childNodes[0].length;
            console.log(len, item.childNodes);
            if (len >= index) {
              node = item.childNodes[0];
              offset = index;
              return false;
            } else {
              index -= len;
              node = item.childNodes[0];
            }

            return true;
          }
        });

        if (node && offset !== null) {
          const range = new Range();
          range.setStart(node, offset);
          range.setEnd(node, offset);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);

          this.$el.focus();

        }
      },
  },

  data: function() {
    return {
      input: {
        category: 'lol:kek',
        description: 'wo1w!',
        cursor: {
          offset: 0,
          parent: null,
          blur: false,
        },
      },
    };
  }
  }
</script>

<template>
  <pre class="categoryInput"
       contenteditable
       @keyup="change"
       @change="change"
       @blur="change"
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
</style>
