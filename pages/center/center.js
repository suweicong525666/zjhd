import request from '../../http.js';
Page({
  data: {
    modalShow:false,
    modalname:''
  },
  onLoad() {
    this.login()          
  },
  login(){
    var that=this;
    my.getAuthCode({
         scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
         success: (result) => {
           console.log(result);
            request('/api/v2/Login/GetAliUser/GetAliUser','GET',{auth_code:result.authCode,puserid:this.data.userid?this.data.userid:'',appid:'2021002139665742'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
					}
           })
         },
        fail:(res)=>{
          console.log('fail',res.error)
          if(res.error==11){
              console.log('用户拒绝授权')
          }
        }
      });
  },
  onShow(){
    this.GetUserModel()
    if(this.data.time){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.time;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTime){
					console.log('观看时间达到条件')
					this.AddReward();
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTime+'秒以上才能领取奖励哦'
          })
          this.setData({
            time:'',
            timets:''
          })
        }
         return;
      }
     
			//特殊广告观看时间
			if(this.data.timets){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.timets;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTimets){
					console.log('特殊广告观看时间达到条件')
					this.AddRewardts()
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTimets+'秒以上才能领取奖励哦'
          })
           this.setData({
            timets:'',
            time:''
          })
				}
			}
  },
  onRenderSuccess(e){
    console.log('阿里123图片广告加载成功',e)
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
  onRenderSuccess_tswc(e){
     console.log('特殊任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            tsrw_alBanShow:true
          })
    }else{
       this.setData({
            tsrw_alBanShow:false
          })
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
        });
        this.GetTaskList()
      })
  },
  GetTaskList(){
     request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'wdymtsgg'},
				).then(syaligg=>{
					if(syaligg.success){
             this.setData({
               syalggList:syaligg.data
             })
					}
        })
         request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'wdymtsgg'},
				).then(tsrwgg=>{
					if(tsrwgg.success){
            this.setData({
               tsrwggList:tsrwgg.data
             })
					}
        })
  },
  jump_myCoin(){
     my.navigateTo({
      url: '/pages/child/myCoin/myCoin'
    });
  },
  jump_balance(){
    my.navigateTo({
      url: '/pages/child/balance/balance'
    });
  },
  //跳转建议反馈二级页面
			jump_feedBack(){
				my.navigateTo({
					url:'../child/feedback/feedback'
				})
			},
			//跳转抽奖记录二级页面
			jump_luckdraw(e){
        let index=e.currentTarget.dataset.index;
				my.navigateTo({
					url:'../child/luckdraw/luckdraw?tabIndex='+index
				})
				
			},
			//跳转我的反馈二级页面
			jump_myFeedback(){
				my.navigateTo({
					url:'../child/myFeedback/myFeedback'
				})
      },
       //点击阿里广告第一次
			jump_banner(e){
        console.log('e',e);
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
                BrowseTimets:item.BrowseTime,
                Id:item.Id
          })
					this.watchTaobo3()
				}
      },
      watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
             this.setData({
                  time:timestamp
             })
      },
       watchTaobo3(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;
            this.setData({
                timets:timestamp,
				        modalname:''
            })
				    console.log("当前时间戳为：" + timestamp); 
				    
      },
			//点击阿里广告第二次
			jump_bannerSecond(e){
        let num=e.currentTarget.dataset.num;
         let modalInfo=e.currentTarget.dataset.modalInfo;
          let item=e.currentTarget.dataset.item;
				console.log('您点击了广告',num,modalInfo)
				if(this.data.userInfo.NumberCompletions>=num&&modalInfo==false){
          console.log('有收益');
          this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
          })
					this.watchTaobo()
				}
      },
       //特殊广告收益接口
			 AddRewardts(){
				var that=this;
				request('/api/v3/Activity/AddReward/AddReward','POST',{taskId:this.data.Id}).then(res=>{
					if(res.success){
							if(res.data.RewardAmount>0){
                  this.setData({
                    	RewardAmount:res.data.RewardAmount,
                      modalType:res.data.Type,
                      modalname:'ts',
                      tsnum:1
                  })
							}
							console.log('观看特殊广告增加金币成功')
							console.log(res.data.RewardAmount);
              setTimeout(()=>{
                  that.GetTaskList();
                },1000)
              that.setData({
                timets:''
              })
							that.$uma.trackEvent('renwu_02',{'success':1});
					}else{
						   my.showToast({
							content:res.msg,
							type:'none'
						   })
					}
        })
      },
      //默认增加金币/集分宝接口
			 AddReward(){
         var that=this;
          request('/api/v3/Activity/AddReward/AddReward','POST',{ taskId: this.data.Id}).then(res=>{
            if(res.success){
                console.log('增加金币成功')
                console.log(res);
                setTimeout(()=>{
                  that.GetTaskList();
                },1000)
                this.setData({
                    modalname:'',
                    time:'',
                    Id:'',
                    BrowseTime:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
              
                my.uma.trackEvent('renwu_02',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
      },
      closeModal(){
        this.setData({
          modalShow:false,
          modalname:''
        })
      },
      //任务跳转页面
			tabNav(e){
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
                  
               my.uma.trackEvent('renwu_02',{'click':1})
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
                if(item.IsDone==false){
                  this.setData({
                      BrowseTime:item.BrowseTime,
                      Id:item.Id
                  })
                  that.watchTaobo();
                  my.uma.trackEvent('renwu_02',{'click':1})
              }
              my.navigateToMiniProgram({
                appId:item.APPID,
                path:item.AliAdvertisingLink,
                success:(res)=> {
                }
              })
					return;
        }
				if(JumpType==3){
          console.log('跳转小程序评价')
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
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
					 if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
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
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
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
			
        if(JumpType==7){
          console.log('添加桌面');
           my.setStorageSync({
                          key: 'zid',
                          data: item.Id
                });
          this.setData({
            RewardAmount:item.RewardAmount,
            modalname:'zhuomian'
          })
           my.uma.trackEvent('renwu_02',{'click':1})
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
        if(JumpType==11){
          console.log('跳转其他小程序');
           if(item.IsDone==false){
            this.setData({
                BrowseTime:item.BrowseTime,
                Id:item.Id
            })
            that.watchTaobo();
						my.uma.trackEvent('renwu_02',{'click':1})
					}
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
        if(JumpType==12){
            console.log(item);
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:item.AliAdvertisingLink
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
      },
});
