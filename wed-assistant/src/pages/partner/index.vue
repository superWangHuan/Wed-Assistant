<template>
    <div>
        <div class="container">
    <!--to do-->
            <div class="partner-box">
                <div class="head">
                    <div class="photo">
                        <div class="photo1">
                            <image :src="avatar"/>
                        </div>
                        <div class="connect-icon">
                            <image :src="lianjie_url"/>
                        </div>
                        <div class="photo2">
                            <image :src="partner_photo_url"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="phone">
                <div class="phone-box">
                    <!-- <form @submit="invitation"> -->
                        <!-- 输入框 -->
                        <div class="input-box">
                            <div class="cell-box">

                                <div class="phone-icon">
                                    <text class="iconfont icon-iphone"></text>
                                </div>

                                <div class="input-inner">
                                    <input v-model="mobile" name="mobile" type="number" password="false" placeholder="请输入伴侣的手机号码" placeholder-style="" placeholder-class="placeholder" disabled="false" maxlength="140"/>
                                </div>
                                
                            </div>
                    
                        </div>
                        <!-- 提交按钮 -->
                        <div class="submit-box">
                            <button class="submit-btn" plain @click="invitation">提交</button>
                        </div>
                    <!-- </form> -->

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
export default {
    data(){
        return {
            key: '',
            avatar: "",
            noPartner: true,
            isShow: true,
            sid:'',
            mobile:'',
            lianjie_url:wed_url.img_url+'/wedTools/pic/bindMate/icon_link.png',
            partner_photo_url:wed_url.img_url+'/wedTools/pic/bindMate/icon_plus.png',
        }
    },
    methods:{
        invitation: function (e) {
            // consoel.log(e)
            let mobile = this.mobile;
            let sid=this.sid;
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            if (!reg.test(mobile)) {
                swan.showToast({
                    title: "手机号格式不正确",
                    icon: "none",
                    duration: 1500
                })
                return
            };
            let partner_data = {};
            partner_data.mobile = mobile;
            partner_data.sid = sid;
            partner_data = getSign(partner_data, sid)
            swan.request({
                url: wed_url.z_url + "?s=partner/apply",
                method: "POST",
                dataType: "json",
                header: {
                    "content-type": "application/json"
                },
                data: partner_data,
                success: (res) => {
                    this.sid = res.data.sid
                    swan.showToast({
                        title: res.data.message,
                        icon: 'none',
                    })
                    swan.navigateBack()
                },
                fail: function (err) {
                    console.log(err)
                },
            })
        },
    },
    onLoad(options){
        this.avatar=options.avatar;
        this.sid=options.sid;
    },
}
</script>
<style scoped>
    @import url('./index.css');
</style>
