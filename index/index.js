const app = getApp()

Page({
  data: {
    formData: [
      {
        type: 'input',
        id:'ipt1',
        lable:'标题',
        isRequired: true,
        maxLength: 20,
        defaultValue:'巡检计划',
        rules:[
          {
            regular: '^.+$',
            tips: '标题不可为空'
          },
        ]
      },
      {
        type: 'input',
        id: 'ipt2',
        lable: '位置',
        placeholder: '请填写位置',
        rules: [
          {
            regular: '^\\S*$',
            tips: '不能有空格'
          },
          {
            regular: '^.+$',
            tips: '不能为空'
          }
        ]
      },
      {
        type: 'picker',
        id: 'picker2',
        lable: '状态',
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
        config: {
          // endDate: true,
          dateLimit: true,
          column: "day",
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
        // defaultValue: '巡检计划计划内容',
        placeholder:'请输入描述',
        rules: [
          {
            regular: '^.{1,200}$',
            tips: '请输入200位以内字符'
          }
        ]
      },
      {
        type: 'image',
        id: 'img1',
        lable: '图片上传',
        isRequired: true,
        fileList: [
          { url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' },
        ]
      },
      {
        type: 'image',
        id: 'img2',
        lable: '图片上传',
        fileList: [
        ]
      },
    ]
  },
  onLoad: function () {
    
  },
})
