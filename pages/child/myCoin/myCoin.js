import request from '../../../http.js';
Page({
  data: {
       tabList:['金币明细','抽奖记录'],
				tabIndex:0,
				page:1,
				size:7,
				list:'',
				userInfo:'',
  },
  onLoad() {
    this.GetAccountRecords();
			this.GetUserModel()
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
  tab(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
        tabIndex:index
    })
				my.showLoading({
					content:'加载中'
				})
				this.GetAccountRecords()
			},
  //余额明细接口
  GetAccountRecords(){	
    console.log('加载中')
      var that=this;
      var page=that.data.page;
      var size=that.data.size;
      if(that.data.tabIndex==0){
        var num=0
      }else{
        var num=1
      }
      request('/api/v2/User/GetCoinDetail/GetCoinDetail','GET',{Type:num}).then(res=>{
        console.log(res)
        if(res.success){
          that.setData({
              noMore:false,
             list:res.data
          })
        }
      })
  },
  //我的抽奖记录接口
   GetMyLotteryList(concat=false){
    request('/api/v2/Activity/GetMyLotteryList/GetMyLotteryList','GET', {DrawStatus:0,page:this.data.page,size:this.data.size}).then(res=>{
      if(res.success&&res.data.length>0){
            this.setData({
                 noMore:false,
            })
            if(!concat){
              this.setData({
                   list:res.data
              })
            }else{
              this.setData({
                   list:this.data.list.concat(res.data)
              })
             
            }
      }else{
        this.setData({
            noMore:true,
            page:this.data.page-1
        })
      }
    })
    
  },
  quchoujiang(){
    my.switchTab({
      url:'../../cashOut/cashOut'
    })
  },
  duihuan(){
    if(this.data.userInfo.Coin<10000){
      my.showToast({
        type:'none',
        content:'金币不足'
      });return;
    }
    my.showLoading({
      content:'加载中'
    })
    request('/api/v2/User/AddMoney','GET',{}).then(res=>{
        console.log(res);
      if(res.success){
          my.showToast({
          type:'success',
          content:'兑换成功'
          });
          this.GetAccountRecords();
          this.GetUserModel()
      }else{
          my.showToast({
           icon:'none',
            title:res.msg
          })
      }
    })
    
  }
});
