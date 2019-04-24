// components/tabs/tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        model: {
            type: String,
            value: 'underline'
        },
        tablist: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentPane: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _paneTap(e) {
            this.setData({
                currentPane: Number(e.detail.key)
            });
            this.triggerEvent('panechange', {
                key: e.detail.key
            }, {})
        },
    }
})