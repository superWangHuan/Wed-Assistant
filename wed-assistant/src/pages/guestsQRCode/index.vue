<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="QR-box">
                <div class="title">
                    <text>可投放在迎宾海报，或大屏幕供宾客扫描查询桌号</text>
                </div>
                <div class="QR">
                    <image :src="QR_url"></image>
                </div>
            </div>
            <div class="saveQR">
                <button plain="true" @click="saveQRimg">保存至相册</button>
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
export default {
    data(){
        return{
            sid:'',
            QR_url:'',
        }
    },
    methods:{
        saveQRimg:function(){
            swan.getImageInfo({
                src: this.QR_url,
                success: (res)=>{
                    // 成功则返回图片高，宽，本地路径
                    let QRurl=res.path
                    swan.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success: (res)=>{
                        // 用户已经同意智能小程序使用定位功能
                            swan.saveImageToPhotosAlbum({
                                'filePath': QRurl,
                                success: (res)=>{
                                    swan.showToast({
                                        title:'保存成功',
                                        icon:'success'
                                    })
                                },
                                fail: function (err) {
                                    console.log('错误码：' + err.errCode);
                                    console.log('错误信息：' + err.errMsg);
                                }
                            });              
                        }
                    });                
                },
                fail: function (err) {
                    console.log('错误码：' + err.errCode);
                    console.log('错误信息：' + err.errMsg);
                }
            });
        },        
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
        this.QR_url=wed_url.dc_url+'GuestsShareImg?sid='+options.sid
    },
}
</script>
<style scoped>
    @import url('./index.css');
</style>
