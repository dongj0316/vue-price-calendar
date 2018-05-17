import vuePriceCalendar from './vue-price-calendar.vue'

const comment = {
  install: function (Vue) {
    Vue.component(vuePriceCalendar.name, vuePriceCalendar)
  }
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(comment)
}

export default comment
