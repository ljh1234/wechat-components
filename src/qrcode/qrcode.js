import qrcode from '../../utils/qrcode'

Component({
  properties: {
      url: {
          type: String,
          value: ''
      }
  },

  data: {
    showQrcodeMask: true,
    url:''
  },

    lifetimes: {
        attached() {
            this.createQrCode(this.data.url, "qrcode-canvas", 200 , 200)
        }
    },

  methods: {
      openMask: function () {
          this.setData({
              showQrcodeMask: true
          })
      },

      closeMask: function () {
          this.setData({
              showQrcodeMask: false
          })

          this.triggerEvent('closeMask',{});
      },

      createQrCode:function(url,canvasId,cavW,cavH) {
          var self = this
          qrcode.api.draw(url,canvasId,cavW,cavH,this)
          setTimeout(function () {
              self.canvasToTempImage()
          },500)
      },

      canvasToTempImage:function(){
          var self = this
          wx.canvasToTempFilePath({
              canvasId: 'qrcode-canvas',
              success: function (res) {
                  wx.hideLoading()
                  console.log("success")
                  console.log(res)
              },
              fail: function (res) {
                  console.log("fail")
                  console.log(res)
              }
          },this)
      },
  }
})
