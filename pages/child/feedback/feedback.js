import request from '../../../http.js';
Page({
  data: {
    focus:true,
        chooseIndex:0,
				chooseList:['意见','体验','BUG','需求','其他'],
				imgList:[],
				uploadList:[],
				text:'',
				imgList2:[]
  },
  onLoad() {},
  tab(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
        chooseIndex:index
    })
			
  },
  input(e){
    console.log(e);
    this.setData({
      text:e.detail.value
    })
    
  },
  //选择图片
  chooseImg(){
    var that=this;
    my.chooseImage({
        count: 1, //默认9
        sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
        console.log(res)
        const imgFile=res.tempFilePaths;
        that.setData({
            imgList:that.data.imgList.concat(res.tempFilePaths)  //图片的本地文件路径列表
        })
            
        }
    });
  },
  uploadFile(){
    var that=this;
    let imgList=this.data.imgList;
    console.log('imgList.length',imgList.length)
    for(var i=0;i<imgList.length;i++){
      console.log('imgList[i]',imgList[i])
      my.uploadFile({
        url: "https://api.shupaiyun.com/api/v2/File/Uploads", 
        fileType:'image',
        filePath: imgList[i],
        header:{
          'content-type': 'multipart/form-data',
          Authorization:'Bearer '+my.getStorageSync({ key: 'token' }).data
        },
        name: 'files',
        success: res => {
          var result=JSON.parse(res.data)
            console.log('临时图片',imgList)
            if(result.success){
                console.log('result.data[0].openId',result.data[0].openId);
              // that.imgList=result.data[0].openId;
              that.setData({
                    imgList2:result.data[0].openId
              })
              that.AddAccountRecords()
            }
            
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }
    console.log('10000')
    
  },
  //删除图片
  del(e){
    let index=e.currentTarget.dataset.index;
    let imgList=this.data.imgList;
    let uploadList=this.data.uploadList;
    imgList.splice(index,1);
    uploadList.splice(index,1);
    this.setData({
          imgList:imgList,
          uploadList:uploadList
    })
  
  },
			submit(){
				if(this.data.text==''){
					my.showToast({
						type:'none',
						content:'请填写问题'
					});
					return;
				}
				my.showLoading({
					content:'提交中'
        })
				this.fn1()
				  
			},
			
        AddAccountRecords(){
				 var that=this;
				 var chooseIndex=that.data.chooseIndex;
				 setTimeout(()=>{
             console.log('提交中123132132');
            request('/api/v2/User/AddAccountRecords/AddAccountRecords','POST',{'feedback':that.data.text,tags:that.data.chooseIndex,
					 						img:[that.data.imgList2]}).then(res=>{
                   if(res.success){
					 						  my.showToast({
					 							type:'success',
					 							content:'提交成功'
					 						  })
					 						  setTimeout(()=>{
					 							 my.navigateBack({
					 							 	delta:1
					 							 })
					 						  },1000)
					        }
            })
				 },2000)
			  },
			 
			  fn1(){
          console.log('7')
			      return new Promise((resolve, reject) => {
			          setTimeout(() => {
			             this.uploadFile()
			              resolve()
			          }, 100);
			      })
			  },
			   
			 
});
