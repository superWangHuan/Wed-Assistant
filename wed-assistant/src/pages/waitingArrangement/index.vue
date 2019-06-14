<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="addTable">
                <div class="cut-off"></div>
                <div class="addTable-bottom">
                    <div class="addTable-bottom-box">
                        <div class="bottom-header">
                            <div class="bottom-header-inner">
                                <div><text>宾客安排</text></div>
                                <div><text>需要{{number}}座</text></div>
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
                            <div class="added-inner" @click="navPeopleList" :data-id="0">
                                <div class="add-icon"><text class="iconfont icon-jiahao"></text></div>
                                <div class="add-text"><text>从已添加的宾客中选择</text></div>
                            </div>
                        </div>               
                    </div>
                </div>
                <div class="bottom-btn">
                    <div class="add-btn"  @click="boxShow" :data-show="true"><text>添加宾客</text></div>
                    <div class="save-btn" @click="saveDesk"><text>保存</text></div>
                </div>

                <div :class="['name-input',isShow ? 'input-show':'input-hidden']" @touchmove.stop="preventTouchMove">
                    <form @submit="addName">
                        <div class="name-inner">
                            <div class="peoples-input">
                                <input :fixed="true" class="textarea" name="names" placeholder="姓名见用逗号隔开，可以一次性添加多位宾客" placeholder-class="name-placeholder" maxlength="140"/>
                            </div>
                            <div class="btn">
                                <div class="btn-box">
                                    <button plain="true" form-type="submit">确认</button>                        
                                </div>

                            </div>            
                        </div>          
                    </form>
                </div>
                <div :class="['mask',isShow ? '':'hidden']" @touchmove.stop="preventTouchMove" @click="boxShow" :data-show="false"></div>   
            </div>
            <div class="fill"></div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
import store from '../../store/store'
export default {
    data(){
        return{
            isShow:false,
            number:0,
            real_number:0,
            people:[],
            sid:'',
            colorArr: ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
                "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
                "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
                "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
                "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
            ],
            randomColorArr: [],
        }
    },
    methods:{
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
        navPeopleList:function(e){
            let sid=this.sid;
            swan.navigateTo({
                url:'../peopleLists/main?sid='+sid+"&id="+e.currentTarget.dataset.id
            })
        },
        myTrim:function (x) {//去除空格
            return x.replace(/^\s+|\s+$/gm,'');
        },
        preventTouchMove:function(e){},
        saveDesk:function(){
            let sid=this.sid;
            let people=this.people
            let param={
                sid:sid,
                name:"",
                id:0,
                number:"",
                people,
            };
            param=getSign(param,sid);
            swan.request({
                url:wed_url.dc_url+"GuestsDeskSave",
                dataType:'json',
                method:'POST',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    this.sid=res.data.sid;
                    if(res.data.status==="success"){
                        swan.showToast({
                            title:"保存完成",
                            icon:'success',
                            success:()=>{
                                swan.navigateBack()
                            }
                        })
                    }                
                },
                fail:function(err){console.log(err)},            
            })
        },
        takeAlongNumber:function(e){//设置座位
            let people=this.people
            let seating=e.currentTarget.dataset.seating;
            let pidx=e.currentTarget.dataset.pidx;
            let number=0;
            let id;
            if(seating==="minus"||seating==="plus"){
                let pnumber=people[pidx].number;
                id=people[pidx].id;
                if(pnumber<=1){
                    pnumber=1
                };
                if(seating==="minus"){
                    this.people[pidx].number=pnumber-1
                }else if(seating==="plus"){
                    this.people[pidx].number=pnumber+1        
                };
                for(let i in people){
                    number+=people[i].number
                };
                this.number=number;
            }
        },
        delGuest:function(e){
            let people=this.people;
            let gsub=e.currentTarget.dataset.dgidx;
            people.splice(gsub,1);
            this.people=people;
        },
        addName:function(e){//添加宾客
            if(e.mp.detail.value.names===""){
                swan.showToast({
                    title:'新增宾客不能为空',
                    icon:'none'
                })
                return
            }
            let names=(e.mp.detail.value.names).split(",");
            let people=this.people
            let peoples=[]
            for(let nidx in names){
                let str=this.myTrim(names[nidx]);
                if(str!==""){
                    peoples[nidx]={}
                    peoples[nidx].name=this.myTrim(names[nidx]);
                    peoples[nidx].number=1;
                    peoples[nidx].id="";
                    people.push(peoples[nidx])                
                }
            };
            this.isShow=false;
            this.people=people;
        },
        boxShow:function(e){
            let isShow=e.currentTarget.dataset.show;
            if(isShow){
                this.isShow=true;
            }else if(!isShow){
                this.isShow=false;
            }
        },
        guestsPendingLists:function(){//获取未安排宾客详情
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+"GuestsPendingLists",
                dataType:'json',
                method:'POST',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    sid=res.data.sid;
                    let number=0
                    let people=res.data.data;
                    for(let i in people){
                        number+=people[i].number
                    }
                    sid=res.data.sid;
                    this.people=people;
                    this.number=number;
                    this.colorRandom()
                },
                fail:function(err){console.log(err)},
            })
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        swan.setNavigationBarTitle({
            title:'待安排'
        })
        this.sid=options.sid;
    },
    mounted: function() {
        // 监听页面初次渲染完成的生命周期函数
        this.guestsPendingLists()
    },
    onShow:function(){
        let people = this.people;
        let addPeople = store.getters.addPeople;
        people = people.concat(addPeople);
        store.commit('setPeople',[])
        this.addPeople=[];
        this.people=people;
        this.colorRandom()
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
