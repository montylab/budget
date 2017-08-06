<script>
export default {
  name: 'app-datasheet-input',
  props: ['categories', 'description', 'category'],

}
</script>

<template>
  <div class="categoryInput" @onkeydown="change">
    <span class="category"></span>
    <span class="description"></span>
  </div>
</template>

<style scoped>
  .category {
    color: red;
  }

  .description {
    ca
  }
</style>
