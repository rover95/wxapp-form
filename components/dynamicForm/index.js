// components/dynamicForm/index.js
import formatTime from './utils/formatTime';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formData: Array,
    showSubmitBtn: {
      type: Boolean,
      value: true
    },
    toSubmit: Number
  },
  //监听数据变化, 当toSubmit 值变化时, 代表父组件点击提交案例事件
  observers: {
    'toSubmit': function (e) {
      if (e) {
        this.formSubmit();
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    pickerMap: {},
    fileMap: {},
    inputMap: {}
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
    formInit() {

      const pickerMap = {}, fileMap = {}, inputMap = {}, dateMap = {};//存储各表单变化后的值,表单id为索引
      const pickers = [], files = [], inputs = [], datePickers = [];
      this.data.formData.forEach(val => {
        switch (val.type) {
          case 'picker':
            pickers.push(val);
            break;
          case 'file':
            files.push(val);
            break;
          case 'input':
          case 'textarea':
            inputs.push(val);
            break;
          case 'date':
            datePickers.push(val);
            break;
          default:
            break;
        }
      });
      pickers.forEach(val => {
        pickerMap[val.id] = {
          original: val,
          hasChoose: val.defaultIdx != 'undefined',
          error:null,
          idx: val.defaultIdx || 0
        };
      });
      files.forEach(val => {
        fileMap[val.id] = {
          original: val,
          error: null,
          list: val.fileList
        };
      });
      inputs.forEach(val => {
        inputMap[val.id] = {
          original: val,
          value: val.defaultValue || '',
          placeholder: val.placeholder,
          error: null,
          rules: val.rules ? val.rules.map(val => {
            val.regular = new RegExp(val.regular);
            return val;
          }) : []
        };
      });
      datePickers.forEach(val => {
        dateMap[val.id] = {
          original: val,
          config: val.config,
          completeTime: val.completeTime,
          show: false,
          hasChoose: !!val.config.initStartTime,
          error: null,
          startDate: val.config.initStartTime || formatTime(),
          endDate: val.config.initEndTime || formatTime()
        };
        if (!val.completeTime){
          dateMap[val.id].startDate = dateMap[val.id].startDate.split(' ')[0];
          dateMap[val.id].endDate = dateMap[val.id].endDate.split(' ')[0];
        }
      });
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
    formSubmit() {
      let formData = {};
      const { pickerMap, inputMap, dateMap, fileMap } = this.data;
      for (let i in this.data) { //获取表单数据后缀为Map
        if (i.match(/Map$/)) {
          formData = Object.assign({}, formData, this.data[i]);
        }
      }
      let hasError = false;
      for (let i in formData) {//循环验证所有表单数据规则
        let info = formData[i];
        if (info.original.type === 'input' || info.original.type === 'textarea') {
          if (!info.value){
            if (info.original.isRequired){
              info.error = info.original.lable + '不可为空';
              hasError = true;
            }
          } else if (info.rules){
            for (let val of info.rules) {
              if (!info.value.match(val.regular)) {
                info.error = val.tips || '格式有误';
                hasError = true;
                break;
              }
            }
          }
          this.setData({
            [`inputMap.${i}`]: info
          });
        } else if (info.original.type === 'file') {
          if (info.list.length === 0 && info.original.isRequired) {
            let error = '请选择文件';
            if (info.original.accept === 'video') {
              error = '请选择视频';
            } else if (info.original.accept === 'image') {
              error = '请选择图片';
            }
            info.error = error;
            hasError = true;
            this.setData({
              [`fileMap.${i}`]: info
            });
          }
        } else if (info.original.type === 'picker' || info.original.type === 'date'){
          if (!info.hasChoose && info.original.isRequired){
            info.error = '请选择' + info.original.lable;
            hasError = true;
            this.setData({
              [`${info.original.type}Map.${i}`]: info
            });
          }
        }
      }
      if (hasError) {
        wx.showToast({
          title: '表单填写有误',
          icon: 'none'
        });
        return;
      }
      this.triggerEvent('dynamicFormSubmit', formData);
      console.log(formData);

    },
    //更新数据劫持
    updateData(key,val){
      this.setData({
        [key]: val
      });
      this.triggerEvent('dynamicFormChange', { key, val});
    },
    //显示选择器
    datePickerShow(e) {
      if (e.target.dataset.disabled) {
        return;
      }
      this.setData({
        [`dateMap.${e.target.dataset.id}.show`]: true
      });
    },
    //隐藏时间选择器
    datePickerHide(id) {
      if (typeof id === 'object') {
        id = id.target.id;
      }
      this.setData({
        [`dateMap.${id}.show`]: false
      });
    },
    //设置选择器时间
    setPickerTime(e) {
      const {dateMap} = this.data;
      const { startTime, endTime } = e.detail;
      const date = dateMap[e.target.id];
      if (!date.hasChoose){
        date.hasChoose = true;
        date.error = null;
      }
      date.show = false;
      date.startDate = date.completeTime ? startTime :startTime.split(' ')[0];
      date.endDate = date.completeTime ?endTime :endTime.split(' ')[0];
      this.updateData(`dateMap.${e.target.id}`,date);
    },
    //输入框
    onInput(e) {
      const { value } = e.detail;
      const info = this.data.inputMap[e.target.id] || {};
      if (!info) {
        return;
      }
      info.value = e.detail.value;
      info.error = null;
      if (info.rules && info.value) {
        for (let val of info.rules) {
          if (!info.value.match(val.regular)) {
            info.error = val.tips || '格式有误';
            break;
          }
        }
      }
      this.updateData(`inputMap.${e.target.id}`, info);
    },
    //picker选择
    onPickerChange(e) {
      const { id } = e.target;
      const picker = this.data.pickerMap[id];
      if(!picker.hasChoose){
        picker.hasChoose = true;
        picker.error = null;
      }
      picker.idx = e.detail.value;
      picker.data = this.data.pickers.filter(val => val.id === id)[0].range[e.detail.value];
      this.updateData(`pickerMap.${e.target.id}`, picker);
    },
    // 选择文件
    onFileRead(e) {
      console.log(e);
      for (let val of e.detail.file) {
        const size = this.data.fileMap[e.target.id].original.maxSize;
        if (val.size > size * 1024 * 1024) {
          wx.showToast({
            title: `请选择${size}MB以内的文件`,
            icon: 'none'
          });
          return;
        }
      }
      const files = this.data.fileMap[e.target.id];
      files.error = null;
      files.list = files.list.concat(e.detail.file);
      this.updateData(`fileMap.${e.target.id}`, files);
    },
    //删除文件
    onFileDelete(e) {
      console.log(e);
      const files = this.data.fileMap[e.target.id].list;
      files.splice(e.detail.index, 1);
      this.updateData(`fileMap.${e.target.id}.list`, files);
    }
  }
});
