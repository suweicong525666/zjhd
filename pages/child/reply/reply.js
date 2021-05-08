import request from '../../../http.js';
Page({
  data: {
    focus:true,
    list:'',
    page:1,
    size:10,
    userInfo:'',
    inputValue:''
  },
  onLoad(options) {
    this.GetUserModel();
			if(options.id){
          this.setData({
              	id:options.id
          })
				this.GetUserFeedbackRecordDetail(options.id)
			}
  },
   //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        console.log('成功回调',res)
        this.setData({
          userInfo:res.data
        })
      })
  },
  //详情接口
			GetUserFeedbackRecordDetail(id){
				request('/api/v2/User/GetUserFeedbackRecordDetail/GetUserFeedbackRecordDetail','GET',{Id:id}).then(res=>{
					console.log(res)
					if(res.success){
            this.setData({
                list:res.data
            })
						
					}
				})
				
			},
			inputV(e){
        console.log(e);
        this.setData({
          inputValue:e.detail.value
        })
			},
			//发送
			send(){
				if(this.data.inputValue==''){
					my.showToast({
						type:'none',
						content:'请填写回复内容'
					});return;
				}
				request('/api/v2/User/AddAccountRecords/AddAccountRecords','POST',{id:this.data.list[0].Id,Feedback:this.data.inputValue}).then(res=>{
					console.log(res)
					if(res.success){
						my.showToast({
							type:'success',
							content:'回复成功'
            });
            this.setData({
              inputValue:''
            })
						this.GetUserFeedbackRecordDetail(this.data.id)
					}
				})
			}
});
