<template>
    <div>
        <div class="container">
            <!--to do-->
            <web-view :src="url"></web-view>
        </div>
    </div>
</template>
<script>
import { getSign } from '../../utils/getData.js'
import { wed_url } from '../../utils/wed_url.js'
export default {
    data(){
        return{
            url:'',
            sid:''
        }
    },
    methods:{
        getUrl:function(){
            let sid=this.sid;
            let param={sid};
            param=getSign(param,sid)
            swan.request({
                url:wed_url.dc_url+"GuestsShareUrl",
                dataType:'json',
                method:'GET',
                header:{'content-type':'application/json'},
                data:{sid},
                success:(res)=>{
                    this.sid=res.data.sid;
                    this.url=res.data.data.view_url
                }
            })
        },
    },
    onLoad: function (options) {
        // 监听页面加载的生命周期函数
        this.sid=options.sid
    },
    mounted(){
        this.getUrl()
    }
}
</script>
<style scoped>
    @import url('./index.css');
</style>
