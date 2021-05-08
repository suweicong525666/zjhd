import request from '../../../http.js';
Page({
  data: {
    list:'',
    show:true,
    page:1,
    size:10,
    modalShow:false
  },
  onLoad() {
    this.GetTaskList()
    this.GetAdvertList()
  },
  onShow(){
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
            times:'',
            timets:''
          })
				}
			}
			//特殊广告观看时间
			if(this.data.times){
					var timestamp = Date.parse(new Date());
					timestamp = timestamp / 1000; 
					let useTime=timestamp-this.data.times;
					console.log('useTime',useTime)
				if(useTime>=this.data.BrowseTimes){
					console.log('特殊广告观看时间达到条件')
					this.AddSign()
					//当前观看的时间大于等于接口返回的条件时间数，请求添加收益接口
				}else{
					my.alert({
						content:'访问'+this.data.BrowseTimes+'秒以上才能领取奖励哦'
          })
          this.setData({
            time:'',
            times:'',
            timets:''
          })
				}
			}
  },
 onReachBottom() {
			this.data.page++;
			this.GetTaskList(true)
  },
  onRenderSuccess_rwwc(e){
     console.log('任务完成阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            rw_alBanShow:true
          })
    }else{
       this.setData({
            rw_alBanShow:false
          })
    }
  },
   onRenderSuccess_tsrwwc(e){
     console.log('任务完成阿里图片广告加载成功',e)
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
    //获取阿里广告接口
			 GetAdvertList(){
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'rwwc&'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
              rwBanner:res.data
            })
					
					}
				})
			},
  GetTaskList(concat=false){
        request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{	TaskArea:'rw&',page:this.data.page,size:this.data.size}).then(res=>{
            	if(res.success&&res.data.length>0){
                  this.setData({
                      noMore:false
                  })
                  if(!concat){
                    this.setData({
                       list:res.data
                    })
                   
                  }else{
                    var list=this.data.list.concat(res.data)
                    this.setData({
                      list:list
                    })
                  }
                  my.uma.trackEvent('renwu_1',{'show':1})
          }else{
              this.setData({
                	noMore:true,
				        	page:this.data.page-1
              })
				}
        })
			
			},
     //任务跳转页面
			tabNav(e){
        console.log('测试',e)
        	my.uma.trackEvent('renwu_1',{'channel':1})
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
                  
               my.uma.trackEvent('renwu_1',{'click':1})
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
                  my.uma.trackEvent('renwu_1',{'click':1})
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
						my.uma.trackEvent('renwu_1',{'click':1})
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
						my.uma.trackEvent('renwu_1',{'click':1})
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
						my.uma.trackEvent('renwu_1',{'click':1})
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
           my.uma.trackEvent('renwu_1',{'click':1})
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
						my.uma.trackEvent('renwu_1',{'click':1})
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
            if(item.AliAdvertisingLink){
                my.navigateTo({
                  url:AliAdvertisingLink
                })
            }else{
              my.alert({
                content:'参数有误,请联系管理人员'
              })
            }
            return;
        }
      },
       watchTaobo(){
				var that=this;
				//获取当前时间戳  
				    var timestamp = Date.parse(new Date());  
            timestamp = timestamp / 1000;  
             console.log("当前时间戳为：" + timestamp); 
             this.setData({
                 time:timestamp,
                  modalShow:false,
                  modalname:''
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
                    page:1,
                    time:'',
                    RewardAmount:res.data.RewardAmount,
                    modalType:res.data.Type,
                    modalShow:true
                })
              
                my.uma.trackEvent('renwu_1',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.msg,
                    })
              }
          })
      },
       //关注生活号回调
			  closeCb(e){
            console.log('已经关注完生活号,请求金币收益接口');
            if(e.detail.followed==true){
              this.setData({
                modalname:''
              })
					   this.AddRewardPublic();
				  }
			  },
      //关注工作号请求的增加金币/集分宝接口接口
			AddRewardPublic(){
        if(!this.data.Id){
          return;
        }
				var that=this;
				request('/api/v3/Activity/AddReward/AddReward','POST',{taskId:this.data.Id},
				).then(res=>{
          if(res.success==true){
                my.uma.trackEvent('renwu_1',{'success':1});
               this.setData({
                   Id:'',
                   RewardAmount:res.data.RewardAmount,
                   modalType:res.data.Type,
                   modalShow:true
               })
                setTimeout(()=>{
                  that.GetTaskList();
                },1000)
              }
          })
      },
      closeModal(){
        this.setData({
          modalname:'',
          modalShow:false
        })
      }
});
