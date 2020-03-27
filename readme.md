```js
formData: [
  {
    type: 'input',
    id: 'name',
    lable: '标题',
    isRequired: true,
    maxLength: 50,
    // defaultValue: '巡检计划计划内容',
    placeholder: '请输入标题',
    rules: [
      {
        regular: '^.{1,200}$',
        tips: '请输入200位以内字符'
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
    ]
  },
  {
    type: 'file',
    accept: 'video',
    id: 'video',
    lable: '视频上传',
    maxCount: 1,
    maxSize: 5,
    isRequired: true,
    fileList: [
      // { url: "http://tmp/wx4c198b0bd87f5470.o6zAJs1Ghz_xnqKSRnUi….xVILGkr0x8fm00dec98217739f2e6813a5937b68f928.mp4",isVideo:true}
    ]
  },
  {
    type: 'textarea',
    id: 'content',
    lable: '描述',
    isRequired: true,
    maxLength: 200,
    // defaultValue: '巡检计划计划内容',
    placeholder: '请输入需要上报的描述',
    rules: [
      {
        regular: '^.{1,200}$',
        tips: '请输入200位以内字符'
      }
    ]
  },
  {
    type: 'date',
    id: 'date1',
    lable: '日期',
    disabled: true,
    config: {
      initStartTime: '2020-02-02 08:09:12',
    },
    isRequired: true,
  },
  {
    type: 'picker',
    id: 'p1',
    lable: '选择',
    disabled: true,
    isRequired: true,
    range: [{name: 112},{name: 332}]
  },
],
```