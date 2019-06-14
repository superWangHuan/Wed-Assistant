<template>
    <div v-if="accountList[0]">
        <div class="container">
            <!--to do-->
            <div class="account-box">
                <div class="cut-module" v-if="!deleteBtn">
                    <div class="module-btn">
                        <div v-for="(btn_title,idx) in accountList" :key="idx" :class="['expend',opt == idx ? 'btn-active' : '']" :data-opt="idx" @click="accountCut"><text>{{btn_title.name}}</text></div>
                    </div>
                </div>

                <!-- 结婚支出 -->
                <div :class="['a-show',isShow?'':'hidden']">
                    <div class="account-title">
                        <div class="title-list">
                            <div v-for="(title,tidx) in accountList[0]._child" :key="tidx" :class="['title-item', pid==title.id ? 't-active':'']" @click="tActive" :data-sub="tidx" :data-cid="title.id">
                                <text>{{title.name}}</text>
                            </div>       
                        </div>
                    </div>
                    <div class="r-contents">
                        <!-- <form @submit="SubmitRecord"> -->
                        <!-- 金额输入 -->
                            <div class="account-price">
                                <div class="a-icon"><image :src="navIconUrl||(accountList[0]._child[sub]._child.length>0?accountList[0]._child[sub]._child[optSub].icon:accountList[0]._child[sub].icon)"></image><text>{{accountList[0]._child[sub].name}}</text></div>
                                <div class="a-input">
                                    <text>￥</text>
                                    <input v-model="exprice" type="number" name="price" placeholder="请输入金额" placeholder-class="a-placeholder" maxlength="140"/>
                                </div>
                            </div>
                            <!-- 支出类型选择 -->
                            <div class="options" v-if="accountList[0]._child[sub]._child.length>0">
                                <swiper class="options-box" indicator-dots vertical="false" current="0" interval="5000" duration="500">
                                    <div v-for="(page_item,i) in pages" :key="i">
                                        <swiper-item>
                                            <div class="a-option">
                                                <div v-for="(opt,opt_sub) in accountList[0]._child[sub]._child" :key="opt_sub">
                                                    <div :class="['opt-btn', cate_id==opt.id?'opt-active':'']" :data-optSub="opt_sub" :data-cid="opt.id" v-if="(opt_sub>=i*8)&&(opt_sub<(i+1)*8)" @click="optActive"><text>{{opt.name}}</text></div>
                                                </div>
                                            </div>
                                        </swiper-item>                                
                                    </div>
                                </swiper>                    
                            </div>
                            <div class="a-time">
                                <div class="time-icon">
                                    <text class="iconfont icon-rili"></text>
                                </div>
                                <div class="time-opt"><picker mode="date" @change="getDate">{{time}}</picker></div>
                            </div>
                            <div class="a-time">
                                <div class="time-icon">
                                    <text class="iconfont icon-iconfontzhizuobiaozhun0264"></text>
                                </div>
                                <div class="time-opt">
                                    <input v-model="remark" type="text" name="remark" placeholder="添加备注" placeholder-class="a-placeholder" maxlength="140"/>
                                </div>
                            </div>


                            <div class="up-photo">
                                <div class="up-icon"><text class="iconfont icon-xiangji"></text></div>
                                    <div class="up-images">
                                        <div v-for="(filePath,iSub) in filePaths" :key="iSub">
                                            <div class="up-list"><div class="del-icon" :data-iSub="iSub" @click="deleteImg"><div></div></div><image :src="filePath"></image></div>
                                        </div> 
                                        <div class="up-btn" @click="upImage"><image :src="add_img"></image></div>  
                                    </div>                      
                                </div>
                            <div class="submit-btn"><button plain="true" @click="SubmitRecord">保存</button></div>
                        <!-- </form> -->
                    </div>   
                    <div class="a-time" v-if="deleteBtn">
                        <div class="time-icon"><text class="iconfont icon-shanchu"></text></div>
                        <div class="time-opt" @click="deleteaccount">
                            <div class="delete">删除账目</div>
                        </div>
                    </div>                 
                </div>

                <!-- 礼金收入 -->
                <div :class="['cash-gift', isShow?'hidden':'']">
                    <!-- <form @submit="submitIncome"> -->
                        <div class="cash-box">
                            <div class="income-name">
                                <div class="guest-icon"><image :src="account_img"></image></div>
                                <input v-model="name" type="text" name="name" placeholder="宾客姓名" placeholder-class="g-placeholder" maxlength="140"/>
                            </div>
                            <div class="money">
                                <text>￥</text>
                                <input v-model="exprice" type="number" name="price" placeholder="请输入金额" placeholder-class="m-placeholder" maxlength="140"/>
                            </div>
                        </div>
                        <div class="a-time">
                            <div class="time-icon">
                                <text class="iconfont icon-rili"></text>
                            </div>
                            <div class="time-opt"><picker mode="date" @change="getDate">{{time}}</picker></div>
                        </div>
                        <div class="a-time">
                            <div class="time-icon">
                                <text class="iconfont icon-iconfontzhizuobiaozhun0264"></text>
                            </div>
                            <div class="time-opt">
                                <input v-model="remark" type="text" name="remark" placeholder="添加备注" placeholder-class="a-placeholder" maxlength="140"/>
                            </div>
                        </div> 
                        <div class="submit-btn"><button plain="true" @click="submitIncome">保存</button></div>               
                    <!-- </form> -->
                    <div class="a-time"  v-if="deleteBtn">
                        <div class="time-icon"><text class="iconfont icon-shanchu"></text></div>
                        <div class="time-opt"  @click="deleteaccount">
                            <div class="delete">删除账目</div>
                        </div>
                    </div>               
                </div>

            </div>
            <div class="pull-box"></div>
        </div>
    </div>
