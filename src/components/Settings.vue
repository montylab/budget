<template>
  <div class="settings-widget">
    <h2>You are special!</h2>
    <br>

    <label for="precision">Precision digits:</label>
    <input type="number" id="precision" :value="settings.precision" @change="change">
    <br>

    <label for="greeting">Greeting label:</label>
    <select id="greeting" :value="settings.greeting" @change="change">
      <option
        v-for="item in options.greeting"
        :value="item"
      >{{item}}</option>
    </select>

    <br>
    <br>
    <small>it saves automatically, magic</small>

    <!--<button class="btn" @click="save">Save</button>-->
  </div>
</template>

<script>
  import authService from '@/services/auth-service.js';
  import settingsService from '@/services/settings-service.js';

  export default {
    name: 'settings',

    created () {
      settingsService.events.$on('updated', ({settings})=>{
        this.settings = settings
      })
    },

    methods: {
      save: () => {

      },

      change: ({target}) => {
        settingsService.change({[target.id]: target.value})

      }
    },
    data() {
      return {
        settings: settingsService.data,
        options: settingsService.options
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btn {
    background: #068eff;
    border-color: #0469be;
  }

  label {color: #FFF; font-size: 18px; display:  block; margin: 20px 0 0;}
  input, select {
    height: 32px;
    font-size: 18px;
    background: #FFF;
    border: 1px solid #999;
    margin: 5px 0;
    padding: 5px 5px 5px 10px;
  }

  select {
    -webkit-appearance: menulist-button;
  }

  small {
    color: #FFF
  }
</style>
