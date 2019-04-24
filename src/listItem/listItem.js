// components/detectListItem/detectListItem.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
      multipleSlots: true,
  },
  properties: {
    showArrow: {
        type: Boolean,
        value: true
    },
    title: {
        type: String,
        value: ''
    },
    info: {
        type: String,
        value: ''
    },
    callback: {
        type: Function,
        value: ()=> {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapfn() {
        typeof callback === 'function' ? callback() : false;
    }
  }
})
