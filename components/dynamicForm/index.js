// components/dynamicForm/index.js
import formatTime from "./utils/formatTime";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formData:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerMap:{},
    fileMap:{},
    inputMap:{}
  },
  lifetimes: {
    attached: function () { 
      this.formInit();
    },
    moved: function () { },
    detached: function () { },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //表单初始化
    formInit(){
      
      const pickerMap = {}, fileMap = {}, inputMap = {}, dateMap={};//存储各表单变化后的值,表单id为索引
      const pickers = [], files = [], inputs = [], datePickers=[];
      this.data.formData.forEach(val=>{
        switch (val.type) {
          case 'picker':
            pickers.push(val);
            break;
          case 'image':
            files.push(val);
            break;
          case 'input':
          case 'textarea':
            inputs.push(val)
            break;
          case 'date':
            datePickers.push(val)
            break;
          default:
            break;
        }
      })
      pickers.forEach(val => {
        pickerMap[val.id] = {
          original: val,
          idx:0
        }
      });
      files.forEach(val => {
        fileMap[val.id] = {
          original:val,
          error: null,
          list: val.fileList
        }
      });
      inputs.forEach(val=>{
        inputMap[val.id] = {
          original: val,
          value: val.defaultValue || '',
          error: null,
          rules: val.rules? val.rules.map(val=>{
            val.regular = new RegExp(val.regular)
            return val;
          }):[]
        }
      })
      datePickers.forEach(val=>{
        dateMap[val.id] = {
          original: val,
          show: false,
          startDate: formatTime().split(' ')[0] ,
          endDate: formatTime().split(' ')[0]
        }
      })
      this.setData({
        pickers,
        inputs,
        datePickers,
        files,
        pickerMap,
        inputMap,
        fileMap,
        dateMap
      });
    },
    //提交表单
    formSubmit(){
      let formData = {};
      const {pickerMap, inputMap, dateMap, fileMap} = this.data;
      for(let i in this.data){ //获取表单数据后缀为Map
        if(i.match(/Map$/)){
          formData = Object.assign({},formData,this.data[i])
        }
      }
      
      let hasError = false;
      for(let i in formData){//循环验证所有表单数据规则
        let info = formData[i];
        if (info.rules) {
          for (let val of info.rules) {
            if (!info.value.match(val.regular)) {
              info.error = val.tips || '格式有误';
              hasError = true
              break;
            }
          }
          this.setData({
            [`inputMap.${i}`]: info
          })
        } else if (info.original.type === 'image'){
          if (info.list.length === 0 && info.original.isRequired){
            info.error = '请选择图片'
            this.setData({
              [`fileMap.${i}`]: info
            })
          }
        }
      }
      
      if(hasError){
        wx.showToast({
          title: '表单填写有误',
          icon: 'none'
        })
        return;
      }
      console.log(formData);
      
    },
    //显示选择器
    datePickerShow(e){
      this.setData({
        [`dateMap.${e.target.dataset.id}.show`]: true
      })
    },
    //隐藏时间选择器
    datePickerHide(id){
      if(typeof id === 'object'){
        id = id.target.id
      }
      this.setData({
        [`dateMap.${id}.show`]: false
      })
    },
    //设置选择器时间
    setPickerTime(e){
      console.log(e);
      const { startTime, endTime } = e.detail;
      const date = this.data.dateMap[e.target.id]
      date.show = false;
      date.startDate = startTime.split(' ')[0];
      date.endDate = endTime.split(' ')[0];
      this.setData({
        [`dateMap.${e.target.id}`]: date
      })
    },
    //输入框
    onInput(e){
      const { value } = e.detail;
      const info = this.data.inputMap[e.target.id] || {};
      if(!info){
        return
      }
      info.value = e.detail.value;
      info.error = null;
      if (info.rules){
        for (let val of info.rules){
          if (!info.value.match(val.regular)){
            info.error = val.tips || '格式有误';
            break;
          }
        }
      }
      this.setData({
        [`inputMap.${e.target.id}`]: info
      })
    },
    //picker选择
    onPickerChange(e){
      const { id } = e.target
      const picker = this.data.pickerMap[id];
      picker.idx = e.detail.value;
      picker.data = this.data.pickers.filter(val => val.id === id)[0].range[e.detail.value]
      this.setData({
        [`pickerMap.${e.target.id}`]: picker
      })
    },
    // 选择文件
    onFileRead(e){
      console.log(e);
      for (let val of e.detail.file){
        if (val.size > 2097152) {
          wx.showToast({
            title: '请选择2MB以内的文件',
            icon: 'none'
          })
          return;
        }
      }
      const files = this.data.fileMap[e.target.id];
      files.error = null;
      files.list = files.list.concat(e.detail.file);
      this.setData({
        [`fileMap.${e.target.id}`]: files
      })
    },
    //删除文件
    onFileDelete(e){
      console.log(e);
      const files = this.data.fileMap[e.target.id].list;
      files.splice(e.detail.index, 1)
      this.setData({
        [`fileMap.${e.target.id}.list`]: files
      })
    }
  }
})
