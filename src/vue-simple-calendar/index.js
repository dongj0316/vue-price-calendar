import VueSimpleCalendar from './vue-price-calendar.vue'

const comment = {
  install: function (Vue) {
    Vue.component(VueSimpleCalendar.name, VueSimpleCalendar)
  }
}

if (typeof window !== undefined && window.Vue) {
  window.Vue.use(comment)
}

export default comment
