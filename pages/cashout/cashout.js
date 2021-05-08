import request from '../../http.js';
Page({
  data: {
    alBanShow:true,
    statusBarHeight:'',
				list:'',
				openModal:false,
				id:'',
				page:0,
				size:5,
				userInfo:'',
				Coin:'',//需要花费的金币,
				join:0,
				DrawTime:''//开奖时间
  },
  onLoad() {
    this.GetUserModel()
    this.GetLotteryManagementList();
    this.GetAdvertList();
  },
  onShow(){
     this.GetUserModel()
		this.GetLotteryManagementList();
  },
  onReachBottom() {
			this.data.page++;
			this.GetLotteryManagementList(true);
    },
  onReady() {
    var that=this;
    my.getSystemInfo({
      success(res) {
        console.log('手机信息',res)
        that.setData({
          statusBarHeight:res.statusBarHeight
        })
      }
    })
  },
  onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            alBanShow:true
          })
    }else{
      this.setData({
            alBanShow:false
          })
    }
  },
  	//获取阿里广告接口
  GetAdvertList(){
    request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'bmcg&'}).then(res=>{
      console.log('banner',res);
      if(res.success){
        this.setData({
          bmcgBanner:res.data
        })
      }
    })
},
   jump_activityRules(){
        console.log('e')
        my.navigateTo({
          url:'/pages/child/activityRules/activityRules'
        })
      },
		 //获取用户信息
  GetUserModel(){
      request('/api/v2/User/GetUserDetail/GetUserModel','GET', {
      // 传参参数名：参数值,如果没有，就不需要传
      }).then(res => {
        this.setData({
          userInfo:res.data
        })
      })
  },
  //获取红包列表
 GetLotteryManagementList(concat=false){
        request('/api/v2/Activity/GetLotteryManagementList/GetLotteryManagementList','GET',{page:this.data.page,size:this.data.size}
        ).then(res=>{
              if(res.success&&res.data.length>0){
                  console.log('cashoutList',res)
                    if(!concat){
                      var list=res.data;
                      this.setData({
                        list:list
                      })
                    }else{
                      var list=this.data.list
                     list=list.concat(res.data);
                     this.setData({
                        list:list
                      })
                    }
                     
              }else{
                this.setData({
                  page:this.data.page--
                })
              }
              my.hideLoading()
        })		
  },
  closeModal(){
    this.setData({
      modalname:''
    })
  },
  //点击抽奖
  choujiang(e){
    console.log(e);
    var id=e.currentTarget.dataset.id;
    var Coin=e.currentTarget.dataset.coin;
    var DrawTime=e.currentTarget.dataset.drawTime;
    if(Coin>this.data.userInfo.Coin){
      my.showToast({
        content:'金币不足',
        type:'none'
      });
      return;
    }
    this.setData({
      openModal:true,
      id:id,
      Coin:Coin,
      DrawTime:DrawTime
    })
    
  },
  //参与抽奖
  Join(){
    my.showLoading({
      title:'加载中'
    })
    this.Lottery()
  },
  //抽奖接口
			Lottery(){
				request('/api/v2/Activity/Lottery/Lottery','POST',{lotteryId:this.data.id}).then(res=>{
					if(res.success){
						my.hideLoading()
						this.setData({
              join:1,
						  page:0
            })
						this.GetLotteryManagementList();
						this.GetUserModel()
					}else{
						my.hideLoading()
						my.showToast({
							type:'none',
							content:res.msg
						})
						this.setData({
              openModal:false,
						  join:0,
            })
					}
					console.log('抽奖结果',res)
        })
  },
  close(){
    this.setData({
       openModal:false,
        join:0
    })
  },
    //任务跳转页面
			tabNav(e){
        console.log('测试',e)
        let JumpType=e.currentTarget.dataset.JumpType;
        let item=e.currentTarget.dataset.item;
        var that=this;
				if(JumpType==1){
          if(item.IsDone==false){
              this.setData({
                          modalname:'life',
                          lifeImg:item.Img,
                          lifeTittle:item.Title,
                          lifeSutittle:item.Subtitle,
                          sceneId:item.Component
                    })
          }
          this.setData({
            Id:item.Id
          })
					console.log('关注生活号')
					return;
        }
				if(JumpType==2){
          console.log('收藏小程序')
           my.setStorageSync({
                      key: 'Id',
                      data: item.Id
            });
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
						}
					})
					return;
        }
        if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
				if(JumpType==3){
					console.log('跳转小程序评价')
					my.navigateToMiniProgram({
						appId:item.APPID,
						path:item.AliAdvertisingLink,
						success:(res)=> {
							// that.watchTaobo()
						}
					})
					return;
				}
				if(JumpType==4){
					console.log('跳转直播间')
					let url='https://api.shupaiyun.com/html?taskid='+item.Id
					my.ap.navigateToAlipayPage({
						path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttps://api.shupaiyun.com/jumptb1.html?id='+item.Id,
						// path:'https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D20000067%2526url%3Dhttp://192.168.0.132:8848/tb/jump2.html?id='+item.Id,
						success:(res) => {
							
					        // my.alert({content:'系统信息' + JSON.stringify(res)});
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					
					return;
				}
				if(JumpType==5||JumpType==6){
					//生活号文章-h5
					my.ap.navigateToAlipayPage({
						path:item.AliAdvertisingLink,
						success:(res) => {
					      
					    },
					    fail:(error) => {
					        // my.alert({content:'系统信息' + JSON.stringify(error)});        
					    }
					})
					return;
				}
			if(JumpType==11){
          console.log('跳转其他小程序');
              my.navigateToMiniProgram({
                  appId: item.APPID,
                  path: item.AliAdvertisingLink,
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             });
					return;
				}
				if(JumpType==8){
					my.navigateTo({
						url:'../child/sign/sign'
					})
					return;
				}
				if(JumpType==9){
					console.log('跳转金币明细')
					my.navigateTo({
						url:'../child/balanceDetail/balanceDetail'
					})
					return;
				}
				if(JumpType==10){
					console.log('跳转邀请好友')
					// my.navigateTo({
					// 	url:'../invation/invation'
					// })
					my.navigateTo({
						url:'../child/invitation/invitation?taskid='+item.Id
					})
					return;
        }
        if(JumpType==7){
          console.log('添加支付宝首页');
          this.setData({
            modalname:'zhuomian'
          })

				}
      },
});
