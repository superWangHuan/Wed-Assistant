<template>
    <div>
        <div class="container" v-if="peopleLists">
            <!--to do-->
            <scroll-view class="edit_row_holder" :scroll-y="issroll" @scroll="bindscroll">
                <!-- 移动滑块监听 -->
                <!-- 移动滑块 -->
                <div :class="[m_isShow?'hidden':'']" :style="{height:scrollPosition.everyOptionCell + 'px' , width:'100%', position :'fixed',top:movabledivPosition.y+'px',left:'0px',zIndex :'200',transition:'all 0.1s'}"  v-if="deskPeople.people">
                    <div class="guests-item" style="background:rgba(236, 78, 78,.8);">
                        <div class="serial-num">
                            <text>{{(deskPeople.sort>9?'':'0')+(deskPeople.sort)}}</text>
                        </div>
                        <div class="guests-detail">
                            <div class="table-num">
                                    <text>{{deskPeople.sort}}号桌{{deskPeople.name!==""?'('+deskPeople.name+')':''}}</text>
                            </div>
                            <div class="peoples">
                                <div class="peoples-box">
                                    <div v-for="(people,p_sub) in deskPeople.people" :key="p_sub">
                                        <div class="people">
                                            <text :class="[people.redfont?'red-font':'']">{{people.name}}</text>
                                        </div>
                                    </div>
                                    <div :class="['people',deskPeople.people.length>0 ? 'hidden':'']">
                                        <text>暂未安排宾客</text>
                                    </div>
                                </div>
                            </div>
                            <div class="people-num">
                                <div class="navbtn">
                                    <text class="num-text">{{deskPeople.real_number}}</text>/<text>{{deskPeople.number}}</text><text>去安排</text><text>></text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>        
                <div class="my-guests">
                    <div class="guests-box">
                        <!-- item -->
                        <div class="guests-item-box" v-for="(peopleItem,people_idx) in peopleListsCopy.lists"  :key="people_idx">
                            <div :class="[selectIndex==people_idx&&!m_isShow?'hidden':'guests-item']" @touchstart="touchStart" @touchmove="draggleTouch" @touchend="draggleTouch" :data-id="peopleItem.id" @click="navAddTable" :data-sort="peopleItem.sort">
                                <div class="serial-num">
                                    <text>{{(peopleItem.sort>9?'':'0')+(peopleItem.sort)}}</text>
                                </div>
                                <div class="guests-detail">
                                    <div class="table-num">
                                        <text>{{peopleItem.sort}}号桌{{peopleItem.name!==""?'('+peopleItem.name+')':''}}</text>
                                    </div>
                                    <div class="peoples">
                                        <div class="peoples-box">
                                            <!-- people -->
                                            <div v-for="(people,pe_sub) in peopleItem.people" :key="pe_sub">
                                                <div class="people">
                                                    <text :class="[people.redfont?'red-font':'']">{{people.name}}</text>
                                                </div>
                                            </div>
                                            <div :class="['people',peopleItem.people.length>0 ? 'hidden':'']">
                                                <text>暂未安排宾客</text>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="people-num">
                                        <div class="navbtn">
                                            <text class="num-text">{{peopleItem.real_number}}</text>/<text>{{peopleItem.number}}</text><text>去安排</text><text>></text>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div :class="[selectIndex==people_idx&&!m_isShow?'m-style':'guests-items']"></div>
                        </div>
                        <div class="last-guests-item" @click="navWaitingArrangement"
                            v-if="peopleListsCopy.pending.length>0||wait_show">
                            <div class="guests-detail">
                                <div class="table-num">
                                    <text>待安排</text>
                                </div>
                                <div class="peoples">
                                    <div class="peoples-box">
                                        <div v-for="(nopeople,no_sub) in peopleListsCopy.pending" :key="no_sub">
                                            <div class="people">
                                                <text :class="[nopeople.redfont?'red-font':'']">{{nopeople.name}}</text>
                                            </div>
                                        </div>
                                        <div :class="['people',peopleListsCopy.pending.length>0 ? 'hidden':'']">
                                            <text>暂无宾客</text>
                                        </div>
                                    </div>
                                </div>

                                <div class="people-num">
                                    <div class="navbtn"><text>去添加</text><text class="iconfont icon-right"></text></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>

            <!-- 底部的按钮 -->
            <div class="guests-bottom">
                <div class="small-btn">
                    <div class="search" data-isShow="show" @click="searchShow"><text class="iconfont icon-search"></text><text
                            class="btn-name">搜索</text></div>
                    <div class="tianjia" @click="addTable"><text class="iconfont icon-tianjia"></text><text
                            class="btn-name">加桌</text></div>
                    <div class="iconset" @click="navpredivPage"><text class="iconfont icon-eye"></text><text
                            class="btn-name">预览</text></div>
                    <div class="img-btn">
                        <image :src="qr_img" @click="navQR"></image><text class="btn-name">查桌</text>
                    </div>
                </div>
                <div class="big-btn" @click="share"><text>发送至宾客</text></div>
            </div>
            <div :class="['search-input',isShow ?'input-show':'input-hidden']" @touchmove.stop="preventTouchMove">
                <div class="input-box">
                    <div class="icon">
                        <text class="iconfont icon-ico_search"></text>
                    </div>
                    <div class="input">
                        <input value="" @input="searchPeople" type="text" placeholder="请输入宾客姓名"
                            placeholder-class="placeholder" maxlength="20" />
                    </div>

                </div>
            </div>
            <div :class="['mask',!isShow?'hidden':'']" @click="searchShow" data-isShow="hidden" @touchmove.stop="preventTouchMove">
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
let timeOutEvent = 0;
let longtime;
let timeOut = 0;
// let istouch = false;
export default {
    data(){
        return{
            peopleLists: null,
            peopleListsCopy: {},
            isShow: false,
            wait_show: true,
            m_isShow: true,
            deskPeople: {},
            selectIndex: 0,
            issroll:true,//是否允许scroll-view可滑动
            movabledivPosition: {
                x: 0,
                y: 0,
                className: "none",
                data: {}
            },
            scrollPosition: {
                everyOptionCell: 170,
                top: 0,
                scrollTop: 0,
                scrollY: true,
                scrolldivHeight: 1000,
                scrolldivWidth: 375,
                windowdivHeight: 1000,
            },
            selectItemInfo: {
                sName: "",
                sDtSecCode: "",
                sCode: "",
                selectIndex: -1,
                selectPosition: 0,
            },
            sid:'',
            name:'',
            istouch:false,
            qr_img:wed_url.img_url+'/wedTools/pic/myGuest/erweima@2x.png',
            offsetTop:0,
        }
    },
    methods:{
        share: function () {//分享
            let name = this.name;
            let sid=this.sid;
            swan.openShare({
                title: name + '的婚礼座位安排',
                content: '免费婚礼助手',
                path: 'pages/predivPage/main?sid=' + sid,
            });
        },
        navpredivPage: function () {
            let sid=this.sid;
            swan.navigateTo({
                url: '../predivPage/main?sid=' + sid
            })
        },
        navQR: function () {
            let sid=this.sid;
            swan.navigateTo({
                url: '../guestsQRCode/main?sid=' + sid
            })
        },
        navWaitingArrangement: function () {//导航到未安排宾客
            let sid=this.sid;
            swan.navigateTo({
                url: '../waitingArrangement/main?sid=' + sid
            })
        },
        navAddTable: function (e) {
            // timeOutEvent = 0;
            let sid=this.sid;
            let sort=e.currentTarget.dataset.sort;
            let id = e.currentTarget.dataset.id
            swan.navigateTo({
                url: '../addTable/main?sid=' + sid + '&id=' + id + "&sort=" + sort
            })
        },
        preventTouchMove: function (e) {},
        searchShow: function (e) {//isShow切换
            var str = e.currentTarget.dataset.isShow;
            if (str === 'show') {
                this.isShow=true;
            } else if (str === 'hidden') {
                this.isShow=false;
            }
        },
        addTable: function () {//添加桌子
            let sid=this.sid;
            let param = {
                sid
            };
            param = getSign(param, sid)
            swan.request({
                url: wed_url.dc_url + 'GuestsAddDesk',
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: param,
                success: (res) => {
                    this.sid = res.data.sid;
                    this.peopleLists = res.data.data;
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: () => {
                    this.guestsDeskLists()
                }
            })
        },
        guestsDeskLists: function () {//获取宾客数据
            let sid=this.sid;
            let param = {
                sid
            };
            param = getSign(param, sid)
            swan.request({
                url: wed_url.dc_url + 'GuestsDeskLists',
                dataType: 'json',
                method: 'GET',
                header: {
                    'content-type': 'application/json'
                },
                data: param,
                success: (res) => {
                    this.sid = res.data.sid;
                    let obj = res.data.data;
                    let objCopy = JSON.parse(JSON.stringify(obj))
                    this.peopleLists=obj;
                    this.peopleListsCopy=objCopy;
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        },
        myTrim: function (x) {//去掉两边空格
            return x.replace(/^\s+|\s+$/gm, '');
        },
        searchPeople: function (e) { //搜索宾客
            let search_str = e.mp.detail.value;
            let sid=this.sid;
            let search = this.myTrim(search_str)
            let regexp = null;
            if (search_str !== "") {
                regexp = new RegExp(search_str, 'i')
            }
            let searchLists = [];
            let searchPending = [];
            let peopleListsCopy = this.peopleListsCopy;
            if (search_str !== "") {
                this.wait_show=false;
                for (let key in peopleListsCopy) {
                    if (key === "lists") {
                        let lists = peopleListsCopy.lists;
                        for (let l in lists) {
                            let people = lists[l].people;
                            let judeg = people.find(function (val, i, arr) {
                                let name = val.name;
                                return regexp.test(name) === true
                            })
                            if (judeg !== undefined) {
                                searchLists.push(lists[l])
                            }
                            for (let p in people) {
                                let name = people[p].name;
                                if (regexp.test(name)) {
                                    this.peopleListsCopy.lists[l].people[p].redfont=true;
                                } else {
                                    this.peopleListsCopy.lists[l].people[p].redfont=false;
                                }
                            }
                        }
                    } else if (key === "pending") {
                        let pending = peopleListsCopy.pending;
                        let judeg = pending.find(function (val, i, arr) {
                            let name = val.name;
                            return regexp.test(name) === true
                        })
                        if (judeg !== undefined) {
                            searchPending = pending
                        }
                        for (let pensub in pending) {
                            let name = pending[pensub].name;
                            if (regexp.test(name)) {
                                this.peopleListsCopy.pending[pensub].redfont=true;
                            } else {
                                this.peopleListsCopy.pending[pensub].redfont=false;
                            }
                        }
                    }
                };
                this.peopleListsCopy.pending=searchPending;
                this.peopleListsCopy.lists=searchLists;
            } else {
                let obj = this.peopleLists
                let newObj = JSON.parse(JSON.stringify(obj))
                this.peopleListsCopy = newObj;
                this.wait_show = true;
            }

        },
        //排序
        bindscroll: function (event) {
            var scrollTop = event.mp.detail.scrollTop; //滚动的距离
            this.scrollPosition.scrollTop=scrollTop;
        },
        draggleTouch: function (event) { //判断点击事件的类型
            var touchType = event.type;
            switch (touchType) {
                case "touchmove":
                    this.touchMove(event);
                    break;
                case "touchend":
                    this.touchEnd(event);
                    break;
            }
        },
        touchStart: function (e) {//开始点击
            clearTimeout(timeOutEvent);//清除定时器
            timeOutEvent = setTimeout(()=>{
            //执行长按要执行的内容，
                this.istouch=true;
                this.issroll=false;
                let scrollPosition = this.scrollPosition;
                let scrollTop = scrollPosition.scrollTop;
                let pageY = e.clientY - (scrollPosition.everyOptionCell / 2);
                if (pageY <= 0) {
                    pageY = 15
                }
                let sub = Math.ceil((scrollTop + pageY + 30) / (scrollPosition.everyOptionCell)) - 1; //获取数据的下标
                let deskPeople = this.peopleListsCopy.lists[sub]; //获取当前移动的数据
                if (!deskPeople.id) {
                    this.m_isShow=true;
                    return
                }
                this.deskPeople=deskPeople;
                this.movabledivPosition.y=pageY;
                this.selectItemInfo.selectPosition=pageY;//长按获取当前位置
                this.selectIndex=sub;
                this.m_isShow=false;
            },600);//这里设置定时
        },
        touchMove: function (e) { //移动中
            let istouch=this.istouch;
            if (!istouch) {//判断是否是长按
                clearTimeout(timeOutEvent);
                return
            };
            let cutTop=170;
            let moveArr=[];
            let scrollPosition = this.scrollPosition;
            let moveDistance = e.clientY;
            let pageY = moveDistance - scrollPosition.everyOptionCell / 2;
            let selectPosition = this.selectItemInfo.selectPosition;
            let peopleLists = this.peopleListsCopy.lists;
            let deskPeople = this.deskPeople;
            if (!deskPeople.id) {
                this.m_isShow=true;
                return
            }
            let selectIndex = this.selectIndex;
            let indexCopy=selectIndex;
            let everyOptionCell = this.scrollPosition.everyOptionCell;
            if (selectIndex == peopleLists.length) {
                return
            }
            if (Math.abs(moveDistance - selectPosition) < everyOptionCell / 2 ) {
                return
            }
            if (moveDistance - selectPosition > cutTop && selectIndex < peopleLists.length - 1) {
                if (peopleLists[selectIndex].id == deskPeople.id) {
                    this.exchange(peopleLists,selectIndex,++selectIndex)
                    selectPosition += everyOptionCell;
                }
            } else if (moveDistance - selectPosition < -cutTop && selectIndex > 0) {
                if (peopleLists[selectIndex].id == deskPeople.id) {
                    this.exchange(peopleLists,selectIndex,--selectIndex);
                    selectPosition -= everyOptionCell;
                }
            }
            this.selectIndex=selectIndex;
            this.movabledivPosition.y=pageY;
            this.selectItemInfo.selectPosition=selectPosition;
            if(selectIndex!=indexCopy){ return }
            this.peopleListsCopy.lists=peopleLists;
            this.m_isShow=false;

        },
        touchEnd: function (e) { //移动结束
            let istouch=this.istouch;
            if (!istouch) {
                clearTimeout(timeOutEvent);
                return
            }
            if(timeOutEvent!=0){
                //这里写要执行的内容（尤如onclick事件）
                let deskPeople = this.deskPeople;
                let sid=this.sid;
                this.m_isShow=true;
                if (!deskPeople.id) {
                    return
                }
                let param = {
                    sid,
                    id: []
                };
                let arr = [];
                let peopleLists = this.peopleListsCopy.lists;
                for (let i in peopleLists) {
                    arr.push(peopleLists[i].id);
                }
                param.id = arr;
                param = getSign(param, sid)
                swan.request({
                    url: wed_url.dc_url + 'GuestsDeskSort',
                    dataType: 'json',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json'
                    },
                    data: param,
                    success: (res) => {
                        this.sid = res.data.sid;
                        this.guestsDeskLists()
                        timeOut = 0
                    },
                    fail: function (err) {
                        console.log(err)
                    }
                })
                this.istouch = false;
                this.issroll=true;
            }
            clearTimeout(timeOutEvent)
            timeOutEvent = 0;
        },
        exchange:function(arr,current_sub,next_sub) {
            let c = arr[current_sub];
            arr[current_sub] = arr[next_sub];
            arr[next_sub] = c;
        },


    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        
        this.sid = options.sid;
        this.name=options.username;
        let systemInfo = swan.getSystemInfoSync();//获取系统屏幕的尺寸
        console.log(systemInfo)
        let scrolldivHeight = systemInfo.windowHeight - 50;
        let scrolldivWidth = systemInfo.windowWidth;
        this.scrollPosition.scrolldivWidth=scrolldivWidth;
        this.scrollPosition.scrolldivHeight=scrolldivHeight;
        this.scrollPosition.windowdivHeight=systemInfo.windowHeight;
    },
    mounted:function(){
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        // istouch = false;
        this.guestsDeskLists()
    },
    onUnload(){
            this.peopleLists= null;
            this.peopleListsCopy= [];
            this.isShow= false;
            this.wait_show= true;
            this.m_isShow= true;
            this.deskPeople= {};
            this.selectIndex= 0;
            // this.issrot=false;
            this.issroll=true;//是否允许scroll-view可滑动
            this.movabledivPosition= {
                x: 0,
                y: 0,
                className: "none",
                data: {}
            };
            this.scrollPosition= {
                everyOptionCell: 170,
                top: 0,
                scrollTop: 0,
                scrollY: true,
                scrolldivHeight: 1000,
                scrolldivWidth: 375,
                windowdivHeight: 1000,
            };
            this.selectItemInfo= {
                sName: "",
                sDtSecCode: "",
                sCode: "",
                selectIndex: -1,
                selectPosition: 0,
            };
            this.sid='';
            this.name='';
            this.istouch=false        
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
