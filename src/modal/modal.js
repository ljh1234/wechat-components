// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    content: '',
    title: '',
    phone: '',
    phoneBefore: '',
    phoneAfter: '', 
    callback: () => {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(opt) {
        this.clear();

        if (!(typeof opt === 'object')) return;

        if (opt.phone) {
            this.setData({
                title: opt.title ? opt.title : '',
                phone: opt.phone ? opt.phone : '',
                phoneBefore: opt.phoneBefore ? opt.phoneBefore : '',
                phoneAfter: opt.phoneAfter ? opt.phoneAfter : '',
                callback: opt.callback ? opt.callback : () => {}
            })
        } else {
            this.setData({
                title: opt.title ? opt.title : '',
                content: opt.content ? opt.content : '',
                callback: opt.callback ? opt.callback : () => {}
            });
        }
        this.open();
    },
    clear() {
        this.setData({
            isShow: false,
            content: '',
            title: '',
            phone: '',
            phoneBefore: '',
            phoneAfter: '',
            callback: () => {}
        });
    },
    open() {
        this.setData({
            isShow: true
        });
    },
    close() {
        this.clear();
        this.setData({
            isShow: false
        });
    },
    confirm() {
        this.close();
        typeof this.callback === 'function' ? this.callback() : true;
    },
    call() {
        const self = this;
        if (self.data.phone) wx.makePhoneCall({ phoneNumber:  self.data.phone + ''})
    }
  }
})
