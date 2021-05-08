import request from '../../../http.js';
Page({
  data: {
        moneyIndex:0,
				moneyList:[],
				userInfo:'',
				money:''
  },
  onLoad() {
      this.GetUserModel()
			this.GetWithdrawList()
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
  //快速选中金额
			tabMoney(e){
        let index=e.currentTarget.dataset.index;
        this.setData({
          moneyIndex:index
        })
			},
			//跳转我的余额明细页
			jump_balanceDetail(e){
        console.log(e)
        let index=e.currentTarget.dataset.index;
				my.navigateTo({
					url:'../balanceDetail/balanceDetail?index='+index
				})
			},
			//获取可提现金额列表
			 GetWithdrawList(){
        var that=this;
          request('/api/v2/User/GetWithdrawList/GetWithdrawList','GET',{}).then(res=>{
            if(res.success==true){
                  that.setData({
                      moneyList:res.data
                  })
                  console.log('res',res.data.data)
            }
          })
			},
			//提现接口
			 UserWithdraw(){
				 request('/api/v2/User/UserWithdraw/UserWithdraw','POST',{withdrawId:this.data.moneyList[this.data.moneyIndex].Id},
				 ).then(res=>{
					 if(res.success){
						my.showToast({
							content:'提交成功',
							type:'none'
						});
						this.GetUserModel()
					 }else{
						my.showToast({
							content:res.msg,
							type:'none'
						}) 
					 }
					 console.log('res',res)
				 })
			},
			submit(){
				console.log('点击了提现')
				if(this.data.userInfo.Money<this.data.moneyList[this.data.moneyIndex].ButtonAmount){
					my.showToast({
						content:'余额不足'
					});return
				}
				my.showLoading({
					content:'提现中'
				})
				this.UserWithdraw()
			},
});
