<style scoped>
  .datasheet-widget {

  }

  .debug-table {
    margin-top: 20px;
    position: absolute;
  }

  a {
    color: #FFF;
  }

  .addone {
    background: #FFF;
    border: 0;
    height: 32px;
    width: 100%;
    color: #00BCD4;
    font-size: 32px;
    outline: none;
    border-top: 1px solid #00bcd4;
    cursor: pointer;
  }
</style>

<template>
  <div class="widget datasheet-widget">
    <h1>{{title}}</h1>
    <div class="widget-body">
      <table class="outcome-table table table-lined">
        <app-datasheet-item
          v-for="item in items"
          :key="item.id"
          :item="item"
          :service="service"
        ></app-datasheet-item>
      </table>

      <button @click="newItem" class="addone">+</button>
    </div>
  </div>
</template>

<script>
  import authService from '@/services/auth-service';
  import dateService from '@/services/date-service';

  export default {
    name: 'app-datasheet-widget',
    props: ['service', 'title'],

    data: function() {
      return {
        items: [],
        categories: [],
        //selectedDate: dateService.getMonthTimestamps()
        selectedDate: dateService.current,
      };
    },

    created: function() {
      this.service.events.$on('updated', (data) => {
        this.$data.items = this.service.getItemsArray(this.$data.selectedDate);
        this.$data.categories = data.categories;
      });

      dateService.events.$on('selectedChanged', (selected) => {
        this.$data.selectedDate = selected;
        this.$data.items = this.service.getItemsArray(selected);
      });

      this.$data.items = this.service.getItemsArray(this.$data.selectedDate);
      this.$data.categories = this.service.getCategories();
    },

    methods: {
      newItem: function() {
        this.service.addNewItem();
        setTimeout(() => {
          const inputs = this.$el.querySelectorAll('input.amount');
          if (inputs.length) {
            inputs[inputs.length - 1].focus();
          }
        }, 0);
      },
    },
  };
</script>

