<script>
import Item from './item'

export default {
  components: { Item },
  props: {
    items: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      innerWidth: null,
      allShow: false,
      buttons: {
        type: 'buttons',
      },
    }
  },
  created() {},
  mounted() {
    window.onresize = this.windowResize
    const innerWidth = window.innerWidth
    this.innerWidth = innerWidth
    this.setItems()
  },
  methods: {
    windowResize(e) {
      this.innerWidth = e.target.innerWidth
      this.setItems()
    },
    search() {
      const params = {}
      this.items.map((item) => {
        if (item.value)
          params[item.key] = item.value
      })
      this.$emit('search', params)
    },
    reset() {
      const items = this.items
      const doms = []
      items.map((item) => {
        if (item.key) {
          const dom = this.$refs[item.key]
          doms.push(dom)
        }
      })
      doms.map((item) => {
        const dom = item[0].$children[0].$children[0]
        if (dom.handleClear)
          dom.handleClear()
        else if (dom.reset)
          dom.reset()
      })
      items.forEach((item) => {
        item.value = null
      })
      this.items = items
    },
    open() {
      this.allShow = !this.allShow
      this.setItems()
    },
    event(item) {
      const params = {}
      this.items.map((item) => {
        if (item.value)
          params[item.key] = item.value
      })
      this.$emit('event', params)
    },
    setItems() {
      const { items, innerWidth, buttons } = this
      const index = items.findIndex((item) => {
        return item.type === 'buttons'
      })
      if (index !== -1)
        items.splice(index, 1)

      let width = 0
      if (innerWidth >= 1600) {
        items.splice(3, 0, { type: 'buttons' })
        width = 6
      } else if (innerWidth >= 992) {
        items.splice(2, 0, { type: 'buttons' })
        width = 8
      } else {
        items.splice(1, 0, { type: 'buttons' })
        width = 12
      }

      items.forEach((item, index) => {
        if (item.size === 'large') {
          const befores = items.slice(0, index)
          const beforeWidth = befores.reduce((a, b) => {
            return a + (b.width || width)
          }, 0)
          const used = beforeWidth % 24
          if (24 - used < 12)
            item.width = 24
          else
            item.width = 24 - used
        }
        if (this.allShow) {
          item.show = true
        } else {
          if (width === 6)
            item.show = index <= 3
          else if (width === 8)
            item.show = index <= 2
          else
            item.show = index <= 1
        }
      })
      this.items = items
    },
  },
}
</script>

<template>
  <div :class="allShow ? 'search-area all-show' : 'search-area'">
    <el-row>
      <Item
        v-for="(item, index) in items"
        v-show="item.show"
        :key="index + (item.label || 'a')"
        :ref="item.key"
        :item="item"
        :all-show="allShow"
        @event="event"
        @open="open"
        @search="search"
        @reset="reset"
      />
    </el-row>
  </div>
</template>

<style scoped>
.search-area {
  background-color: #fff;
  background-clip: border-box;
  box-sizing: border-box;
  padding: 10px 20px;
  animation: all 1s linear;
}

.search-col {
  margin: 10px 0;
}

.all-show {
  height: auto;
}

.form-label {
  line-height: 30px;
  text-align: right;
  padding-right: 8px;
}
</style>
