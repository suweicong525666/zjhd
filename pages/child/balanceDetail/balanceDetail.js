import request from '../../../http.js';
Page({
  data: {
        list:[],
				tabIndex:0,
				tabList:['余额明细','集分宝明细'],
				page:1,
				size:10,
				noMore:false
  },
  onLoad(options) {
    if(options.index){
        this.setData({
            tabIndex:options.index
        })
    }
    this.GetAccountRecords()
  },
  onReachBottom() {
			this.data.page++;
			this.GetAccountRecords(true)
		},
  tab(e){
      let index=e.currentTarget.dataset.index;
      this.setData({
          tabIndex:index,
          page:1,
				  list:''
      })
				my.showLoading({
					content:'加载中'
				})
			
				this.GetAccountRecords()
			},
			//余额明细接口
			 GetAccountRecords(concat=false){
				 var that=this;
				 var num=Number(that.data.tabIndex)+Number(1);
				 var page=that.data.page;
         var size=that.data.size;
         request('/api/v2/User/GetAccountRecords/GetAccountRecords','GET',{Type:num,page:page,size:size}).then(res=>{
            if(res.success&&res.data.length>0){
                that.setData({
                    noMore:false
                })
							if(!concat){
                that.setData({
                  list:res.data
                })
							}else{
                that.setData({
                  list:that.data.list.concat(res.data)
                })
								
							}
						}else{
              that.setData({
                	noMore:true,
							    page:that.data.page-1
              })
						
						}
         })
			}
});
