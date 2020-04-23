const app = getApp()

Page({
  data: {
    formData: [
      {
        type: 'input',
        id:'ipt1',
        lable:'标题',
        isRequired: true,//是否必填
        maxLength: 20,//最大长度
        defaultValue:'巡检计划',//初始值
        rules:[//规则验证数组
          {
            regular: '^\\S*$',//正则字符串
            tips: '不能有空格'//错误提示
          },
        ]
      },
      {
        type: 'input',
        id: 'email',
        lable: '邮箱',
        placeholder: '请填写邮箱',
        rules: [
          {
            regular: '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$',
            tips: '邮箱格式错误'
          }
        ]
      },
      {
        type: 'picker',
        id: 'picker2',
        lable: '状态',
        defaultIdx:0,//默认选择索引
        isRequired:true,
        range:[
          {
            id: 0,
            name: '正常'
          },
          {
            id: 1,
            name: '异常'
          },
        
        ]
      },
      {
        type: 'date',
        id: 'timePicker',
        lable: '日期',
        isRequired: true,
        /* 显示完整时间包含时分秒；当使用endDate的时候关闭,不要同时打开, 否则日期将会换行；
           与config中的colum属性共同设置
        */
        // completeTime:true,
        config: {
          endDate: true,
          dateLimit: true,
          // initStartTime: "2020-01-01 12:32:44",
          // initEndTime: "2020-12-01 12:32:44",
          column: "day",//day、hour、minute、secend
          limitStartTime: "2000-01-01 00:00:59",
          limitEndTime: "2100-01-01 00:00:59"
        }
      },
      {
        type: 'textarea',
        id: 'textarea1',
        lable: '描述',
        isRequired: true,
        maxLength: 200,
        // defaultValue: '初始值',
        placeholder:'请输入描述',
        rules: [
          {
            regular: '^.{5,200}$',
            tips: '请输入5-200位以内字符'
          }
        ]
      },
      {
        type: 'file',
        accept: 'image',
        id: 'pics',
        lable: '图片上传',
        maxCount: 5,
        maxSize: 5,
        isRequired: true,
        fileList: [
          { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }//初始图片
        ]
      },
      {
        type: 'file',
        accept: 'video',
        id: 'video',
        lable: '视频上传',
        maxCount: 1,
        maxSize: 5,
        // isRequired: true,
        fileList: [
          // { url: "http://tmp/wx4c198b0bd87f5470.o6zAJs1Ghz_xnqKSRnUi….xVILGkr0x8fm00dec98217739f2e6813a5937b68f928.mp4",isVideo:true}
        ]
      },
    ],
    toSubmit: Math.random()
  },
  onFormSubmit(e){
    console.log('表单提交: ', e);
  },
  onFormChange(e){
    console.log('表单变化: ',e);
  },
  //变更数值, 触发表单提交事件
  toSubmitChange(){
    this.setData({
      toSubmit: Math.random()
    })
  },
  onLoad: function () {
    
  },
})
