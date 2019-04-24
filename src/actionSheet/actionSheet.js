Component({
    properties: {
        isShow: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: ''
        },
        content: {
            type: Array,
            value: []
        }
    },

    options: {
        addGlobalClass: true
    },

    data: {
        selected_index: -1
    },

    methods: {
        clear() {
            this.setData({
                isShow: false,
                title: '',
                content: [],
                selected_index: -1
            })
        },

        selectIndex(e) {
            this.setData({
                selected_index: e.currentTarget.dataset.index
            })
        },

        cancel() {
            this.clear()

            this.triggerEvent('cancel',{})
        },

        confirm() {
            this.clear()

            this.triggerEvent('confirm',{
                selected_index: this.data.selected_index
            })
        }
    }
})
