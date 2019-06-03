<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="feedback">
                <form report-submit="" @submit="feedback">


                    <div class="account">
                        <picker mode="selector" :range="accounts" @change="settype">
                            <div class="account-box">
                                <div class="title">
                                    <div class="ftil"><text>工具:</text></div>
                                    <div class="ttil"><text>{{typename}}</text></div>
                                </div>
                                <div class="title-right">
                                    <div class="acc-icon"><text class="iconfont icon-right"></text></div>
                                </div>
                            </div>
                        </picker>
                    </div>
                    <div class="problem">
                        <div class="problem-box">
                            <textarea class="problem-text" name="problem" placeholder="请您详细描述意见反馈，我们将第一时间解决" placeholder-class="p-placeholder"></textarea>
                        </div>
                    </div>
                    <div class="phone">
                        <div class="phone-box">
                            <input value="" type="number" name="mobile" password="false" placeholder="您的联系电话（选填）" placeholder-style="" placeholder-class="phone-placeholder"/>
                        </div>
                    </div>
                    <div class="btn">
                        <button plain="false" disabled="false" loading="false" form-type="submit">提交</button>
                    </div>
                </form>
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
            accounts:['结婚任务','结婚账本','结婚预算','我的宾客','结婚吉日','婚姻登记处','电子请帖'],
            type:'',
            typename:'',
            sid:'',
        }
    },
    methods:{
        settype:function(e){
            let sub=e.target.value;
            let accounts=this.accounts;
            this.typename=accounts[sub]
        },
        feedback:function(e){
            let sid=this.sid;
            let problem=e.target.value.problem;
            let mobile=e.target.value.mobile;
            let type=this.type;
            if(problem===""){
                swan.showToast({
                    title:"问题描述不能为空",
                    icon:"none",
                    duration:1000
                })            
            };
            if(mobile!==""){
                let reg=/^1(3|4|5|7|8)\d{9}$/;
                if(!reg.test(mobile)){
                    swan.showToast({
                        title:"手机号格式不正确",
                        icon:"none",
                        duration:1500
                    })
                    return
                };            
            }
            let param={sid,type,content:problem,mobile}
            param=getSign(param,sid);
            swan.request({
                url:wed_url.dc_url+'feedback',
                dataType:'json',
                header:{'content-type':'application/json'},
                method:'POST',
                data:param,
                success:(res)=>{
                    if(res.data.status==="success"){
                        swan.showToast({
                            title:'提交成功',
                            icon:'success'
                        })
                        swan.navigateBack()
                    }else{
                        swan.showToast({
                            title:res.data.message,
                            icon:'none'
                        })                    
                    }
                    
                },
                fail:function(err){
                    console.log(err)
                }
            })
        },
    },
    watch:{//监听
        typename(newValue){
            let type=''
            if(newValue==='结婚任务'){
                type='task'
            }else if(newValue==='结婚账本'){
                type='record'
            }else if(newValue==='结婚预算'){
                type='calculation'
            }else if(newValue==='我的宾客'){
                type='guests'
            }else if(newValue==='结婚吉日'){
                type='auspicious'
            }else if(newValue==='婚姻登记处'){
                type='register'
            }else if(newValue==='电子请帖'){
                type==='invitation'
            }
            this.type=type;
        },
    },
    onLoad(options){
        this.sid=options.sid;
        this.typename=this.accounts[0];
        this.type="task";         
    },
    onReady(){
       
    },
    mounted(e){
 
    }
}
</script>
<style scoped>
    @import url("./index.css");
</style>

