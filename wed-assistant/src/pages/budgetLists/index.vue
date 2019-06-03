<template>
    <div>
        <div class="container" v-if="pitchList">
            <!--to do-->
            <div class="budget">
                <div class="budget-top">
                    <div class="budget-top-box">
                        <div class="budget-top-left">
                            <div class="budget-top-title"><text>预算金额(元)</text></div>
                            <div class="bduget-top-price"><text>{{prices.price||0}}</text></div>
                            <div class="budget-top-title"><text>超过了全国</text><text>{{secne}}</text><text>%的新人</text></div>
                        </div>
                        <div class="budget-top-right">
                            <div class="navbudget" @click="navBudget"><text>重新预算</text><text class="iconfont icon-right"></text></div>
                        </div>          
                    </div>
                </div>

                <div class="budget-bottom">
                    <div class="summarize">
                        <div class="summarize-box">
                            <div class="cake">
                                <canvas canvas-id="cake" binderror="" class="canvas"></canvas>
                            </div>
                            <div class="proportion">
                                <div class="proportion-box">
                                    <div class="wedexpense">
                                        <div class="wed-box"><div class="icon-dian"></div><text class="wtitle">婚前消费</text><text>{{beforeWed}}%</text><text>￥{{beforePrice}}</text></div>
                                    </div>
                                    <div class="wedexpense">
                                        <div class="wed-box"><div class="icon-dian"></div><text class="wtitle">婚礼消费</text><text>{{weding}}%</text><text>￥{{wedPrice}}</text></div>
                                    </div>
                                    <div class="wedexpense">
                                        <div class="wed-box"><div class="icon-dian"></div><text class="wtitle">婚后消费</text><text>{{afterWed}}%</text><text>￥{{afterPrice}}</text></div>
                                    </div>                        
                                </div>

                            </div>                
                        </div>
                    </div>

                    <div class="expense">
                            <div class="expense-inner" v-for="(bitem,b_sub) in pitchList" :key="b_sub">
                                    <div class="expense-box" v-if="bitem">
                                        <div class="p-title"><text>{{bitem.name}}</text></div>
                                        <div class="opt-expense" v-for="(citem,c_sub) in bitem._child" :key="c_sub">
                                                <div class="e-image"><image :src="citem.icon" binderror="" bindload=""></image><div class="c-title"><text>{{citem.name}}</text></div></div>
                                                <div class="pricetext">
                                                    <text>￥</text>
                                                    <input :value="citem.price" :data-field="citem.field" type="number" password="false" maxlength="140" @input="changePrice"/>
                                                </div>
                                                <div class="edit"><text class="iconfont icon-bianji"></text></div>
                                        </div>
                                    </div>                      
                            </div>               
                    </div>
                    <div class="modify-project">
                        <div class="modify-project-btn" @click="navbudgetAccount"><text>修改项目</text></div>
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
            key: '',
            budgetList: '',
            opt_price: 0,
            isShow: true,
            pitchList: [],
            prices: {},
            beforeWed: 0,
            weding: 0,
            afterWed: 0,
            beforePrice: 0,
            wedPrice: 0,
            afterPrice: 0,
            secne:4,
            sid:''
        }
    },
    methods:{
        navBudget: function () {
            let sid = this.sid
            swan.navigateTo({
                url: "../budget/main?sid=" + sid
            })
        },
        navbudgetAccount: function () {
            let sid = this.sid;
            swan.navigateTo({
                url: '../budgetAccount/main?sid=' + sid
            })
        },
        secnes:function(price){
            let secne=this.secne;
            if(price>=20000 && price<25000){
                    secne=(4+(price-20000)/(25000-20000)*(19-4))
                    secne=secne.toFixed(1)
                }else if(price>=25000 && price<46875){
                    secne=(19+(price-25000)/(46875-25000)*(39-19))
                    secne=secne.toFixed(1)                    
                }else if(price>=46875 && price<93750){
                    secne=(39+(price-46875)/(93750-46875)*(71-39))
                    secne=secne.toFixed(1)       
                }else if(price>93750 && price<187500 ){
                    secne=(71+(price-93750)/(187500-93750)*(91-71))
                    secne=secne.toFixed(1)                        
                }else if(price>=187500 && price<375000){
                    secne=(71+(price-187500)/(375000-187500)*(97-91))
                    secne=secne.toFixed(1)                      
                }else if(price>=375000 && price<750000){
                    secne=(97+(price-375000)/(750000-375000)*(98-97))
                    secne=secne.toFixed(1)                     
                }else if(price>=750000 && price<1500000){
                    secne=(98+(price-750000)/(1500000-750000)*(99-98))
                    secne=secne.toFixed(1)   
                }else if(price>=150000 && price<5999999){
                    secne=99
                }else if(price>=5999999 && price<6000000){
                    secne=99
                }else if(price>=6000000){
                    secne=100
            }
            this.secne=secne;    
        },
        changePrice: function (e) {
            let sid=this.sid;
            let new_value = e.mp.detail.value
            let field = e.currentTarget.dataset.field
            let prices = this.prices;
            let diff_value = 0;
            for (let pidx in prices) {
                if (pidx === field) {
                    diff_value = prices[pidx] - new_value;
                    prices[pidx] = new_value;
                    prices.price = prices.price - diff_value
                }
            };
            this.prices=prices;
            let pitchList = this.pitchList;
            let beforeWed = 0;
            let weding = 0;
            let afterWed = 0;
            let beforePrice = 0;
            let wedPrice = 0;
            let afterPrice = 0;
            let price=this.prices.price
            this.secnes(price)
            for (let pidx in prices) {
                if (pidx == "Jewelry" || pidx == "photo") {
                    if (prices[pidx] === "") {
                        prices[pidx] = '0'
                    }
                    beforePrice += parseInt(prices[pidx]);
                }
                if (pidx === "sugar" || pidx === "dress" || pidx === "makeup" || pidx === "makeup" || pidx === "wedding_photo" || pidx === "siyi" || pidx === "car" || pidx === "plan" || pidx === "hotel") {
                    if (prices[pidx] === "") {
                        prices[pidx] = '0'
                    }
                    wedPrice += parseInt(prices[pidx])
                }
                if (pidx === "travel") {
                    if (prices[pidx] === "") {
                        prices[pidx] = '0'
                    }
                    afterPrice += parseInt(prices[pidx])
                }
            }
            beforeWed = (beforePrice / (beforePrice + wedPrice + afterPrice) * 100);
            beforeWed = Number(beforeWed.toFixed(0))
            weding = Math.round(wedPrice / (beforePrice + wedPrice + afterPrice) * 100);
            weding = Number(weding.toFixed(0))
            afterWed = Math.round(afterPrice / (beforePrice + wedPrice + afterPrice) * 100);
            afterWed = Number(afterWed.toFixed(0))
            for (let pidx in pitchList) {
                let parr = pitchList[pidx]._child
                for (let cidx in parr) {
                    for (var fname in prices) {
                        if (fname === parr[cidx].field && prices[fname] !== "") {
                            parr[cidx].price = prices[fname].toString()
                        }
                    }
                }
            };
            this.pitchList=pitchList;
            this.prices=prices;
            this.beforeWed=beforeWed;
            this.weding=weding;
            this.afterWed=afterWed;
            this.beforePrice=beforePrice;
            this.wedPrice=wedPrice;
            this.afterPrice=afterPrice;
            let param = this.prices;
            param.sid = sid;
            param=getSign(param,sid)
            this.canvas()
            swan.request({
                url: wed_url.dc_url + 'BudgetSave.html',
                dataType: 'json',
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: param,
                success: (res) => {
                    this.sid=res.data.sid
                }
            })
        },
        getPrice:function(){//获取预算
            let pitchList=this.pitchList;
            let sid = this.sid;
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
                    let beforeWed=0;
                    let weding=0;
                    let afterWed=0;
                    let beforePrice=0;
                    let wedPrice=0;
                    let afterPrice=0;
                    let price=prices.price;
                    this.secnes(price)
                    for(let pidx in prices){
                        if(pidx==="Jewelry"||pidx==="photo"){
                            beforePrice+=parseInt(prices[pidx]);
                        }
                        if(pidx==="sugar"||pidx==="dress"||pidx==="makeup"||pidx==="makeup"||pidx==="wedding_photo"||pidx==="siyi"||pidx==="car"||pidx==="plan"||pidx==="hotel"){
                            wedPrice+=parseInt(prices[pidx]);
                        }
                        if(pidx==="travel"){
                            afterPrice+=parseInt(prices[pidx])
                        }
                    }
                    beforeWed=(beforePrice/(beforePrice+wedPrice+afterPrice)*100);
                    beforeWed=Number(beforeWed.toFixed(0))
                    weding=Math.round(wedPrice/(beforePrice+wedPrice+afterPrice)*100);
                    weding=Number(weding.toFixed(0))
                    afterWed=Math.round(afterPrice/(beforePrice+wedPrice+afterPrice)*100);
                    afterWed=Number(afterWed.toFixed(0))
                    for(let pidx in pitchList){
                        let parr=pitchList[pidx]._child
                        for(let cidx in parr){
                            for(var fname in prices){
                                if(fname===parr[cidx].field){
                                    parr[cidx].price=prices[fname].toString()
                                }
                            }
                        }
                    }
                    this.pitchList=pitchList;
                    this.prices=prices;
                    this.beforeWed=beforeWed;
                    this.weding=weding;
                    this.afterWed=afterWed;
                    this.beforePrice=beforePrice;
                    this.wedPrice=wedPrice;
                    this.afterPrice=afterPrice;
                    this.canvas()
                },          
                fail:function(err){
                    console.log(err)
                }
            })
        },
        getExpenseData: function () { //获取所有项目列表
            swan.showLoading({
                title:'加载中...',
            })
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url: wed_url.dc_url + "BudgetCategory",
                dataType: 'json',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data:param,
                success: (res) => {
                    this.sid=res.data.sid
                    let budgetList = res.data.data;
                    let b_arr = []
                    for (let i in budgetList) {
                        if (budgetList[i].count !== 0) {
                            b_arr[i] = {};
                            b_arr[i].count = budgetList[i].count;
                            b_arr[i].field = budgetList[i].field;
                            b_arr[i].icon = budgetList[i].icon;
                            b_arr[i].name = budgetList[i].name;
                            let arr = budgetList[i]._child;
                            let c_arr = []
                            for (let j in arr) {
                                if (arr[j].default) {
                                    c_arr.push(arr[j])
                                }
                            }
                            b_arr[i]._child = c_arr;
                        }
                    }
                    this.budgetList=res.data.data;
                    this.pitchList=b_arr;
                    this.getPrice();
                    swan.hideLoading()
                },
                fail: function (err) {
                    console.log(err)
                }
            })
        },
        canvas: function () {
            const ctx = swan.createCanvasContext('cake');
            // 或swan.createCanvasContext('myCanvas');
            let beforeWed = this.beforeWed;
            let weding = this.weding;
            let afterWed = this.afterWed;
            ctx.clearRect(0, 0, 190, 180)
            ctx.setStrokeStyle('#5CD7FC');
            ctx.arc(55, 45, 30, -0.5 * Math.PI, (beforeWed / 100 - 0.25) * 2 * Math.PI);
            ctx.setLineWidth(15)
            ctx.stroke();
            ctx.beginPath()
            ctx.setStrokeStyle('#F877AC');
            ctx.arc(55, 45, 30, (beforeWed / 100 - 0.25) * 2 * Math.PI, ((weding + beforeWed) / 100 - 0.25) * 2 * Math.PI);
            ctx.setLineWidth(15)
            ctx.stroke();
            ctx.beginPath()
            ctx.setStrokeStyle('#FAC925');
            ctx.arc(55, 45, 30, ((weding + beforeWed) / 100 - 0.25) * 2 * Math.PI, ((weding + beforeWed + afterWed) / 100 - 0.25) * 2 * Math.PI);
            ctx.setLineWidth(15)
            ctx.stroke();
            ctx.draw();
        },        
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid;
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        this.getExpenseData()
        // this.getPrice()
    },
}
</script>
<style scoped>
    @import url('./index.css');
</style>
