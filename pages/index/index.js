import request from '../../http.js';
Page({
  data:{
     resourceId: "AD_20210426000000100568",
				  // resourceId: "ad_tiny_2021002129606766_202103172200007828",
				userInfo:'',
				timer :'',
				animationData: {},
				topList:'',
				top_r_bList:'',
				navList:[],
				dotStyle: true,
				userid:'',
				taskid:'',
				auth_code:'',
				BrowseTime:'',//规定的条件时间数
				time:'',//观看时间秒数，
				Id:'',
				jumpLink:'',
				modalShow:false,
				modalname:'',
				RewardAmount:'',
				modalType:'',
				rwlist:'',
				show:true,
				checkFollow: false,
				syalggList:'',//阿里普通广告
				tsrwggList:'',//阿里特殊广告
				aliggList:'',
				ggHeight:0,
				scrollTop:0,
				adTask:false,
				sceneId:'',//生活号id
				lifeImg:'',
				lifeTittle:'',
        lifeSutittle:'',
        onRenderSuccess:'',
        tsrw_alBanShow:''
  },
  onLoad(options) {
    //引流渠道进入
    if(options.channel){
        var channel=options.channel;
        this.setData({
          channel:options.channel
        })
         console.log('有渠道参数',channel)
         
          setTimeout(()=>{
           var myobj='{"'+options.channel+'":1}';
          console.log(myobj)
           my.uma.trackEvent('renwu_01',JSON.parse(myobj))
        },3000)
    }
    if(options.userid){
        //获取二维码参数
        this.setData({
            userid:options.userid,
				    taskid:options.taskId
        })
        this.login(options.userid);
      }else{
         this.login();
      }
      if(options.type){
        //收藏
				if(options.type=='s'){
					this.Id=my.getStorageSync({ key: 'Id' }).data
					this.AddReward()
				}
      }
      //判断是否添加桌面入口
      var zhuomianShow=my.getStorageSync({ key: 'zhuomianShow' }).data;
      if(zhuomianShow){
          //请求桌面进入收益
          this.AddReward_zhuomian()
      }
      if(options.appid){
           my.navigateToMiniProgram({
                  appId: options.appid,
                  path: options.path,
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
             }); 
      }
    // 页面加载
  
  },
  login(userid){
         var that=this;
         my.getAuthCode({
			   scopes: 'auth_base', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
			   success: (result) => {
      //      console.log(result);
           request('/api/v2/Login/GetAliUserSilent/GetAliUserSilent','GET',{auth_code:result.authCode,puserid:userid,appid:'2021002139665742'}).then(res=>{
             if(res.success){
                console.log('后端返回个人信息',res.data.access_token);
                my.setStorageSync({
                      key: 'token',
                      data: res.data.access_token
                });
						that.GetUserModel()
						that.GetTaskList()
					}
           })
           
			   },
			  });
  },
  closeModal(){
    this.setData({
      modalShow:false,
      modalname:''
    })
  },
  onRenderSuccess(e){
    console.log('阿里图片广告加载成功',e)
    if(e.detail.height>0){
          this.setData({
            alBanShow:true
          })
    }
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
  onRenderFail(e){
    console.log('阿里图片广告加载失败',e)
  },
  jump_allTasks(){
    my.navigateTo({
      url:'/pages/child/allTasks/allTasks'
    })
  },
  //广告位回调
  onComplete(data) {
    console.log('广告位回调',data);
    my.alert({
      title: '任务结束',
      content: data    });
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
  //获取首页展示的数据（气泡区-导航区-任务区）
  GetTaskList(){
				 //气泡区数据
				 request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'qp&'}
				 ).then(qp=>{
					 if(qp.success){
             this.setData({
               topList:qp.data
             })
					 }
         })
          //气泡区右下方数据
				 request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'qpyxf'},
				 ).then(qpyxf=>{
				 	if(qpyxf.success){
             	let navList=qpyxf.data;
						for(var i=0;i<navList.length;i++){
							navList[i].IsDone=true
            }
              this.setData({
               top_r_bList:navList
             })
				 	}
         })
         	 //导航栏数据
				request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'dh&'},
				).then(dh=>{
					if(dh.success){
						let navList=dh.data;
						for(var i=0;i<navList.length;i++){
							navList[i].IsDone=true
            }
              this.setData({
               navList:navList
             })
					}
        })
        	request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'rw&',page:this.page,size:this.size},
				).then(rw=>{
					if(rw.success){
             this.setData({
               rwlist:rw.data
             })
              my.uma.trackEvent('renwu_02',{'show':1})
					}
        })
        request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'syaligg'},
				).then(syaligg=>{
					if(syaligg.success){
             this.setData({
               syalggList:syaligg.data
             })
					}
        })
         request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'tsrwgg'},
				).then(tsrwgg=>{
					if(tsrwgg.success){
            this.setData({
               tsrwggList:tsrwgg.data
             })
					}
        })
         request('/api/v2/Activity/GetTaskList/GetTaskList','GET',{TaskArea:'aligg&'},
              ).then(aligg=>{
                if(aligg.success){
                  this.setData({
                    aliggList:aligg.data
                  })
                }
              })
      },
      jump_Mycoin(){
        my.navigateTo({
          url:'/pages/child/myCoin/myCoin'
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
          });
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
                  time:timestamp
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
              
                my.uma.trackEvent('renwu_1',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
      },
       //桌面增加金币/集分宝接口
			 AddReward_zhuomian(){
         var that=this;
         var zid=my.getStorageSync({ key: 'zid' }).data;
          request('/api/v3/Activity/AddReward/AddReward','POST',{ taskId: zid}).then(res=>{
            if(res.success){
                console.log('增加金币成功')
                console.log(res);
                my.removeStorageSync({
                  key: 'zid',
                });
                my.removeStorageSync({
                key: 'zhuomianShow',
              });
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
                my.uma.trackEvent('renwu_1',{'success':1});
                }else{
                    my.showToast({
                       type: 'none',
                      content:res.data.msg,
                    })
              }
          })
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
							that.$uma.trackEvent('renwu_1',{'success':1});
					}else{
						   my.showToast({
							content:res.msg,
							type:'none'
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
      lifeClose(){
        this.setData({
          modalname:'life'
        })
      },
      //modal子组件传值过来
      hidetest: function(info){ 
        console.log("获取组件传递的值：", info);
        if(info.close==0){
            this.setData({
              modalname:''
            })
        }
      },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    var token=my.getStorageSync({ key: 'token' }).data;
    if(token){
      this.GetUserModel();
      this.GetTaskList();
      this.GetAdvertList();
    }
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
  hongbao_close(){
    this.setData({
      modalname:''
    })
  },
  //流量位插件回调
			onCompletes(data){
        console.log('广告位回调',data)
        this.setData({
          Id:this.data.aliggList[0].Id
        })
				this.AddReward()
      },
      //获取阿里广告接口
			 GetAdvertList(){
        //  request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'SY&'}).then(res=>{
				// 	console.log('banner',res);
				// 	if(res.success){
        //     this.setData({
        //       syBanner:res.data
        //     })
				// 	}
				// })
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'rwwc&'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
              rwBanner:res.data
            })
					
					}
				})
				request('/api/v2/Advert/GetAdvertList/GetAdvertList','GET',{Position:'SYTS'}).then(res=>{
					console.log('banner',res);
					if(res.success){
            this.setData({
                syTsBanner:res.data
            })
						
					}
				})
			},
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
});
