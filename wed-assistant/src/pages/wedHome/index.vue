<template>
    <div class="container">
        <div class="home">

            <!-- 顶部 -->
            <div class="wed-home-top">
                <div class="home-top">
                    <div class="home-top-inner">
                        <div class="home-top-left">
                            <!-- 头像 -->
                            <div class="head-portrait">
                                <div class="oneself">
                                    <image :src="avatar"></image>
                                </div>
                                <div class="others" @click="navBinding" :data-isAvatar="true">
                                    <img :src="pavatarurl"/>
                                </div>
                            </div>
                            <!-- 名字 -->
                            <div class="head-text">
                                <div class="name"><text>{{account_info.username||'...'}}</text></div>
                                <picker class="time" mode="date" range="[]" value="" @change="delta_t" start="" end="" fields="day">
                                    距婚礼还有<text>{{day}}</text>天
                                    <image :src="edit_icon"/>
                                </picker>
                            </div>
                        </div>
                        <!-- 反馈 -->
                        <div class="home-top-right">
                            <div class="feedback-btn" @click="navfeedback">
                                <image :src="feedback_icon"/>
                                <text>反馈</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 下半部 -->
            <div class="home-bottom">
                <div class="home-list">
                <!-- 第一层 结婚任务 结婚账本-->
                    <div class="list-first">
                        <div class="list-first-box">
                            <div class="list-left">
                                <div class="top" @click="navTask"><text>结婚任务<text class="iconfont icon-right"></text></text></div>
                                <div class="bottom"><text>轻松定制结婚任务</text></div>
                                <div class="list-btn" @click='navtaskAdd' :data-id="''"><text>记任务</text></div>
                            </div>
                            <div class="slicer"></div>
                            <div class="list-right">
                                <div class="top" @click="navRecord"><text>结婚账本<text class="iconfont icon-right"></text></text></div>
                                <div class="bottom"><text>你的最佳婚礼账本</text></div>
                                <div class="list-btn" @click="navAccount" :data-aid="''"><text>去记账</text></div>                        
                            </div>
                        </div>
                    </div>
                <!-- 第二层 图标列表-->
                    <div class="list-second">
                        <div class="list-second-box">
                                <div v-for="(aIcon,icon_sub) in iconList" class="item" :key="icon_sub" :data-url="aIcon.navUrl" :data-appKey="aIcon.appKey" @click="navpages">
                                    <div class="item-inner">
                                        <div class="top"><image :src="aIcon.icon"></image></div>
                                        <div class="middle"><text>{{aIcon.iconName}}</text></div>
                                        <div class="bottom"><text>{{aIcon.iconRef}}</text></div>                              
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="['fixed-btn',!is_show ? 'btn-show':'btn-hidden']">
            <div class="fixed-inner" @click="navBinding"><image :src="bindicon"/>
                <text>{{bindbtn}}</text>
            </div>
        </div>        
    <!-- 邀请通知 -->
        <div :class="[inisShow?'mask':'mask-hidden']" @touchmove.stop="preventTouchMove"></div>
        <div :class="['invitations',inisShow?'login-box':'login-hidden']" @touchmove.stop="preventTouchMove">
            <div></div>
            <div class="inBox">
                <div class="intitle"><text>侣伴邀请</text></div>
                <div class="info-box">
                    <div class="info-avatar">
                        <image :src="inform.avatar"></image>
                    </div>
                    <div class="userinfo">
                        <div class="username"><text>{{inform.username}}</text></div>
                        <div class="intext"><text>亲爱的，我向你发起了情侣账 号绑定邀请，同意后我们就可 以携手准备婚礼啦~</text></div>
                    </div>
                </div>
                <div class="inbtn">
                    <div class="inbtn-box">
                        <div class="btn" @click="reject"><text>拒绝</text></div>
                        <div class="btn" @click="consent"><text>同意</text></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import { getSign } from '../../utils/getData.js';
    import { wed_url } from '../../utils/wed_url.js'
    export default {
        data() {
            return {
                iconList: [{
                    icon: wed_url.img_url+'/wedTools/pic/index/jisuanqi@2x.png',
                    iconName: '结婚预算',
                    iconRef: '百万大数据精准计算',
                    navUrl: '../budgetLists/main',
                    appKey: '',
                },{
                    icon: wed_url.img_url+'/wedTools/pic/index/jiri@2x.png',
                    iconName: '结婚吉日',
                    iconRef: '挑选结婚黄道吉日',
                    navUrl: '',
                    appKey: '',
                },{
                    icon: wed_url.img_url+'/wedTools/pic/index/dengjichu@2x.png',
                    iconName: '结婚登记处',
                    iconRef: '全国婚姻登记查询',
                    navUrl: '',
                    appKey: '717ACUsbxPwrHEf0w9GKYvlH8RxA2DFN',
                },{
                    icon: wed_url.img_url+'/wedTools/pic/index/binke@2x.png',
                    iconName: '我的宾客',
                    iconRef: '安排宾客,规划座位',
                    navUrl: '../myGuests/main',
                },{
                    icon: wed_url.img_url+'/wedTools/pic/index/weixinqiang@2x.png',
                    iconName: '微信婚礼墙',
                    iconRef: '敬请期待',
                    navUrl: '',
                    appKey: '',
                },{
                    icon: wed_url.img_url+'/wedTools/pic/index/qingtie@2x.png',
                    iconName: '电子请帖',
                    iconRef: '专属你的电子请帖',
                    navUrl: '',
                    appKey: '',
                },
                ],
                day: 0,
                avatar: wed_url.img_url+ '/wedTools/pic/index/default.png',
                name: "",
                infos: {},
                is_show: true,
                inisShow: false,
                inform: {},
                pinfos: {},
                pavatarurl: wed_url.img_url+'/wedTools/pic/index/tianjia@2x.png',
                bindbtn: '伴侣',
                bindicon:wed_url.img_url+ '/wedTools/pic/index/fixed_icon.png',
                account_info:{},//账号信息
                sid:'',
                edit_icon:wed_url.img_url+ '/wedTools/pic/index/bianji@2x.png',
                feedback_icon:wed_url.img_url+'/wedTools/pic/index/feedback-icon.png'
            }
        },
        methods:{
            preventTouchMove(e){},
            navTask: function () {
                let sid=this.sid;
                swan.navigateTo({
                    url: '../task/main?sid=' + sid,
                })
            },
            navfeedback:function(){//跳转反馈--
                let sid=this.sid;
                swan.navigateTo({
                    url:'../feedback/main?sid='+sid
                })
            },
            login: function (e) { //登录 --
                let loginData={};
                let sid=this.sid;
                let param;
                loginData.username='中文测试';
                loginData.password='wed114@';
                param = getSign(loginData, sid)
                swan.showLoading({
                    title: "登录中...",
                    fail: function (err) {
                        console.log(err)
                    },
                })
                swan.request({
                    url: wed_url.z_url+'?s=index/loginbpwd',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: param,
                    success: (res) => {
                        console.log('登录',res.data.data);
                        
                        this.sid = res.data.sid;         
                        let msg= res.data.message;
                        let status = res.data.status;
                        // this.avatar='https:'+res.data.data.avatar;
                        this.getWedinfo();//获取个人信息
                        this.hint(msg, status);
                        this.partnerInfo()
                    },
                    fail: function (err) {
                        console.log(err)
                    },
                    complete: () => {
                        
                    }
                })
            },
            baidulogin:function(){//百度登录api
                swan.getUserInfo({
                    success: function (res) {
                        console.log('用户昵称/用户名', res.userInfo);
                    }
                });
                swan.login({
                    success: function (res) {
                        console.log(res.code)
                    }
                });
            },
            hint: function (msg, status) {//提示
                swan.hideLoading()
                swan.showToast({
                    title: msg,
                    icon: "none",
                    duration: 1000,
                })
                if (status === "success") {
                    this.is_show=false;
                } else {
                    this.is_show=true;
                }

            },
            navBinding: function (e) {//跳转到伴侣
                let isAvatar=e.currentTarget.dataset.isAvatar;
                let avatar=this.avatar;
                let str=this.bindbtn;
                let sid=this.sid;
                if(str!=="解绑"){
                    swan.navigateTo({
                        url: "../partner/main?sid=" + sid+"&avatar="+encodeURIComponent(avatar),
                    })            
                }else{
                    if(isAvatar){
                        return
                    }
                    this.decoupling()
                }
            },
            navRecord: function (e) {//--
                let sid = this.sid;
                swan.navigateTo({
                    url: '../wedBook/main?sid=' + sid
                })
            },
            navAccount: function (e) {//导航到记账页面
                let sid=this.sid;
                var aid = e.currentTarget.dataset.aid;
                swan.navigateTo({
                    url: '../accountEdit/main?sid=' + sid + "&aid=" + aid + "&judeg=" + "" + "&cate_id=" + "" + "&pid=" + ""
                })
            },
            delta_t: function (e) { //更改婚期 --
                console.log('更改婚期')
                let infos=this.infos;
                console.log(e)
                let time=e.target.value;
                console.log(time)
                let username=infos.username;
                let realname=infos.realname;
                let sex=infos.sex;
                let birthday=infos.birthday;
                let weday=time;
                let sid=this.sid;
                let param={username,realname,sex,birthday,weday,sid}
                param=getSign(param,sid);
                this.getWedday(time)
                swan.request({
                    url: wed_url.z_url + '?s=user/saveinfo',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: param,
                    success: (res) => {
                        this.sid=res.data.sid
                    }
                })
            },
            getWedday:function(time){//时间计算 --
                console.log('计算距结婚的时间')
                let start_date = (new Date()).valueOf()
                var end_date = (new Date((time))).valueOf();
                var day = Math.ceil((end_date - start_date) / (24 * 60 * 60 * 1000))
                if (day <= 0) {
                    var day = 0
                }
                this.day=day
                console.log(day)
            },
            getWedinfo: function () { //获取个人信息 --
                console.log('获取个人信息')
                let wedData = {
                    has_count: 1,
                }
                let sid=this.sid
                wedData = getSign(wedData, sid);
                swan.request({
                    url: wed_url.z_url+'/?s=user/info',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: wedData,
                    success: (res) => {
                        console.log(res.data)
                        this.account_info=res.data.data;
                        this.sid = res.data.sid;
                        this.avatar='https:'+res.data.data.avatar;
                        let obj=JSON.parse(JSON.stringify(res.data.data))
                        let time=res.data.data.weday;
                        this.getWedday(time)
                        this.infos=obj
                    }
                })
            },
            navtaskAdd: function (e) {
                let sid=this.sid;
                let id = e.currentTarget.dataset.id;
                swan.navigateTo({
                    url: '../taskAdd/main?sid=' + sid + '&id=' + id,
                })
            },
            navpages: function (e) {
                let nav_url = e.currentTarget.dataset.url;
                let appKey=e.currentTarget.dataset.appKey;
                let sid=this.sid;
                if (nav_url === ""&& appKey==="") {
                    swan.showToast({
                        title: '其他小程序',
                        icon: 'none',
                    })
                }else if(nav_url === ""&& appKey!==""){
                    swan.navigateToSmartProgram({
                        appKey, // 要打开的小程序 App Key
                        path: '', // 打开的页面路径，如果为空则打开首页
                        extraData: {
                            sid
                        },
                        success: function (res) {
                            // 打开成功
                        }
                    });
                }else if(nav_url!==""){
                    swan.navigateTo({
                        url: nav_url + "?sid=" + sid + "&username=" + this.name
                    })            
                }
            },
            invitations:function(){//邀请通知
                let sid=this.sid;
                let param={};
                param=getSign(param,sid)
                swan.request({
                    url: wed_url.z_url + '?s=partner/notice',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data:param,
                    success: (res) => {
                        this.sid = res.data.sid;
                        let obj=res.data;
                        this.inform=res.data.data;
                        if(obj.data.uid){
                            this.inisShow=true;
                            this.inform.avatar='https:'+res.data.data.avatar;           
                        }else if(obj.data.length==0){ 
                            this.inisShow=false;                
                        }

                    },
                    complete: () => {},
                })
            },
            consent:function(){//同意
                let sid=this.sid;
                let inform=this.inform;
                let uid=inform.uid;
                let param={uid:uid,sid};
                param=getSign(param,sid)
                swan.request({
                    url: wed_url.z_url + '?s=partner/agree',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data:param,
                    success: (res) => {
                        this.sid = res.data.sid;
                        this.inisShow=false;
                    },
                    complete:()=>{this.partnerInfo()}
                })       
            },
            reject:function(){// 拒绝
                let sid=this.sid;
                let inform=this.inform;
                let uid=inform.uid;
                let param={uid:uid,sid};
                param=getSign(param,sid)
                swan.request({
                    url: wed_url.z_url + '?s=partner/reject',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data:param,
                    success: (res) => {
                        this.sid = res.data.sid;
                        this.inisShow=false;
                    }, 
                    complete:()=>{this.partnerInfo()}
                })          
            },
            partnerInfo:function(){//侣伴信息
                let sid=this.sid;
                let param={};
                param=getSign(param,sid)
                swan.request({
                    url: wed_url.z_url + '?s=partner/info',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data:param,
                    success: (res) => {
                        this.sid = res.data.sid;
                        let obj=res.data;
                        this.pinfos=res.data.data;
                        if(obj.errcode===0){
                            this.bindbtn='解绑';
                            this.bindicon=wed_url.img_url+ '/wedTools/pic/index/jiebindicon.png';
                            this.pavatarurl="https:"+res.data.data.avatar
                        }else{                
                            this.bindbtn='伴侣';
                            this.bindicon=wed_url.img_url+ '/wedTools/pic/index/fixed_icon.png';
                            this.pavatarurl=wed_url.img_url+'/wedTools/pic/index/tianjia@2x.png';
                        }
                    }, 
                })         
            },
            decoupling:function(){//解绑
                let sid=this.sid;
                let pinfos = this.pinfos;
                let uid=pinfos.uid
                let param={uid,sid};
                param=getSign(param,sid)
                swan.showModal({
                    title: '提示',
                    content: '确认解绑侣伴',
                    cancelColor: '#999999',
                    confirmColor: '#0099cc',
                    success: (r)=>{
                        if (r.confirm) {
                            swan.request({
                                url: wed_url.z_url + '?s=partner/unbind',
                                dataType: 'json',
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json'
                                },
                                data:param,
                                success: (res) => {
                                    this.sid = res.data.sid;
                                    this.bindbtn='伴侣';
                                    this.bindicon=wed_url.img_url+ '/wedTools/pic/index/fixed_icon.png'
                                    swan.showToast({
                                        title:res.data.message,
                                        icon:'none',
                                        success:()=>{
                                            this.pavatarurl=wed_url.img_url+'/wedTools/pic/index/tianjia@2x.png'
                                        }
                                    })
                                }, 
                            })                      
                        } else if (res.cancel) {
                            console.log('用户点击了取消');
                        }
                    }
                });

            
            },
            getNotice(){
                setInterval(()=>{this.invitations();this.partnerInfo()},5000);
            }
        },
        onLoad(options){
            if(options.sid){
                this.sid=sid;
            };
            this.login()
        },
        mounted(){
        },
        onShow(){
            this.getNotice()
        }
    }

</script>
<style scoped>
    @import url('./index.css');
</style>
