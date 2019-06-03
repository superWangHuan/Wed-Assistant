<template>
    <div>
        <div class="container">
            <!--to do-->
            <div class="set-budget">
                <form @submit="submitPrice">
                    <div class="set-budget-top">
                        <div class="set-budget-box">
                            <div class="budget-img"></div>
                            <div class="input-box">
                                <div class="input-inner">
                                    <input class="price" type="number" maxlength="14" value="" name="price" placeholder="请输入您的预算金额" placeholder-class="placeholder-font"/>
                                </div>
                            </div>
                        </div>
                    </div>   
                    <div class="set-budget-bottom">
                        <div class="submit-budget-box">
                            <div class="btn-box">
                                <div class="btn-inner">
                                    <button class="btn" plain form-type="submit">开始计算</button>
                                </div>
                            </div>
                        </div>                
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js';
import { wed_url } from '../../utils/wed_url.js'
export default {
    data(){
        return{
            key:'',
            sid:'',
            prices:{},
        }
    },
    methods:{
        getPrice:function(){//获取预算
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+"BudgetInfo",
                dataType:'json',
                method:'POST',
                header:{'content-type':'application/json'},
                data:param, 
                success:(res)=>{
                    this.sid=res.data.sid;
                    let prices=res.data.data;
                    this.prices=prices;
                },          
                fail:function(err){
                    console.log(err)
                }
            })
        },
        submitPrice:function(e){//设置预算金额
            let sid=this.sid;
            let price=e.mp.detail.value.price;
            if(price<20000){
                swan.showToast({
                    title:'预算金额太少了',
                    icon:'none'
                })
                return
            }
            let param=this.prices;
            let allopt=[];
            let percents={};
            let sub=0;
            let alltotal=0;
            for(let key in param){
                percents[sub]=new Object()
                if(key==='Jewelry'){
                    percents[sub].percent=10;
                    alltotal+=10
                }else if(key==="photo"){
                    percents[sub].percent=5.2
                    alltotal+=5.2
                }else if(key==='sugar'){
                    percents[sub].percent=3
                    alltotal+=3
                }else if(key==='dress'){
                    percents[sub].percent=4.4
                    alltotal+=4.4
                }else if(key==='makeup'){
                    percents[sub].percent=0.9
                    alltotal+=0.9
                }else if(key==='video'){
                    percents[sub].percent=1.3
                    alltotal+=1.3
                }else if(key==='wedding_photo'){
                    percents[sub].percent=1.3
                    alltotal+=1.3
                }else if(key==='siyi'){
                    percents[sub].percent=2.7
                    alltotal+=2.7
                }else if(key==='car'){
                    percents[sub].percent=2.5
                    alltotal+=2.5
                }else if(key==='plan'){
                    percents[sub].percent=13.2
                    alltotal+=13.2
                }else if(key==='hotel'){
                    percents[sub].percent=45.8
                    alltotal+=45.8
                }else if(key==='travel'){
                    percents[sub].percent=9.7
                    alltotal+=9.7
                }
                sub++
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
            param.sid=sid;
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+ 'BudgetSave.html',
                dataType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: param,
                success: (res) => {
                    this.sid=res.data.sid;
                    swan.navigateBack()
                }
            })
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
    },
    mounted(){
        this.getPrice()
    }
}
</script>
<style scoped>
@import url("./index.css");
</style>
