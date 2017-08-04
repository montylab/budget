<template>
  <div class="hello">
    <h1>Stat</h1>
    <router-link to="/">Home</router-link>

    <app-chart-summary/>
    <app-chart-in-out/>
    <div class="flexGroup">
      <app-chart-category-pie :service="outcomeService" :title="'Outcome'"/>
      <app-chart-category-pie :service="incomeService" :title="'Income'"/>
    </div>
  </div>
</template>

<script>
  import incomeService from '@/services/income-service'
  import outcomeService from '@/services/outcome-service'

  export default {
    data() {
      return {
        outcomeService,
        incomeService,
      }
    },

    created() {
    },

    mounted() {

    },

    methods: {}
  }
</script>

<!-- Add "scoped" attriute to limit CSS to this component only -->
<style scoped>

</style>
