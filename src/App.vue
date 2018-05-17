<template>
  <div id="app">
    <vue-price-calendar @change="change"></vue-price-calendar>
  </div>
</template>

<script>
import VuePriceCalendar from './vue-price-calendar/vue-price-calendar'

export default {
  name: 'app',
  components: {
    VuePriceCalendar
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    change (date) {
      console.log(date)
    }
  }
}
</script>
