<template>
  <div class="hello">
    <app-calendar-widget></app-calendar-widget>

    <app-datasheet-input
      :categories="categories"
      :category="category"
      :description="description"
    ></app-datasheet-input>

    <app-datasheet-widget title="Income" :service="incomeService"></app-datasheet-widget>
    <app-datasheet-widget title="Outcome" :service="outcomeService"></app-datasheet-widget>
  </div>
</template>

<script>
  import incomeService from '@/services/income-service'
  import outcomeService from '@/services/outcome-service'
  import AppDatasheetInput from "./datasheet/input.vue";

  export default {
    components: {AppDatasheetInput},
    name: 'dashboard',
    data() {
      return {
        incomeService,
        outcomeService,
		//categories: outcomeService.categories,
        categories: [
			'category1:sub1',
			'category1:sub2',
			'category1:subcategory3',
			'category1:subcategory4',
			'cat2:sub1',
			'cat2:sub2',
			'cat3subcategory3',
			'cat3:subcategory4',

		],
        category: 'category:subcategory',
        description: 'description'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
