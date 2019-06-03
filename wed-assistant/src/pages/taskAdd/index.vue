<template>
    <div>
        <div :class="[taskContent||!id?'show':'hide','container']">
            <!--to do-->
            <div class="task-add">
                    <div class="task-content">
                        <input  v-model="taskContent" type="text" name="title" password="false" placeholder="请写下您的内容~" placeholder-class="place-holder" disabled="false" maxlength="140" auto-focus="false" focus="false"/>
                        <div class="matter"><text>相关事项</text></div>
                        <div class="matter-content">
                            <!-- 负责人 -->
                            <div class="principal-box">
                                <div class="principal">
                                    <div class="pri-icon"></div>  
                                    <div class="principal-btn">
                                        <div class="principal-text"><text>交给谁</text></div>
                                        <div class="switch">
                                            <div v-for="(p_item,idx) in principals" :key="idx" :class="['btn',idx==sel?'active':'']" :data-sel="idx" @click="optSwitch"><text>{{p_item}}</text></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 完成时间 -->
                            <div class="finish-box">
                                <div class="finish">
                                    <div class="fin-icon"></div>
                                    <div class="fin-time">
                                        <div class="finish-text"><text>达标时间</text></div>
                                        <div class="time-select">
                                            <picker mode="date" @change="finishTime" fields="day"><text>{{endTime}}</text><text class="iconfont icon-xia"></text></picker>
                                        </div>                            
                                    </div>
                                </div>
                            </div>
                            <!-- 删除任务 -->
                            <div :class="['delete-box',isShow?'':'delete-hidden']">
                                <div class="delete">
                                    <div class="delete-icon"><text class="iconfont icon-shanchu"></text></div>
                                    <div class="delete-btn" @click="taskDelete">
                                        <div class="delete-text"><text>删除任务</text></div>                        
                                    </div>
                                </div>
                            </div>                    
                        </div>
                    </div>
                    <div class="submit-btn">
                        <button plain="true" @click="taskSubmit">{{btn_content}}</button>
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
            principals: ['我', 'TA'],
            sel: 0,
            endTime: '请选择结束时间',
            btn_content: '保存',
            id:'',
            who:1,
            title: '',
            msg:'',
            isShow:false,
            taskContent:'',
            sid:''
        }
    },
    methods:{
        optSwitch: function (e) {
            let sel = e.currentTarget.dataset.sel;
            this.sel=sel;
            if(sel==0){
                this.who=1
            }else if(sel=1){
                this.who=2
            }
        },
        finishTime: function (e) {//完成时间
            this.endTime=e.target.value
        },
        taskDelete:function(){//删除任务
            let id=this.id;
            let sid=this.sid;   
            swan.showLoading({
                title:'删除中...'
            })
            let param={id,sid};
            param=getSign(param,sid);
            swan.request({
                url:wed_url.dc_url+'TaskDelete.html',
                dataType:'json',
                method:'GET',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    this.sid=res.data.sid;
                    if(res.data.status=="success"){
                        swan.hideLoading()
                        swan.showToast({
                            title:'删除成功',
                            icon:'none',
                            duration:1500,
                        })
                        swan.navigateBack()
                    }
                },
                fail:function(err){console.log(err)},
                complete:()=>{

                }
            })             
        },
        alterTask:function(){//获取任务数据
            let id=this.id;
            let sid=this.sid;   
            let param={id:id,sid,};
            param=getSign(param,sid);
            if(!id){return}
            swan.showLoading({
                title:'加载中...',
            })            
            swan.request({
                url:wed_url.dc_url+'TaskInfo.html',
                dataType:'json',
                method:'GET',
                header:{'content-type':'application/json'},
                data:param,
                success:(res)=>{
                    let who=res.data.data.who;
                    this.sid=res.data.sid;
                    this.taskContent=res.data.data.title;
                    this.endTime=res.data.data.endtime;
                    if(who==1){
                        this.sel=0;
                    }else if(who==2){
                        this.sel=1                  
                    }
                    swan.hideLoading()
                },
                fail:function(err){console.log(err)},
            })
        },
        addTask: function () {//添加任务/更改任务
            let sid=this.sid;
            let taskList = {
                sid,
                id: this.id,
                title: this.title,
                endtime: this.endTime,
                who: this.who,
            };
            taskList=getSign(taskList,sid)
            swan.request({
                url: wed_url.dc_url+'TaskSave.html',
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: taskList,
                success: (res) => {
                    this.sid=res.data.sid;
                    this.msg=res.data.message;
                    this.status=res.data.status;                   
                },
                fail: function (err) {
                    console.log(err)
                },
                complete:()=>{
                    let msg=this.msg;
                    let status=this.status;
                    let title='';
                    let icon='';
                    if(msg==="任务内容不能为空"&&status==="fail"){
                        title=msg;
                        icon='none';
                    }else if(msg==="达标时间不是一个有效的日期或时间格式"&&status==="fail"){
                        title="请选择完成时间";
                        icon='none';
                    }else if(status="success"){
                        title=msg;
                        icon='success';
                    }
                    swan.showToast({
                        title,
                        icon:icon,
                        duration:1500,
                        success:()=>{
                            if(status=="success"){
                                swan.navigateBack()
                            }
                        }
                    })
                }
            })
        },
        taskSubmit: function (e) {
            this.title=this.taskContent;
            this.addTask()
        },
    },
    watch:{
        taskContent(val){
            console.log(val)
        }
    },
    onLoad(options){
        this.sid=options.sid;
        this.id=options.id;
        var id=Number(options.id);
        if(Boolean(id)){
            this.btn_content='确认修改';
            this.isShow=true; 
        }else{
            this.btn_content='保存';
            this.isShow=false;                  
        }
        
    },
    mounted(){
        this.alterTask()
    },
    updated(){
    },
    onUnload(){
        this.who=1;
        this.sel=0;
        this.taskContent="";
        this.endTime='请选择结束时间';
    }
}
</script>
<style scoped>
    @import url("./index.css");
</style>
