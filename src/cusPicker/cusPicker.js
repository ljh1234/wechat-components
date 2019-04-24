// components/cusPicker/cusPicker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     text: {
         type: String,
         value: ''
     },
     range: {
         type: Array,
         value: []
     },
     key: {
         type: String,
         value: ''
     },
     show: {
         type: Boolean,
         value: false
     },
     value: {
         type: Array,
         value: []
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
    bindChange(e) {
        //console.log('change', e);
        this.setData({
            value: e.detail.value
        })
    },
    confirm() {
         this.triggerEvent('rangeselect', {
             key: this.data.key,
             value: this.data.value
         })
    },
    close() {
        this.setData({
            show: false
        })
    }

  }
})
