// components/addPhoto/addPhoto.js
import http from "../../utils/http";
import api from "../../utils/api";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
     imageList: {
         type: Array,
         value: [],
         observer: '_listPropertyChange'
     }, // 传入图片列表
     name: {
         type: String,
         value: ''
     },// 名称
     limit: {
         type: Number,
         value: 5
     },// 限制拍照张数
     disabled: {
        type: Boolean,
        value: false
     }// 删除照片,新增照片是否可用
  },
  options: {
      addGlobalClass: true
  },
  /**
   * 组件的初始数据
   */
  data: {
      list: []
  },
  lifetimes: {
      attached() {
          this.setData({
              list: this.data.imageList
          })
      }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    takePhoto(e) {
        const self = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths[0];
                const list = self.data.imageList;
                http.upFile({
                    method: api.GSP.FILE.UP_LOAD_FILE,
                    filePath: tempFilePaths
                }).then(res => {
                    list.push(res.fileurl);
                    self.setData({
                        list: list
                    });
                    console.log('list',list);
                    
                    self.refreshList()
                });
            }
        })
    },
    deleteImg(e) {
        const index = e.currentTarget.dataset.index;
        const list = this.data.list;
        let newList = [];
        list.forEach((item, i, arr) => {
            if (!(index + '' === i + '')) {
                newList.push(item);
            }
        });
        this.setData({
            list: newList
        });

        this.refreshList()
    },
    viewImg(e) {
         const i = e.currentTarget.dataset.i;
         const url = this.data.imageList[i];
         const urls = this.data.imageList;
         wx.previewImage({
             current: url, // 当前显示图片的http链接
             urls: urls
         });
    },
    getList() {
        return this.data.list;
    },
    refreshList() {
        this.triggerEvent('refreshList', {
            list: this.data.list,
            name: this.data.name
        }, {});
    },

      _listPropertyChange(newVal, oldVal) {
          this.setData({
              list: newVal
          })
      }
  }
})
