<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="people-list">
                <div class="list-container">
                    <scroll-view scroll-y :scroll-into-view="showwords" :style="{height:winHeight+'px'}">
                        <div v-for="(aitem,aidx) in allPeopleCopy" :key="aidx" :id="aitem.key">
                            <div class="list-item">
                                <div class="item-letter">
                                    <div class="letter-box">
                                        <text>{{aitem.key}}</text>
                                    </div>
                                </div>
                                <div v-for="(g_name,sub) in aitem.list" :key="sub">
                                    <div class="guests-name" @click="selected" :data-isSel="g_name.isSelected" :data-name="g_name.name" :data-key="aitem.key" :data-sub="sub">
                                        <div class="name-box">
                                            <div class="g-name">
                                                <div class="select-icon"><text :class="[g_name.isSelected?'':'unselected','iconfont icon-gou']"></text></div>
                                                <div class="name"><text>{{g_name.name}}</text></div>
                                            </div>
                                            <div class="desk-num"><text>{{g_name.desk_num==0?'待安排':(g_name.desk_num+'号桌')}}</text></div>
                                        </div>
                                    </div>                    
                                </div>
                            </div>            
                        </div>
                    </scroll-view>
                </div>
            </div>
            <div class="letter-nav" :style="{height:winHeight+'px'}" @touchstart="chStart" @touchend="chEnd" @touchmove="chMove">
                <div v-for="(litem,l_sub) in allPeopleCopy" :key="l_sub">
                    <div class="letter"  @touchstart="getWords" @touchend="setWords" :style="{height:lineHeight+'px'}" :data-key="litem.key"><text :style="{lineHeight:lineHeight+'px'}"  @touchmove.stop="preventTouchMove">{{litem.key}}</text></div>
                </div>
            </div>
            <div class="save-btn">
                <div class="btn" @click="save"><text>导入</text></div>
            </div>
            <div :class="['showwords',hidden?'':'hidden']">
                {{showwords}}
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
import store from '../../store/store'
let lineHeight = 0;
let endWords = "";
let isNum;
export default {
    data(){
        return{
            id: null,
            allPeople: [],
            allPeopleCopy: [],
            lineHeight: 0,
            showwords: "",
            hidden: false,
            sid:'',
            endWords:''
        }
    },
    methods:{
        preventTouchMove:function(e){},
        getPages: function (param) {
            store.commit('setPeople',param)
            swan.navigateBack({})
        },
        save: function () {
            let allPeopleCopy = this.allPeopleCopy;
            let param = [];
            for (let asub in allPeopleCopy) {
                let aitem = allPeopleCopy[asub].list
                for (let isub in aitem) {
                    let litem = aitem[isub];
                    let item = {};
                    if (litem.isSelected) {
                        item.id = litem.id;
                        item.name = litem.name;
                        item.number = litem.number;
                        param.push(item)
                    }
                }
            }
            this.getPages(param)
        },
        selected: function (e) {
            let key = e.currentTarget.dataset.key;
            let name = e.currentTarget.dataset.name;
            let issel = e.currentTarget.dataset.isSel;
            let sub = e.currentTarget.dataset.sub;
            let lists = this.allPeopleCopy;
            for (let asub in lists) {
                let aitem = lists[asub];
                if (key === aitem.key) {
                    let iitem = aitem.list[sub]
                    if (name === iitem.name && !issel) {
                        this.allPeopleCopy[asub].list[sub].isSelected=true;
                    } else if (name === iitem.name && issel) {
                        this.allPeopleCopy[asub].list[sub].isSelected=false;
                    }
                }
            }
        },
        getallPeopleCopy: function () {
            let sid=this.sid;
            let id=this.id;
            let param={id,sid};
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "GuestsLists.html",
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: param,
                success: (res) => {
                    this.sid=res.data.sid;
                    let allPeopleCopy = JSON.parse(JSON.stringify(res.data.data));
                    for (let aidx in allPeopleCopy) {
                        for (let i in allPeopleCopy[aidx].list) {
                            allPeopleCopy[aidx].list[i].isSelected = false;
                        }
                    }
                    this.allPeople=res.data.data;
                    this.allPeopleCopy=allPeopleCopy;
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: () => {
                    this.eleHeight()
                },
            })
        },
        eleHeight: function () { //设置元素高度
            let allPeopleCopy = this.allPeopleCopy;
            let len = allPeopleCopy.length;
            swan.getSystemInfo({
                success: (res) => {
                    lineHeight = (res.windowHeight - 40) / 26;
                    this.windowHeight=res.windowHeight - 40;
                    this.lineHeight=lineHeight;
                }
            })
        },
        chStart: function () {
            this.hidden=true;
        },
        chEnd: function () {
            this.hidden=false;
        },
        getWords: function (e) {
            var key = e.currentTarget.dataset.key;
            endWords = key;
            isNum = key;
            this.showwords=key;
        },
        setWords: function (e) {
            this.showwords=endWords;
        },
        chMove: function (e) {//移动是获取key
            let y = e.touches[0].clientY;
            let offsettop = e.currentTarget.offsetTop;
            let height = 0;
            let allPeopleCopy = this.allPeopleCopy;
            swan.getSystemInfo({
                success:(res)=>{
                    height = res.windowHeight - 10
                    if (y > offsettop && y < height) {
                        let num = parseInt((y - offsettop) / lineHeight);
                        if(!allPeopleCopy[num]){return}
                        endWords = allPeopleCopy[num].key;
                        this.endWords = endWords;
                        if (isNum != num) {
                            isNum = num;
                            this.showwords=this.endWords;
                            swan.vibrateShort({})
                        }

                    }
                }
            })
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
        this.id=options.id;
    },
    mounted: function () {
        // 监听页面初次渲染完成的生命周期函数
        this.getallPeopleCopy()
    },
    onUnload(){
        this.id= null;
        this.allPeople= [];
        this.allPeopleCopy= [];
        this.lineHeight= 0;
        this.showwords= "";
        this.hidden= false;
        this.sid='';
        this.endWords=''        
    }
}
</script>
<style scoped>
@import url('./index.css');
</style>
