const baseUrl = 'https://api.shupaiyun.com';
// const baseUrl = 'http://192.168.0.142:688';
const request = (url = '', type = '', date = {}, header = {
}) => {
    return new Promise((resolve, reject) => {
        my.request({
            method: type,
            url: baseUrl + url,
            data: date,
            headers: { 'content-type': 'application/json','Authorization': "Bearer "+ my.getStorageSync({ key: 'token' }).data || '' },
            dataType: 'json', 
            success:function(res){
              my.hideLoading();
              resolve(res.data)
            }        
        })
    });
}
export default request