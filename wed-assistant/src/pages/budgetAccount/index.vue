<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="account-container">
                <div class="a-title"><text>请选择预算项目</text></div>
                <div class="account-list">
                    <scroll-view scroll-x="false" scroll-y="true" upper-threshold="50" lower-threshold="50" scroll-top="" scroll-left="" scroll-into-div="" scroll-with-animation="false">
                            <div v-for="(bitem,pidx) in blist" :key="pidx">
                                <div class="list-box">
                                    <div class="p-item">
                                        <div class="item-inner">
                                            <div class="check-btn">
                                                <div :class="['btn', bitem.count!=0?'check-active':'']" @click="check" :data-field="bitem.field"><text class="iconfont icon-xuanzhong"></text></div>
                                                <div class="btn-title" :data-idx="pidx" @click="unfold"><text>{{bitem.name}}</text></div>
                                            </div>
                                            <div class="switch-icon"><text :class="['iconfont',bitem.isShow?'icon-xiangxiazhankai':'icon-xiangshangshouqi']"></text></div>                    
                                        </div>
                                    </div>
                                    <div :class="['child-box',bitem.isShow?'':'list-hidden']">
                                        <div v-for="(citem,cidx) in bitem._child" :key="cidx">
                                            <div class="c-item">
                                                    <div class="item-inner">
                                                        <div class="check-btn">
                                                            <div :class="['btn',citem.default?'check-active':'']" @click="check" :data-field="citem.field"><text class="iconfont icon-xuanzhong"></text></div>
                                                            <div class="btn-title"><text>{{citem.name}}</text></div>
                                                        </div>                 
                                                    </div>                
                                            </div>           
                                        </div>
                                    </div> 
                                </div>            
                            </div>
                    </scroll-view>
                </div>
            </div>
            <div class="submit-btn"><button plain="true" @click="submitAccount">确认</button></div> 
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js';
import { wed_url } from '../../utils/wed_url.js'
export default {
    data(){
        return{
            blist: [],
            pricelist: {},
            isShow: true,
            ischeck: true,
            parentId: "",
            price:null,
            budgetList:[],
            copyList:[],
        }
    },
    methods:{
        // 选中
        submitAccount:function(){
            let sid=this.sid;
            let price=this.budgetList.price;
            let param={};
            let alltotal=0;
            let blist=this.blist;
            for(let bidx in blist){
                if(blist[bidx].count!==0){
                    for(let i in blist[bidx]._child){
                        if(blist[bidx]._child[i].default){
                            param[blist[bidx]._child[i].field]=""
                        }
                    }
                }
            }
            for(let key in param){
                if(key==='Jewelry'){
                    alltotal+=10
                }else if(key==="photo"){
                    alltotal+=5.2
                }else if(key==='sugar'){
                    alltotal+=3
                }else if(key==='dress'){
                    alltotal+=4.4
                }else if(key==='makeup'){
                    alltotal+=0.9
                }else if(key==='video'){
                    alltotal+=1.3
                }else if(key==='wedding_photo'){
                    alltotal+=1.3
                }else if(key==='siyi'){
                    alltotal+=2.7
                }else if(key==='car'){
                    alltotal+=2.5
                }else if(key==='plan'){
                    alltotal+=13.2
                }else if(key==='hotel'){
                    alltotal+=45.8
                }else if(key==='travel'){
                    alltotal+=9.7
                }
            }
            for(let key in param){
                if(key==='Jewelry'){
                    param[key]=Math.round(price*10/alltotal).toString()
                }else if(key==="photo"){
                    param[key]=Math.round(price*5.2/alltotal).toString()
                }else if(key==='sugar'){
                    param[key]=Math.round(price*3/alltotal).toString()
                }else if(key==='dress'){
                    param[key]=Math.round(price*4.4/alltotal).toString()
                }else if(key==='makeup'){
                    param[key]=Math.round(price*0.9/alltotal).toString()
                }else if(key==='video'){
                    param[key]=Math.round(price*1.3/alltotal).toString()
                }else if(key==='wedding_photo'){
                    param[key]=Math.round(price*1.3/alltotal).toString()
                }else if(key==='siyi'){
                    param[key]=Math.round(price*2.7/alltotal).toString()
                }else if(key==='car'){
                    param[key]=Math.round(price*2.5/alltotal).toString()
                }else if(key==='plan'){
                    param[key]=Math.round(price*13.2/alltotal).toString()
                }else if(key==='hotel'){
                    param[key]=Math.round(price*45.8/alltotal).toString()
                }else if(key==='travel'){
                    param[key]=Math.round(price*9.7/alltotal).toString()
                }
            }
            param.price=price;
            param.sid=sid
            param=getSign(param,sid);
            swan.request({
                url:wed_url.dc_url+ 'BudgetSave.html',
                dataType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: param,
                success: (res) => {
                    this.sid=res.data.sid
                    swan.navigateBack()
                }
            })
        },
        check: function (e) {
            var pricelist = this.pricelist; //现在已经选择的选项
            var blist = this.blist; //所有的项目列表
            var field = e.currentTarget.dataset.field; //项目名称
            for (let bidx in blist) {
                if (blist[bidx].field === field && blist[bidx].count === 0) {
                    for (let cidx in blist[bidx]._child) {
                            this.blist[bidx]._child[cidx].default=true;
                            this.blist[bidx].count=blist[bidx]._child.length;
                    }
                } else if (blist[bidx].field === field && blist[bidx].count !== 0) {
                    for (let cidx in blist[bidx]._child) {
                            this.blist[bidx]._child[cidx].default=false;
                            this.blist[bidx].count=0;
                    }
                }else if(blist[bidx].field !== field){
                    for(let cidx in blist[bidx]['_child']){
                        if(blist[bidx]._child[cidx].field===field && blist[bidx]._child[cidx].default===false){
                                this.blist[bidx]._child[cidx].default=true;
                                this.blist[bidx].count=blist[bidx].count+1;
                        }else if(blist[bidx]._child[cidx].field===field && blist[bidx]._child[cidx].default===true){
                                this.blist[bidx]._child[cidx].default=false;  
                                this.blist[bidx].count=blist[bidx].count-1;                 
                        }
                    }
                }
                this.blist=blist;
            }
        },
        //展开收起
        unfold: function (e) {
            let idx=e.currentTarget.dataset.idx;
            let list=this.blist;
            for(let i in list){
                let isShow=list[idx].isShow
                if(!isShow){
                    list[idx].isShow=true;
                }else if(isShow){
                    list[idx].isShow=false;
                }
            }
            this.blist=list;
        },
        getAccount: function () { //获取项目列表
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+'BudgetCategory.html',
                dataType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: param,
                success: (res) => {
                    this.sid=res.data.sid;
                    let list=res.data.data
                    for(let j in list){
                        list[j].isShow=true
                    };
                    this.blist=list;
                }
            })
        },
        getPrice: function () {//获取预算
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url +'BudgetInfo.html',
                dataType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data:param,
                success: (res) => {
                    this.sid=res.data.sid
                    let pricelist = res.data.data;
                    let obj = {}
                    for (let key in pricelist) {
                        if (key !== 'price') {
                            obj[key] = pricelist[key]
                        }
                    };
                    this.pricelist=obj;
                    this.budgetList=res.data.data;
                }
            })
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
        this.price=options.price;
    },
    mounted: function () {
        // 监听页面初次渲染完成的生命周期函数
        this.getAccount()
        this.getPrice()

    },
}
</script>
<style scoped>
    @import url('./index.css');
</style>
