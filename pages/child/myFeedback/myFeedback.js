import request from '../../../http.js';
Page({
  data: {
        list:'',
				page:1,
				size:10,
				userInfo:''
  },
  onLoad() {
    this.GetUserModel()
  },
  onShow(){
    this.GetUserFeedbackRecord()
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
  jump_reply(e){
    console.log(e)
      let id=e.currentTarget.dataset.id;
				my.navigateTo({
					url:'../reply/reply?id='+id
				})
			},
			//我的反馈列表接口
		 GetUserFeedbackRecord(concat=false){
			 var that=this;
       request('/api/v2/User/GetUserFeedbackRecord/GetUserFeedbackRecord','GET').then(res=>{
          if(res.success&&res.data.length>0){
						var list=res.data;
						if(!concat){
              that.setData({
                	list:list
              })
						}else{
              that.setData({
                  list:that.data.list.concat(list)
              })
						}
					}else{
            // that.setData({
            //   page:that.data.page-1
            // })
						
					}
       })
			}
});
