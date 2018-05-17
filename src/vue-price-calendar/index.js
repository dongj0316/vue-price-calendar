import vuePriceCalendar from './vue-price-calendar.vue'

const comment = {
  install: function (Vue) {
    if (typeof window !== undefined && window.Vue) {
      window.Vue.use(comment)
    }
    Vue.component(vuePriceCalendar.name, vuePriceCalendar)
  }
}

export default comment
