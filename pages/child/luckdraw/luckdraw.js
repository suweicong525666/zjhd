import request from '../../../http.js';
Page({
  data: {
    list:[],
				tabIndex:0,
				tabList:['全部','待开奖','已开奖'],
				page:1,
				size:10,
				noMore:false
  },
  onLoad(options) {
			if(options.tabIndex){
        this.setData({
            tabIndex:options.tabIndex
        })
			}
			this.GetMyLotteryList()
  },
  onReachBottom() {
			this.data.page++;
			this.GetMyLotteryList(true)
    },
    tab(e){
       let index=e.currentTarget.dataset.index;
				my.showLoading({
					content:'加载中',
					type:'none'
        })
        this.setData({
          tabIndex:index,
				  page:1,
				  list:[]
        })
				this.GetMyLotteryList()
			},
			
			//我的抽奖记录接口
			GetMyLotteryList(concat=false){
        request('/api/v2/Activity/GetMyLotteryList/GetMyLotteryList','GET',{DrawStatus:this.data.tabIndex,page:this.data.page,size:this.data.size}).then(res=>{
            if(res.success&&res.data.length>0){
                  this.setData({
                    noMore:false
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
				
			}
});
