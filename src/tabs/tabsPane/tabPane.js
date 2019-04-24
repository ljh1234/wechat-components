// components/tabs/tabsPane/tabPane.js
Component({
    // 生命周期
    lifetimes: {
        attached() {
            if(this.data.tip === null) {
                this.setData({
                    showTip: false
                });
            }
        }
    },
    /**
     * 组件的属性列表
     */
    properties: {
        label: {
            type: String,
            value: ''
        },
        tip: {
            type: Number,
            value: null
        },
        key: {
            type: Number,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showTip: true,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tabs_pane_tap() {
            this.triggerEvent('panetap', { key: this.data.key }, {})
        }
    }
})