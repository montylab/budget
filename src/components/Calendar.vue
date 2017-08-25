<template>
  <div class="widget calendar-widget layout-widget">
    <div class="widget-body">
      <ul>
        <li v-for="(yyyy, index) in yearArray" :class="{selected: year==yyyy}">
          <router-link :to="'/'+yyyy">{{yyyy}}</router-link>
        </li>
      </ul>
      <ul>
        <li v-for="(mm, index) in monthArray" :class="{selected: index==month-1}">
          <router-link :to="'/'+year+'/'+(index+1)">{{mm}}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import authService from '@/services/auth-service';
  import dateService from '@/services/date-service';

  export default {
    name: 'app-calendar-widget',

    created: function () {
      dateService.changeSelected(this.year, this.month);

      authService.events.$on('authStateChanged', user => {
        if (user) {
          dateService.changeSelected(this.year, this.month);
        }
      });


    },

    computed: {
      year: function () {
        return this.$route.params.yyyy || dateService.current.year;
      },
      month: function () {
        return this.$route.params.mm || dateService.current.month;
      },

      mode: function () {
        return this.$route.params.mm ? 'month' : 'year';
      },
      yearArray: function () {
        return dateService.getYearArrayFrom(2012);
      },
      monthArray: function () {
        return dateService.getMonthNameArray();
      }
    },
    methods: {},
    data: function () {
      return {}
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        dateService.changeSelected(newRoute.params.yyyy, newRoute.params.mm)
      }
    }
  }
</script>

<style scoped>
  .calendar-widget {
    width: 100%;
	  background: #FFF
  }

  .widget-body {
    padding: 5px 20px;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 10px 0;
  }

  li {
    display: inline-block;
    margin-right: 15px;
  }

  .selected {
    font-weight: bold;
  }


</style>
