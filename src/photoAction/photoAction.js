// components/photoAction/photoAction.js
import api from '../../utils/api';
import http from '../../utils/http';

Component({
   /**
    * 组件的属性列表
    */
   properties: {
      key: {
         type: String,
         value: ''
      },
      value: {
         type: String,
         value: ''
      },
      mediatype: {
         type: String,
         value: 'img'
      },
      result: {
         type: Number,
         value: 0
      },
      name: {
         type: String,
         value: ''
      },
      exampleurl: {
         type: Array,
         value: []
      },
      checktype: {
         type: String,
         value: ''
      },
      otherpar: {
         type: Object,
         value: {}
      }
   },
   options: {
      addGlobalClass: true,
   },

   /**
    * 组件的初始数据
    */
   data: {
   videoSrc: ''  
   },

   /**
    * 组件的方法列表
    */
   methods: {
      closeVideo() {
         this.setData({
               videoSrc: ''
         });
      },
      takePhoto(e) {
         const key = e.currentTarget.dataset.key;
         const source = e.currentTarget.dataset.sourcetype
         const type = this.data.checktype;

         wx.chooseImage({
               count: 1,
               sizeType: ['original', 'compressed'],
               sourceType: [source],
               success: (result) => {
                  const url = result.tempFilePaths[0];
                  console.log('图片链接', url);
                  
                  this.upOss(url).then(res => {
                     this.upImg(key, res.url, type);
                  })
               },
         });
      },
      takeVideo(e) {
            const key = e.currentTarget.dataset.key;
            const source = e.currentTarget.dataset.sourcetype
            const type = this.data.checktype;

            wx.chooseVideo({
               sourceType: [source],
               compressed: true,
               maxDuration: 20,
               success: (result)=>{
                  const url = result.tempFilePath;
                  console.log('视频链接', result);
                  if (result.duration > 20) {
                     wx.showModal({
                        title: '提示',
                        content: '视频时长不能超过20s,请重新选择或拍摄',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#3CC51F',
                     });
                     return 
                  } else {
                     this.upOss(url).then(res => {
                        this.upImg(key, res.url, type);
                     });
                  }
               
               },
            });
      },
      upOss(url) {
         return new Promise((resovle, reject) => {
            http.upFileOss({
               filePath: url
            }).then(res => {
               resovle(res);
            }).catch(() => {
               reject();
            })
         })
      },
      upImg(key, url, type) {
         http.request({
               method: 'truck.smallapp.dispatch',
               data: {
                  'method': api.G7S.SPEC_CHECK,
                  'job_no': wx.getStorageSync('job_no'),
                  'gpsno': wx.getStorageSync('gpsno'),
                  'check_type': type,
                  [key + '']: url,
                  ...this.data.otherpar
               }
         }).then(res => {
               wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 1500,
                  mask: false,
               });
               this.triggerEvent('update', { url, key, res }, {})
         }).catch(err => {
               wx.showModal({
                  title: '提示',
                  content: '照片上传失败,请重试',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#3CC51F',
               });
         });
      },
      select(e) {
         if (this.data.mediatype === 'img') {
               this.takePhoto(e);
         } else {
               this.takeVideo(e);
         }
      },
      lookFile(e) {
         const url = e.currentTarget.dataset.value;
         const type = this.data.mediatype;

         if (!url) {
               wx.showModal({
                  title: '提示',
                  content: '照片或视频不存在',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#3CC51F',
               });
               return;
         }
         if (type === 'img') {
               wx.previewImage({
                  current: url,
                  urls: [url]
               });
         } else {
            this.setData({
                  videoSrc: url
            })
         }
         
      }
   },
   attached() {}
})