</template>
<script>
    import { getSign } from '../../utils/getData.js';
    import { wed_url } from '../../utils/wed_url.js'
var a=0;
var filePaths;
export default {
    data(){
        return{
            opt: 0,
            accountList: [],
            sub: 0,
            optSub: 0,
            time: "",
            isShow: true,
            len: [],
            pages: [],
            accountIcon: "",
            filePaths: [],
            aid: "",
            cate_id: "",
            deleteBtn: false,
            judeg: null,
            pid: null,
            exprice: "",
            remark: "",
            navIconUrl: "",
            name: "",
            sid:"",
            account_img:wed_url.img_url+'/wedTools/pic/book/b-lijin@2x.png',
            add_img:wed_url.img_url+'/wedTools/pic/book/add_img.png',
        }
    },
    methods:{
        //删除记录
        deleteaccount: function () {
            swan.showLoading({
                title: '删除中...',
            })
            let sid=this.sid;
            let id = this.aid;
            let param={sid,id};
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "RecordDelete",
                dateType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data:param,
                success: (res) => {
                    this.sid=res.data.sid
                    swan.hideLoading({
                        success: () => {
                            swan.showToast({
                                title: '删除成功',
                                icon: 'none',
                                duration: 1000,
                            })

                        }
                    })
                },
                complete: function () {
                    swan.navigateBack()
                }
            })
        },
        // 图片上传
        upImage: function () {
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            let status = "";
            filePaths=this.filePaths;
            swan.chooseImage({
                count: 1,
                success: (res) => {
                    console.log('chooseImage',res)
                    swan.showLoading({
                        title: "上传中...",
                    })
                    
                    swan.uploadFile({
                        url: wed_url.dc_url + 'UploadFile',
                        filePath: res.tempFilePaths[0], // 要上传文件资源的路径
                        name: 'file',
                        formData:param,
                        success: (res) => {
                            this.sid=res.data.sid;
                            let urlData = res.data;
                            status = urlData.status
                            let url = urlData.data.url;
                            filePaths.push(url)
                            this.filePaths=filePaths;
                        },
                        fail: function (err) {
                            console.log('错误码：' + err.errCode);
                            console.log('错误信息：' + err.errMsg);
                        },
                        complete: function () {
                            swan.hideLoading({
                                success: function () {
                                    if (status == "success") {
                                        swan.showToast({
                                            title: "上传成功",
                                            icon: 'none',
                                            duration: 1500
                                        })
                                    } else if (status == "fail") {
                                        swan.showToast({
                                            title: "上传失败",
                                            icon: 'none',
                                            duration: 1500
                                        })
                                    }
                                }
                            })
                        }
                    });
                }
            });
        },
        //收入记录
        submitIncome: function (e) {
            let sid=this.sid;
            let id = this.aid;
            let name = this.name;
            let price = this.exprice;
            let time = this.time;
            let remark = this.remark;
            let errorcode;
            if (name == "") {
                swan.showToast({
                    title: '请填写宾客姓名',
                    icon: 'none',
                })
                return
            } else if (price == "") {
                swan.showToast({
                    title: '请填写礼金收入',
                    icon: 'none',
                })
                return
            }
            let param = {
                sid,
                id,
                name,
                price,
                time,
                remark
            }
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "RecordInSave",
                dataType: "json",
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: param,
                success: (res)=>{
                    this.sid=res.data.sid;
                    errorcode=res.data.errcode
                },
                fail: function (err) {
                },
                complete: function () {
                    if(errorcode==0){
                        swan.showToast({
                            title:'保存成功',
                            icon:'success'
                        })
                    }else{
                        swan.showToast({
                            title:'保存失败',
                            icon:'none'
                        })                        
                    }
                    swan.navigateBack()
                }
            })
        },
        //花费记录提交
        SubmitRecord: function (e) {
            let sid=this.sid;
            let id = this.aid;
            let cate_id = this.cate_id;
            let price = this.exprice;
            let remark = this.remark;
            let photo = this.filePaths;
            let time = this.time;
            let msg = ""
            if (price === "") {
                msg = "金额不能为空"
                swan.showToast({
                    title: msg,
                    icon: "none",
                    duration: 1000,
                })
                return
            }
            swan.showLoading({
                title: "提交中..."
            })
            let submitData = {
                sid,
                id,
                cate_id,
                remark,
                price,
                photo,
                time
            };
            submitData=getSign(submitData,sid)
            swan.request({
                url: wed_url.dc_url + "RecordOutSave",
                dataType: "json",
                method: "POST",
                header: {
                    'content-type': 'application/json'
                },
                data: submitData,
                success: (res) => {
                    this.sid=res.data.sid;
                    if (res.data.status == "success") {
                        msg = "保持成功"
                    } else {
                        msg = "保存失败"
                    }
                    swan.hideLoading({
                        success: () => {
                            swan.showToast({
                                title: msg,
                                icon: "none",
                                duration: 1000,
                            })
                        }
                    })
                },
                fail: function () {},
                complete: function () {
                    swan.navigateBack()
                },
            })
        },
        deleteImg: function (e) { //删除图片
          let iSub = e.currentTarget.dataset.iSub;
          let filePaths = this.filePaths;
            filePaths.splice(iSub, 1)
            this.filePaths=filePaths
        },
        getOptions: function () { //获取子分类
            swan.showLoading({
                title:'加载中...'
            })            
            let sid=this.sid;
            let param={sid};
            let pid;
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "RecordCategory",
                dataType: "json",
                method: "GET",
                header: {
                    "content-type": "application/json"
                },
                data:param,
                success: (res) => {
                    this.sid=res.data.sid
                    let aid = this.aid;
                    if (aid === '') {
                        pid = res.data.data[0]._child[0].id;
                        this.pid=pid;
                        this.cate_id=pid;
                    }
                    this.accountList=res.data.data;
                    swan.hideLoading()
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: () => {
                    this.tActive()
                }
            })
        },
        accountCut: function (e) { //顶部切换显示按钮
            let opt = e.currentTarget.dataset.opt;
            this.opt=opt;
            opt = this.opt;
            if (opt == 0) {
                this.isShow=true;
            } else if (opt == 1) {
                this.isShow=false;
            }
        },
        tActive: function (e) { //父类型按钮
            let idx = 0;
            let sub = 0;
            let pid = "";
            let cid = "";
            let opts;
            let cate_id = this.cate_id;
            let aid = this.aid;
            
            let alists = this.accountList[0]._child;
            if (aid !== "") {
              pid = this.pid;
                for (var i in alists) {
                    if (alists[i].id == pid) {
                        idx = i
                    }
                }
                sub = idx
                if (a === 1) {
                    pid = e.currentTarget.dataset.cid;
                    sub = e.currentTarget.dataset.sub;
                }
                a = 1
            }else if(e){
                pid = e.currentTarget.dataset.cid;
                sub = e.currentTarget.dataset.sub;
            }else{
                pid=this.accountList[0]._child[0].id;
                sub=0;
            };
            opts = this.accountList[0]._child[sub]._child;
            if (opts.length > 0) {
                cid = this.accountList[0]._child[sub]._child[0].id;
            } else if(e){
                cid = e.currentTarget.dataset.cid;
            }
            let pageNum = Math.ceil(opts.length / 8);
            let pages = [];
            for (var i = 0; i < pageNum; i++) {
                pages[i] = i
            }
            this.sub=sub;
            this.pages=pages;
            this.pid=pid;
            this.cate_id=cid;
            if (aid == "" && a === 0) {
                this.cate_id=cid;
            } else {
                this.cate_id=cate_id;
            }
        },
        optActive: function (e) { //子类型按钮
            let optSub = e.currentTarget.dataset.optSub;
            let cid = e.currentTarget.dataset.cid;
            this.optSub=optSub;
            this.cate_id=cid;
            this.navIconUrl="";
        },
        initDate: function () { //初始化时间
            let time = new Date().toLocaleDateString().replace(/[/]/g, "-");
            this.time=time;
        },
        getDate: function (e) { //记录时间的获取
            let time = e.mp.detail.value;
            this.time=time;
        },
        getDataDetail: function () { //获取详情
            let id = this.aid;
            let sid = this.sid;
            let param={id,sid};
            param=getSign(param,sid);
            if (id == "") {
                return
            }
            swan.request({
                url: wed_url.dc_url + "RecordInfo",
                dataType: "json",
                header: {
                    'content-type': 'application/json'
                },
                method: "GET",
                data: param,
                success: (res) => {
                    let obj = res.data.data
                    this.sid=res.data.sid
                    filePaths = obj.photo;
                    if (obj.cate_data) {
                        this.navIconUrl= obj.cate_data.icon
                    }
                    this.time=obj.time;
                    this.exprice=obj.price;
                    this.remark=obj.remark;
                    this.name=obj.name;
                    this.filePaths=obj.photo;
                    this.cate_id=obj.cate_id;
                    this.pid= obj.cate_pid
                    this.getOptions()
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: () => {}
            })
        },        
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        let judeg = options.judeg;
        let aid=options.aid;
        this.sid=options.sid;
        this.aid = aid;
        this.judeg=judeg;
        if (judeg == 0) {
            this.isShow=true;
            this.opt=0;
        } else if (judeg == 1) {
            this.isShow=false;
            this.opt=1;
        }
        if (aid === '') {
            this.deleteBtn=false;
        } else {
            this.deleteBtn=true;
        }
        a = 0
    },
    mounted(){
        this.getDataDetail()
        this.initDate()
        let aid = this.aid
        if (aid == "") {
            this.getOptions()
        }
    },
    onUnload(){
        a = 0;
        this.opt= 0;
        this.accountList= [];
        this.sub= 0;
        this.optSub= 0;
        this.time= "";
        this.isShow= true;
        this.len= [];
        this.pages= [];
        this.accountIcon= "";
        this.filePaths= [];
        this.aid= "";
        this.cate_id= "";
        this.deleteBtn= false;
        this.judeg= null;
        this.pid= null;
        this.exprice= "";
        this.remark= "";
        this.navIconUrl= "";
        this.name= "";
        this.sid="";
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
