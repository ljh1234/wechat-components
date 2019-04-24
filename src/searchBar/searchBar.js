// components/searchBar/searchBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showButton: {
        type: Boolean,
        value: true
    },
    placeholdertext: {
        type: String,
        value: '请输入搜索内容'
    },
    buttoncolor: {
        type: String,
        value: '#00a9e2'
    },
    type: {
        type: String,
        value: 'text' // text/number/idcard/digit
    },
    bindinput: {
        type: Function,
        value: function(value) {}
    },
    bindblur: {
        type: Function,
        value: function (value) {}
    },
    bindconfirm: {
        type: Function,
        value: function (value) {}
    },
    loading: {
        type: Boolean,
        value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchContent: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _input(e) {
        this.data.bindinput(e.detail.value)
    },
    _blur(e) {
        this.data.bindblur(e.detail.value)
    },
    _confirm(e) {
        this.data.bindconfirm(e.detail.value)
    }
  }
})
