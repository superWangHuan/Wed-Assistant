<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="shell">
                <!-- 切换按钮 -->
                <div class="cut-box">
                    <div class="cut-btn" @click="cutmodule">
                        <text>{{iBtn}}</text>
                    </div>
                </div>
                <!-- 记账列表 -->
                <div class="record-content">
                    <div class="record-inner">
                        <div class="record-title"><text>{{eBtn}}</text></div>
                        <div class="record-expense">
                            <div class="expense-box">
                                <div class="expense-text"><text>{{retitle||'已消费'}}￥</text></div>
                                <div class="expense-price" v-if="judeg==0"><text>{{expdata.total||price}}</text></div>
                                <div class="expense-price" v-if="judeg==1"><text>{{incdata.total||price}}</text></div>
                            </div>
                            <div class="record-btn">
                                <div class="record-btn-title" :data-id="''" @click="navdetail"><text>记一笔</text></div>
                            </div>
                        </div>
                        <!-- 列表部分 -->
                        <div class="record-list">
                            <scroll-view scroll-y class="list">
                                <div :class="['list-inner',judeg===0?'':'hidden']">
                                    <div class="list-cla" v-for="(r_item,r_sub) in reList" :key="r_sub">
                                        <div class="item-title"><text>{{r_item.name}}</text></div>
                                        <div class="item-list-box">
                                                <!-- 父花费 -->
                                            <div class="item-list" v-for="(ditem,didx) in r_item.lists" :key="didx">
                                                <div class="item-icon"><image :src="r_item.icon"></image></div>
                                                <div class="item-inner">
                                                    <div class="content-price" :data-id="ditem.id" @click="navdetail">
                                                        <div class="item-name"><text>{{r_item.name}}</text></div>
                                                        <div class="item-price"><text>￥{{ditem.price}}</text></div>
                                                    </div>
                                                    <div class="item-time-remark"><text>{{ditem.time}}</text><text>{{ditem.remark}}</text></div>
                                                    <div class="item-imgs">
                                                        <div v-for="(photo,p_sub) in ditem.photo" :key="p_sub">
                                                            <div class="img">
                                                                <image :src="photo" :data-urls="ditem.photo" :data-url="photo" @click="predivImage"></image>
                                                            </div>                                            
                                                        </div>
                                                    </div>                                    
                                                </div>                                             
                                            </div>
                                                <!-- 子花费 -->
                                            <div v-for="(citem,cidx) in r_item._child" :key="cidx">
                                                <div v-for="(clitem,clidx) in citem.lists" :key="clidx">
                                                    <div class="item-list">
                                                        <div class="item-icon"><image :src="citem.icon"></image></div>
                                                        <div class="item-inner">
                                                            <div class="content-price" :data-id="clitem.id" @click="navdetail">
                                                                <div class="item-name"><text>{{citem.name}}</text></div>
                                                                <div class="item-price"><text>￥{{clitem.price}}</text></div>
                                                            </div>
                                                            <div class="item-time-remark"><text>{{clitem.time}}</text><text>{{clitem.remark}}</text></div>
                                                            <div class="item-imgs">
                                                                <div v-for="(photo,p_sub) in clitem.photo" :key="p_sub">
                                                                    <div class="img">
                                                                        <image :src="photo" :data-urls="clitem.photo" :data-url="photo" @click="predivImage"></image>
                                                                    </div>                                            
                                                                </div>
                                                            </div>                                    
                                                        </div>
                                                    </div>                                       
                                                </div>                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div class="no-record" v-if="reList.length==0">
                                        <div class="no-img">
                                            <image :src="no_record_img"></image>
                                        </div>
                                    </div>                             
                                </div>


                                <!-- 礼金收入 -->
                                <div class="list-cla" v-if="judeg">  
                                    <div :class="['item-title',inlist.length>0?'':'hidden']"><text>礼金</text></div>
                                    <div class="item-list-box">
                                        <div v-for="(initem,inidx) in inlist" :key="inidx">
                                            <div class="item-list" :data-id="initem.id" @click="navdetail">
                                                <div class="item-icon"><image :src="account_img"></image></div>
                                                <div class="item-inner">
                                                    <div class="content-price">
                                                        <div class="item-name"><text>{{initem.name}}</text></div>
                                                        <div class="item-price"><text>￥{{initem.price}}</text></div>
                                                    </div>
                                                    <div class="item-time-remark"><text>{{initem.time}}</text><text>{{initem.remark}}</text></div>                                 
                                                </div>
                                            </div>                                       
                                        </div>
                                    </div>
                                    <div class="no-record" v-if="inlist.length==0">
                                        <div class="no-img">
                                            <image :src="no_record_img"></image>
                                        </div>
                                    </div>                                    
                                </div>   


                            </scroll-view>
                        </div>
                    </div>
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
        return{
            sid:"",
            recordlist:{},
            reList:[],
            retitle:"已消费",
            iBtn:"礼金收入",
            eBtn:"结婚支出",
            judeg:0,
            incomelist:{},
            inlist:[],
            expdata:{},
            incdata:{},
            price:0.00,
            sid:'',
            no_record_img:wed_url.img_url+'/wedTools/pic/book/empty.png',
            account_img:wed_url.img_url+'/wedTools/pic/book/b-lijin@2x.png',
        }
    },
    methods:{
        previewImage:function(e){//预览图片
            var url=e.currentTarget.dataset.url
            var urls=e.currentTarget.dataset.urls
            swan.previewImage({
                current:url,
                urls:urls,
                success:function(){},
                fail:function(err){console.log(err)},
                complete:function(){},
            })
        },
        navdetail:function(e){
            var id=e.currentTarget.dataset.id;
            var judeg=this.judeg;
            var key=this.sid;
            swan.navigateTo({
                url:"../accountEdit/main?sid="+key+"&aid="+id+"&judeg="+judeg
            })
        },
        cutmodule:function(){
            let str=this.iBtn;
            this.iBtn=this.eBtn;
            this.eBtn=str;
            if(str==="礼金收入"){
                this.judeg=1;
                this.retitle='已收入'
            }else if(str==="结婚支出"){
                this.judeg=0;
                this.retitle='已消费'
            }
        },
        getRecordData:function(){//获取花费记录数据
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+"RecordOutLists",
                dataType:'json',
                method:'POST',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    this.sid=res.data.sid;
                    let reList=res.data.data.lists;
                    for(var key in reList){
                        var name=reList[key].name
                        name=name.substring(name.length-2)
                        reList[key].name=name
                    }
                    this.recordlist=res.data.data;
                    this.reList=reList;
                    this.expdata=res.data.data;                    
                },
                fail:function(err){console.log(err)}
            })
        },
        getIncome:function(){//获取收入
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+"RecordInLists",
                dataType:'json',
                method:'GET',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    this.sid=res.data.sid;
                    let inlist=res.data.data.lists
                    this.incomelist=res.data.data;
                    this.inlist=inlist;
                    this.incdata=res.data.data;
                },
                fail:function(err){console.log(err)}
            })        
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
    },
    onShow(){
        this.getRecordData()
        this.getIncome()
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
