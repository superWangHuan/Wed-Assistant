<template>
    <div>
        <div class="container" v-if="deskInfos.number">
            <!--to do-->
            <div class="addTable">
                <div class="addTable-top">
                    <div class="table-name-box">
                        <div class="table-name">
                            <div class="title"><text>餐桌备注</text></div>
                            <div class="title-input">
                                <input v-model="deskName" type="text" password="false" placeholder="如：男方同学" placeholder-style="" placeholder-class="placeholder"/>
                            </div>
                        </div>            
                    </div>

                    <div class="table-num">
                        <div class="title"><text>桌位总数</text></div>
                        <div class="num-btn-box">
                            <div class="num-btn">
                                <div class="jian" data-seating="num_minus" @click="takeAlongNumber"><text class="iconfont icon-jianhao"></text></div>
                                <div class="number"><text>{{deskInfos.number}}</text></div>
                                <div class="jia" data-seating="num_plus" @click="takeAlongNumber"><text class="iconfont icon-jiahao"></text></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cut-off"></div>
                <div class="addTable-bottom">
                    <div class="addTable-bottom-box">
                        <div class="bottom-header">
                            <div class="bottom-header-inner">
                                <div><text>宾客安排</text></div>
                                <div><text>{{deskInfos.real_number}}/{{deskInfos.number}}</text></div>
                            </div>
                        </div>

                        <div v-for="(pItem,p_sub) in people" :key="p_sub">
                            <div class="people-list">
                                <div class="people-num">
                                    <div class="people-left">
                                        <div class="dat" :style="{backgroundColor : randomColorArr[p_sub]}"></div>
                                        <div class="name"><text>{{pItem.name}}</text></div>
                                    </div>
                                    <div class="num-edit">
                                        <div class="num-btn-box">
                                            <div class="num-btn">
                                                <div class="jian" data-seating="minus" :data-pidx="p_sub" @click="takeAlongNumber"><text class="iconfont icon-jianhao"></text></div>
                                                <div class="number"><text>{{pItem.number}}</text></div>
                                                <div class="jia" data-seating="plus" :data-pidx="p_sub" @click="takeAlongNumber"><text class="iconfont icon-jiahao"></text></div>
                                            </div>
                                        </div>
                                        <div class="num-del" :data-dgidx="p_sub" @click="delGuest"><text class="iconfont icon-jianhao"></text></div>
                                    </div>
                                </div>
                            </div>  
                        </div>

                        <div class="added">
                            <div class="added-inner" @click="navPeopleList">
                                <div class="add-icon"><text class="iconfont icon-jiahao"></text></div>
                                <div class="add-text"><text>从已添加的宾客中选择</text></div>
                            </div>
                        </div>
                        <div class="added">
                            <div class="added-inner" @click="delDask">
                                <div class="delete-text"><text>删除本桌，并将宾客移至待安排区</text></div>
                            </div>
                        </div>                
                    </div>
                </div>
                <div class="bottom-btn">
                    <div class="add-btn"  @click="addShow" :data-show="true"><text>添加宾客</text></div>
                    <div class="save-btn" @click="saveDesk"><text>保存</text></div>
                </div>

                <div :class="['name-input',isShow ? 'input-show':'input-hidden']" @touchmove="preventTouchMove">
                    <form @submit="addName">
                        <div class="name-inner">
                            <div class="peoples-input">
                                <input v-if="isShow" name="names" placeholder="姓名见用逗号隔开，可以一次性添加多位宾客" placeholder-class="name-placeholder" maxlength="140"/>
                            </div>
                            <div class="btn">
                                <div class="btn-box">
                                    <button plain="true" form-type="submit">确认</button>                        
                                </div>

                            </div>            
                        </div>          
                    </form>
                </div>
                <div :class="['mask',isShow ? '':'hidden']" @touchmove="preventTouchMove" @click="addShow" :data-show="false"></div>   
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js';
import { wed_url } from '../../utils/wed_url.js'
import store from '../../store/store'
export default {
    data(){
        return{
            isShow: false,
            id: null,
            deskInfos: {},
            number: 0,
            real_number: 0,
            people: [],
            deskName: '',
            addPeople: [],
            color: 255,
            colorArr: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
                "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
                "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
                "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
                "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
            ],
            randomColorArr: [],
            sort:1,
        }
    },
    methods:{
        navPeopleList: function () {//导航到宾客列表
            let sid=this.sid;
            swan.navigateTo({
                url: '../peopleLists/main?sid=' + sid + "&id=" + this.id
            })
        },
        preventTouchMove: function (e) {},
        saveDesk: function () {
            let sid=this.sid;
            let people = this.people
            let param = []
            for (let i in people) {
                param[i] = {},
                param[i].id = people[i].id;
                param[i].name = people[i].name;
                param[i].number = people[i].number
            }
            let submitdata={
                    sid: sid,
                    id: this.id,
                    name: this.deskName,
                    number: this.deskInfos.number,
                    people: param
                };
            submitdata=getSign(submitdata,sid)
            swan.request({
                url: wed_url.dc_url + "GuestsDeskSave",
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: submitdata,
                success: (res) => {
                    sid=res.data.sid
                    if (res.data.status === "success") {
                        swan.showToast({
                            title: "保存完成",
                            icon: 'success',
                            success: () => {
                                swan.navigateBack()
                            }
                        })
                    }
                },
                fail: function (err) {
                    console.log(err)
                },
            })
        },
        takeAlongNumber: function (e) { //设置座位
            let people = this.people;
            let seating = e.currentTarget.dataset.seating;
            let sid = sid;
            let pidx = e.currentTarget.dataset.pidx;
            if (seating === "minus" || seating === "plus") {
                let pnumber = people[pidx].number;
                let id = people[pidx].id;
                if (pnumber <= 1) {
                    pnumber = 1
                }
                if (seating === "minus") {
                    this.people[pidx].number=pnumber-1;
                } else if (seating === "plus") {
                    this.people[pidx].number=pnumber+1;
                }
                let real_number = 0;
                for (let p_idx in people) {
                    real_number += people[p_idx].number
                };
                this.deskInfos.real_number=real_number;
            } else if (seating === "num_minus" || seating === "num_plus") {
                let number = this.deskInfos.number;
                if (number < 1) {
                    number = 1
                }
                if (seating === "num_minus") {
                    this.deskInfos.number=number-1;
                } else if (seating === "num_plus") {
                    this.deskInfos.number=number+1;
                }
            }
        },
        delGuest: function (e) {
            let people = this.people;
            let gsub = e.currentTarget.dataset.dgidx;
            people.splice(gsub, 1);
            this.people=people;
            this.colorRandom()
        },
        myTrim: function (x) { //去除空格
            return x.replace(/^\s+|\s+$/gm, '');
        },
        addName: function (e) { //添加宾客
            if (e.mp.detail.value.names === "") {
                swan.showToast({
                    title: '新增宾客不能为空',
                    icon: 'none'
                })
                return
            }
            let names = (e.mp.detail.value.names).split(",");
            let people = this.people
            let peoples = []
            for (let nidx in names) {
                let str = this.myTrim(names[nidx]);
                if (str !== "") {
                    peoples[nidx] = {}
                    peoples[nidx].name = this.myTrim(names[nidx]);
                    peoples[nidx].number = 1;
                    peoples[nidx].id = "";
                    people.push(peoples[nidx])
                }
            }
            this.isShow=false;
            this.people=people;
            this.colorRandom()
        },
        delDask: function () { //删除桌子
            let sid=this.sid;
            let id = this.id
            let param={sid,id};
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "GuestsDeskDelete",
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: param,
                success: (res) => {
                    this.sid=res.data.sid;
                    if (res.data.status === "success") {
                        swan.showToast({
                            title: "删除完成",
                            icon: 'success',
                            success: () => {
                                swan.navigateBack()
                            }
                        })
                    }
                },
                fail: function (err) {
                    console.log(err)
                },
            })
        },
        addShow: function (e) {
            let isShow = e.currentTarget.dataset.show;
            if (isShow) {
                this.isShow=true;
            } else if (!isShow) {
                this.isShow=false;
            }
        },
        setNavigationBarTitle: function (sort) {
            swan.setNavigationBarTitle({
                title: sort + '号桌'
            })
        },
        guestsDeskInfo: function () { //获取座位详情
            let sid=this.sid;
            let id=this.id;
            let param={sid,id};
            param=getSign(param,sid);
            swan.request({
                url: wed_url.dc_url + "GuestsDeskInfo",
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data:param,
                success: (res) => {
                    this.sid = res.data.sid;
                    this.deskInfos=res.data.data;
                    this.number=res.data.data.number;
                    this.real_number=res.data.data.real_number;
                    this.people=res.data.data.people;
                    this.deskName=res.data.data.name;
                    this.colorRandom()
                },
                fail: function (err) {
                    console.log(err)
                },
            })
        },
        colorRandom:function(){
            let that = this,
                labLen = that.people.length,
                colorArr = that.colorArr,
                colorLen = colorArr.length,
                randomColorArr = [];
            //判断执行
            do {
                let random = colorArr[Math.floor(Math.random() * colorLen)];
                randomColorArr.push(random);
                labLen--;
            } while (labLen > 0)
            this.randomColorArr=randomColorArr;      
        },

    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.id=options.id;
        this.sid = options.sid;
        let sort=options.sort;
        this.setNavigationBarTitle(sort)
    },    
    mounted(){
        console.log('mounted')
        this.guestsDeskInfo()
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        let people = this.people;
        let addPeople = store.getters.addPeople;
        people = people.concat(addPeople);
        store.commit('setPeople',[])
        this.addPeople=[];
        this.people=people;
        this.colorRandom()
    },
    onUnload(){
            this.isShow= false;
            this.id= null;
            this.deskInfos= {};
            this.number= 0;
            this.real_number= 0;
            this.people= [];
            this.deskName= '';
            this.addPeople= [];
            this.color= 255;
            this.colorArr= ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
                "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
                "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
                "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
                "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
            ];
            this.randomColorArr= [];
            this.sort=1;        
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
