<template>
    <div v-if="my">
        <div class="container">
            <!--to do-->
            <div class="task">
                <!-- 上半部分 -->
                <div class="task-top">
                    <div class="task-top-inner">
                        <div class="task-title"><text>已经完成</text></div>

                        <div class="task-plan">
                            <div class="task-plan-num"><text>{{fulfil}}/{{total}}</text></div>
                            <div class="task-progress-bar">
                                <progress :percent="plan" stroke-width="4" color="#FF6C86" backgroundColor="#FF6C86" activeColor="#FFFFFF" active="true"/>
                            </div>
                            <div class="addition">
                                <text>为我们人生中最神圣的时刻加油吧</text>
                            </div>
                        </div>
                    </div>
                </div>    

                <!-- 下半部分 -->
                <div class="task-bottom">
                    <!-- 导航栏 -->
                    <div class="task-nav">
                            <div @click="swichNav" :data-current="idx" v-for="(nav,idx) in navs" :class="[idx==currentTab?'active':'','nav-item']" :key="idx">
                                <text>{{nav}}</text>
                            </div>
                    </div>


                    <!-- 任务列表 -->
                    <swiper class="task-list" :current="currentTab" @change="switchTab" duration="300">
                            <!-- 自定义任务 -->
                            <swiper-item>
                                <scroll-view scroll-y="true">
                                    <div class="task-list-box">
                                        <div class="task-item-class">
                                            <!-- 近期 -->
                                            <div class="task-item-title" v-if="my.near.lists.length>0"><text>{{my.near.name}}</text></div>  
                                            <div class="task-item" v-for="(myTask,taskIdx) in my.near.lists" :key="taskIdx">
                                                <div :class="[myTask.who==1?'':'iconHidden','myIcon']">
                                                    <text>我的</text>
                                                </div>
                                                <div class="task-icon" @click="finish" :data-id="myTask.id"></div>
                                                <div class="task-cont" @click="navtaskAdd" :data-id="myTask.id">
                                                    <div class="content"><text>{{myTask.title}}</text></div>
                                                    <div class="task-time"><text>{{myTask.endtime}}止</text><text class="iconfont icon-right"></text></div> 
                                                </div>
                                            </div>
                                            <div class="nothing" v-if="my.near.lists.length==0 && my.afar.lists.length==0">
                                                <div class="notTitle">
                                                    <div class="not-icon"><image :src="no_task_img"></image></div>
                                                    <div class="nottitle"><text>还没有自定义任务我~</text></div>
                                                </div>
                                            </div>
                                            <!-- 远期 -->
                                            <div class="task-item-title" v-if="my.afar.lists.length>0"><text>{{my.afar.name}}</text></div>
                                                <div class="task-item" v-for="(myTask,taskIdx) in my.afar.lists" :key="taskIdx">
                                                    <div :class="[myTask.who==1?'':'iconHidden','myIcon']"><text>我的</text></div>
                                                    <div class="task-icon" @click="finish" :data-id="myTask.id"></div>
                                                    <div class="task-cont" @click="navtaskAdd" :data-id="myTask.id">
                                                        <div class="content"><text>{{myTask.title}}</text></div>
                                                        <div class="task-time"><text>{{myTask.endtime}}止</text><text class="iconfont icon-right"></text></div> 
                                                    </div>           
                                                </div>                               
                                        </div>                                
                                    </div> 
                                </scroll-view>
                            </swiper-item>
                            <!-- 常规 -->
                            <swiper-item>
                                <scroll-view scroll-y="true">
                                    <div class="task-list-box">
                                        <div class="task-item-class">
                                            <div v-for="(taskItem,task_idx) in taskList.conventional" :key="task_idx">
                                                <div class="task-item-title"><text>{{taskItem.name}}</text></div>
                                                <div v-for="(taskCont,cont_idx) in taskItem.lists" :key="cont_idx">
                                                    <div class="task-item">
                                                        <div class="task-icon" @click="finish" :data-id="taskCont.id"></div>
                                                        <div class="task-cont">
                                                            <div class="content"><text>{{taskCont.title}}</text></div>
                                                        </div>                                                     
                                                    </div>                                            
                                                </div>
                                            </div>
                                            <div class="nothing" v-if="taskList.conventional.length==0">
                                                <div class="notTitle">
                                                    <div class="not-icon"><image :src="no_task_img"></image></div>
                                                    <div class="nottitle"><text>没有任务哦~</text></div>
                                                </div>
                                            </div>
                                        </div>                               
                                    </div>

                                </scroll-view>
                            </swiper-item>
                            <swiper-item>
                                <scroll-view scroll-y="true">
                                    <div class="task-list-box">
                                        <div class="task-item-class">
                                            <!-- <div class="task-item-title"><text>完成的任务</text></div> -->

                                            <div v-for="(fulfil,index) in taskList.fulfil" :key="index">
                                                <div class="task-item">
                                                    <div class="task-icon" @click="finish" :data-id="fulfil.id">
                                                        <div class="task-icon-inner"><text class="iconfont icon-gou"></text></div>
                                                    </div>
                                                    <div class="task-cont" @click="finishNav" :data-obj="fulfil">
                                                        <div class="content"><text>{{fulfil.title}}</text></div>
                                                    </div>                                          
                                                </div>                                    
                                            </div>
                                            <div class="nothing" v-if="taskList.fulfil.length==0">
                                                <div class="notTitle">
                                                    <div class="not-icon"><image :src="no_task_img"></image></div>
                                                    <div class="nottitle"><text>还没有完成的任务哦~</text></div>
                                                </div>
                                            </div>
                                        </div>                                
                                    </div>
                                </scroll-view>
                            </swiper-item>
                    </swiper>
                </div>
            </div>


            <div class="task-add-btn" @click="navtaskAdd" :data-id="''">
                <text class="iconfont icon-jiahao"></text>
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
                navs:['自定义任务','常规任务','已经完成'],
                currentTab:0,
                isActive:true,
                taskList:{},
                isMyShow:false,
                plan:0,
                sid:'',
                fulfil:0,
                total:0,
                my:"",
                no_task_img:wed_url.img_url+'/wedTools/pic/wedTask/duigou5@2x.png'
            }
        },
        methods:{
            swichNav:function(e){
                let cur=e.currentTarget.dataset.current;
                this.currentTab=cur;          
            },
            switchTab: function (e) {
                this.currentTab=e.target.current
            },
            getTaskList:function(){//获取任务列表
                swan.showLoading({
                    title:'加载中...'
                })
                let sid=this.sid;
                let param={sid};
                param=getSign(param,sid);
                swan.request({
                    url: wed_url.dc_url+'TaskLists',
                    dataType:'json',
                    method:'POST',
                    header:{'content-type':'application/json'},
                    data:param,
                    success:(res)=>{
                        this.fulfil=res.data.data.count.fulfil;
                        this.total=res.data.data.count.total;                   
                        this.sid=res.data.sid;
                        this.taskList=res.data.data;
                        this.plan=res.data.data.count.fulfil/res.data.data.count.total*100; 
                        this.my=res.data.data.my;
                        swan.hideLoading()
                    },
                    fail:function(err){console.log(err)},
                })
            },
            //   完成任务
            finish:function(e){
                swan.showLoading({
                    title:'更新中...'
                })
                let sid=this.sid;
                let id=parseInt(e.currentTarget.dataset.id);
                let finishData={
                        sid,
                        id:id,
                    }
                finishData=getSign(finishData,sid)
                swan.request({
                    url:wed_url.dc_url+'TaskStatus.html',
                    dataType:'json',
                    method:'POST',
                    header:{'content-type':'application/json'},
                    data:finishData,
                    success:(res)=>{
                        this.sid=res.data.sid;
                        this.getTaskList();
                    },
                    complete:function() {
                        swan.hideLoading()
                    }
                })
            },
            navtaskAdd:function(e){
                var id=e.currentTarget.dataset.id;
                swan.navigateTo({
                    url:'../taskAdd/main?sid='+this.sid+'&id='+id,
                })
            },
            finishNav:function(e){
                var obj=e.currentTarget.dataset.obj;
                if(obj.who!=0){
                    swan.navigateTo({
                        url:'../taskAdd/main?sid='+this.sid+'&id='+obj.id,
                    })            
                }
            },  
        },
        onLoad(options){
            console.log('onLoad')
            this.sid=options.sid;
        },   
        onShow(){
            this.getTaskList()
        },
        onUnload(){
            this.currentTab=0
        }
    }
</script>
<style scoped>
@import url('./index.css');
</style>
