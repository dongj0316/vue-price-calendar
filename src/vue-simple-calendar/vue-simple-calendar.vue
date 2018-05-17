<template>
  <div class="vue-price-calendar">
    <div class="tab">
      <div class="prev" @click="prev"></div>
      <div class="month" v-for="mounth in months" @click="active = mounth" :class="{active: active.substring(0, 7) === mounth.substring(0, 7)}" :key="mounth">
        <span>{{viewMonth[+mounth.split('-')[1] - 1]}}</span>
        <div>{{mounth.substring(0, 4)}}</div>
      </div>
      <div class="next" @click="next"></div>
    </div>
    <div class="week">
      <span v-for="week in viewWeek" :key="week">{{week}}</span>
    </div>
    <div class="date">
      <template v-for="(item, index) in activeMonth.views">
        <div v-if="item" @click="activeDay = item.date" :class="{active: activeDay === item.date}" :style="{height: dayHeight}" :key="index">
          <div class="day">{{item.day}}</div>
          <template v-if="dayText[item.date]">
            <div class="day-text" v-for="text in dayText[item.date]" :class="{block: textVisible}" :key="text">{{text}}</div>
          </template>
        </div>
        <div v-else :key="index" :style="{height: dayHeight}"></div>
      </template>
    </div>
  </div>
</template>

<script>
const parseTime = function (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

const addMonth = function (time, num, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: 1,
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const newM = formatObj.m + num
  if (num >= 0) {
    if (newM > 12) {
      formatObj.y += 1
      formatObj.m = newM - 12
    } else {
      formatObj.m = newM
    }
  } else {
    if (newM < 1) {
      formatObj.y -= 1
      formatObj.m = newM + 12
    } else {
      formatObj.m = newM
    }
  }
  return format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

const getMonthDate = function (time) {
  return new Date(+time.getFullYear(), +time.getMonth() + 1, 0).getDate()
}

export default {
  name: 'vue-price-calendar',
  props: {
    // 星期显示配置
    viewWeek: {
      type: Array,
      default () {
        return ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    // 月份显示配置
    viewMonth: {
      type: Array,
      default () {
        return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      }
    },
    // 开始日期
    start: {
      type: String,
      default: parseTime(new Date(), '{y}-{m}-{d}')
    },
    // 天的高度
    dayHeight: {
      type: String,
      default: '50px'
    },
    // change携带值格式化
    formatValue: {
      type: String,
      default: '{y}-{m}-{d}'
    },
    // 日期下面的文本
    dayText: {
      type: Object,
      default () {
        return {
          '2018-05-01': ['五一', '￥200'],
          '2018-05-08': ['￥200']
        }
      }
    },
    // 是否默认显示文本内容
    textVisible: Boolean
  },
  data () {
    return {
      startDate: this.start,
      active: this.start,
      activeDay: ''
    }
  },
  computed: {
    end () {
      return addMonth(new Date(this.startDate), 3, '{y}-{m}-{d}')
    },
    months () {
      const arr = [0, 1, 2, 3]
      const start = new Date(this.startDate)
      return arr.map(v => addMonth(start, v, '{y}-{m}-{d}'))
    },
    dates () {
      const dates = {}
      this.months.map(month => {
        const od = new Date(month)
        // 当月天数
        const days = getMonthDate(od)
        // 1号星期几
        const firstWeek = od.getDay()
        const str = month.substring(0, 8)
        // 天、对应的年月日
        const views = new Array(firstWeek).concat(new Array(days).toString().split(',').map((v, i) => {
          const day = i + 1
          return {
            day: i + 1,
            date: str + (day < 10 ? '0' + day : day)
          }
        }))
        dates[month] = {
          days,
          firstWeek,
          views
        }
      })
      return dates
    },
    activeMonth () {
      return this.dates[this.active.substring(0, 8) + '01'] || this.dates[this.months[0]]
    }
  },
  // created () {
  //   console.log(this.startDate)
  //   console.log(this.end)
  //   console.log(this.months)
  //   console.log(this.dates)
  // },
  methods: {
    prev () {
      this.startDate = addMonth(new Date(this.startDate), -1, '{y}-{m}-{d}')
    },
    next () {
      this.startDate = addMonth(new Date(this.startDate), 1, '{y}-{m}-{d}')
    }
  },
  watch: {
    activeDay (newVl) {
      this.$emit('change', {
        value: parseTime(new Date(newVl), this.formatValue),
        text: this.dayText[newVl],
        year: newVl.substring(0, 4),
        month: newVl.substring(0, 7),
        day: newVl.substring(8)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.vue-price-calendar {
  position: relative;
  overflow: hidden;
  .tab {
    position: relative;
    display: flex;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 30px;
    z-index: 10;
    background: transparent;
    .prev, .next {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 100%;
    }
    .prev::before {
      content: ' ';
      position: absolute;
      top: 13px;
      left: 12px;
      width: 10px;
      height: 10px;
      border-left: 2px solid;
      border-bottom: 2px solid;
      transform: rotate(45deg);
    }
    .next {
      left: initial;
      right: 0;
      &:before {
        content: ' ';
        position: absolute;
        top: 13px;
        left: 6px;
        width: 10px;
        height: 10px;
        border-right: 2px solid;
        border-bottom: 2px solid;
        transform: rotate(-45deg);
      }
    }
    .month {
      position: relative;
      flex: 1;
      line-height: 40px;
      text-align: center;
      &.active:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
        background-color: #409EFF;
      }
      > div {
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        font-size: 12px;
        color: rgba(0, 0, 0, .2);
        transform: rotate(-45deg)
      }
    }
  }
  .week {
    position: relative;
    display: flex;
    height: 20px;
    margin-bottom: 10px;
    z-index: 10;
    background: transparent;
    > span {
      flex: 1;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
    }
  }
  .date {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    z-index: 10;
    background: transparent;
    > div {
      flex-shrink: 0;
      flex-basis: 1/7*100%;
      text-align: center;
      border-radius: 3px;
      &.active {
        color: #fff;
        background-color: #409EFF;
        .day-text {
          display: block;
        }
      }
    }
    .day {
      font-size: 12px;
    }
    .day-text {
      display: none;
      font-size: 10px;
      &.block {
        display: block;
      }
    }
  }
}
</style>
