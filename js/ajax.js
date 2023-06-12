//var _url = "http://172.21.201.144:8080/ipl-restapi/restapi/";
var layer;
var form;
// var imgurl = "http://192.168.43.76:8000/";
var imgurl = "http://xm.fancon.com.cn:8080/";
// var imgurl = "/";
// var imgurl = "http://www.recgroup.cn:7000";
//var _url = "http://localhost:8088/zhy/sqadmin/";
// var _url = "http://192.168.43.76:8000";
var _url = "http://47.114.46.189:8080";
//var _url = "http://xm.fancon.com.cn:8080";
// var _url = "";


layui.use(['layer'], function(){
    layer = layui.layer
});
function numFormat(x,factor_digit){
    if (typeof factor_digit=='undefined')
    {
        factor_digit=2
    }
    return (parseFloat(x).toFixed(factor_digit)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function parseNum(x){ return parseFloat(String(x).replace(/,/g,'')) }
var color_dict = {0:"<span style='color: slateblue;font-weight:bold'>拟稿</span>",
    10:"<span style='color: skyblue;font-weight:bold''>待部门审核</span>",
    15:"<span style='color: saddlebrown;font-weight:bold''>部门审改</span>",
    20:"<span style='color: #007aff;font-weight:bold''>待助理审核</span>",
    25:"<span style='color: saddlebrown;font-weight:bold''>助理审改</span>",
    30:"<span style='color: blueviolet;font-weight:bold''>待总监审核</span>",
    35:"<span style='color: saddlebrown;font-weight:bold''>总监审改</span>",
    40:"<span style='color: skyblue;font-weight:bold''>立项</span>",
    50:"<span style='color: green;font-weight:bold''>结项</span>",
    60:"<span style='color: crimson;font-weight:bold''>丢单</span>",};
var color_editdict = {0:"<span style='color: slateblue;font-weight:bold'>拟稿(立项修改)</span>",
    10:"<span style='color: skyblue;font-weight:bold''>待部门审核(立项修改)</span>",
    15:"<span style='color: saddlebrown;font-weight:bold''>部门审改(立项修改)</span>",
    20:"<span style='color: #007aff;font-weight:bold''>待助理审核(立项修改)</span>",
    25:"<span style='color: saddlebrown;font-weight:bold''>助理审改(立项修改)</span>",
    30:"<span style='color: blueviolet;font-weight:bold''>待总监审核(立项修改)</span>",
    35:"<span style='color: saddlebrown;font-weight:bold''>总监审改(立项修改)</span>",
    40:"<span style='color: skyblue;font-weight:bold''>立项(立项修改)</span>",
    50:"<span style='color: green;font-weight:bold''>结项(立项修改)</span>",
    60:"<span style='color: crimson;font-weight:bold''>丢单(立项修改)</span>",};
var color_losedict = {0:"<span style='color: slateblue;font-weight:bold'>丢单审批(拟稿)</span>",
    10:"<span style='color: skyblue;font-weight:bold''>丢单审批(待部门审核)</span>",
    20:"<span style='color: #007aff;font-weight:bold''>丢单审批(待助理审核)</span>",
    30:"<span style='color: blueviolet;font-weight:bold''>丢单审批(待总监审核)</span>",
    40:"<span style='color: skyblue;font-weight:bold''>立项</span>",
    60:"<span style='color: crimson;font-weight:bold''>丢单</span>",};
function check_from() {


    //设置输入被必须为>x 或<x ， x是0-100范围的数
    let check_portion  = $(".sq-percentage")
    for(let i=0;i<check_portion.length;i++){
        let obj = check_portion.eq(i)
        let value = obj.val()
        if (value.length>0){
            if ( ! value.startsWith('>')  &&   ! (value.startsWith('<') )){
                layer.msg(obj.attr("tip_name") +' 格式错误，请以 > 或 < 开始');
                obj.focus();
                return false
            }
            else{
                let percent = value.substr(1)
                try{
                    percent = parseFloat(percent)
                    if(percent<0 || percent>100) //不在正确范围内，设置为-1
                    {
                        percent = -1 ;
                    }
                }
                catch (e) {//解析错误，设置为-1
                    percent=-1
                }
                if(percent==-1) {
                    layer.msg(obj.attr("tip_name") + ' 格式错误，请在 > 或 < 符号之后填0-100之间的数');
                    return false
                }
            }

        }
    }


    let check_username  = $(".sq-username")
    for(let i=0;i<check_username.length;i++){
        let obj = $(check_username[i]);
        let min_length = obj.attr("min-length");
        let max_length = obj.attr("max-length");
        let cur_length = obj.val().length;
        let username = /^\w+$/;
        if(cur_length === 0){
            layer.msg("请输入"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
        if(cur_length < min_length ||cur_length > max_length){
            layer.msg(obj.attr("tip_name")+"的长度在"+min_length+"到"+ max_length+"个字符。")
            return false
        }
        if(!username.test(obj.val())){
            layer.msg(obj.attr("tip_name")+"由数字、26个英文字母或者下划线组成");
            obj.focus();
            return false
        }
    }
    let check_password  = $(".sq-password")
    for(let i=0;i<check_password.length;i++){
        let obj = $(check_password[i]);
        let cur_length = obj.val().length;
        let password = /^[a-zA-Z]\w{5,17}$/;
        if(cur_length === 0){
            layer.msg("请输入"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
        if(!password.test(obj.val())){
            layer.msg(obj.attr("tip_name")+"由以字母开头、长度在6-18之间，只能包括字符、数字和下划线");
            obj.focus();
            return false
        }
    }
    let check_tel  = $(".sq-tel")
    for(let i=0;i<check_tel.length;i++){
        let obj = $(check_tel[i]);
        let cur_length = obj.val().length;
        let tel = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/;
        if(cur_length === 0){
            layer.msg("请输入"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
        if(!tel.test(obj.val())){
            layer.msg(obj.attr("tip_name")+"格式错误");
            obj.focus();
            return false
        }
    }
    let check_len = $(".sq-length");
    for(let i=0;i<check_len.length;i++){
        let obj = $(check_len[i])
        let min_length = obj.attr("min-length");
        let max_length = obj.attr("max-length");
        let cur_length = obj.val().length;
        if(cur_length === 0){
            layer.msg("请输入"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
        if(cur_length < min_length ||cur_length > max_length){
            layer.msg(obj.attr("tip_name")+"的长度在"+min_length+"到"+ max_length+"个字符。")
            return false
        }
    }
    let check_select  = $(".sq-select")
    for(let i=0;i<check_select.length;i++){
        let obj = $(check_select[i])
        let cur_length = obj.val().length;
        if(cur_length === 0){
            layer.msg("请选择"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
    }
    let check_type = $(".sq-number");
    for(let i=0;i<check_type.length;i++){
        let obj = $(check_type[i]);
        let cur_length = obj.val().length;
        if(cur_length === 0){
            layer.msg("请输入"+obj.attr("tip_name"));
            obj.focus();
            return false
        }
        let input_type = obj.attr("input_type");
        switch (input_type){
            default: break;
            case "float":
                let a = /^\d+(\.\d+)?$/;
                // console.log(a.test(obj.val()))
                if(!a.test(parseNum(obj.val()))){
                    layer.msg(obj.attr("tip_name")+"为小数");
                    obj.focus();
                    return false
                }
                break;
            case "int":
                let b = /^-?\d+$/;
                // console.log(b.test(obj.val()))
                if(!b.test(parseNum(obj.val()))){
                    layer.msg(obj.attr("tip_name")+"为整数");
                    obj.focus();
                    return false
                }
                break;
            case "rate":
                // let c = /^0\.[1-9]\d*$/;
                let c = /^(100|[1-9]?\d(\.\d\d?\d?)?)$/;
                console.log(c.test(obj.val()))
                if(!c.test(obj.val())){
                    layer.msg(obj.attr("tip_name")+"为大于等于0小于等于100的数,允许保留三位小数");
                    obj.focus();
                    return false
                }
                break;
            case "discount":
                let d = /^(10|[1-9]?\d(\.\d\d?\d?)?)$/ ;
                console.log(d.test(obj.val()))
                if(!d.test(obj.val())){
                    layer.msg(obj.attr("tip_name")+"为大于等于0小于等于10的数,允许保留三位小数");
                    obj.focus();
                    return false
                }
                break;
        }
    }
    return true
}

function tooFastCall(url,option){
    //根据url和option判断当前访问时间是否太快，如果太快返回True，否则返回False
    // 利用本地存储缓存url和option，如果在0.5秒内连续触发则返回True。

    //MD5函数
    function MD5(d){let r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}


    let requestkey = MD5(JSON.stringify(option)+url)  //获取请求的描述字符
    let currenttime = Date.parse(new Date());  //当前时间

    //访问记录且当前时间与上一次请求时间超过3秒则将整个缓存记录删除
    if(window.sessionStorage.getItem('lastrequest') !== null
        && currenttime - window.sessionStorage.getItem('lastrequest') >2000){
        // 删除所有历史记录，防止本地缓存一直增大
        window.sessionStorage.removeItem('history')
    }
    window.sessionStorage.setItem('lastrequest',currenttime);  //记录最后一次请求时间
    if(window.sessionStorage.getItem('history') === null){
        window.sessionStorage.setItem('history',JSON.stringify({})) //首次创建历史记录
    }
    if(JSON.parse(window.sessionStorage.getItem('history'))[requestkey] != undefined
        && currenttime - JSON.parse(window.sessionStorage.getItem('history'))[requestkey] < 1000){ //请求已经存在且时间差小于1秒则什么都不做。
        console.log({requestkey:new Date().getTime()})
        console.log('========================操作太快，系统无法响应！')
        return true;//后面什么都不做了。
    }
        //记录最新一次requesstkey的访问时间。
        history_request = JSON.parse(window.sessionStorage.getItem('history'))
        history_request[requestkey] = currenttime
        window.sessionStorage.setItem('history',JSON.stringify(history_request))


    return false;
}

function getAjaxDate(url1,method,opinion,fun,show_error=true){

    if(tooFastCall(url1,opinion))return;

    let loading = null;
    // 后面是正常逻辑。
    $.ajax({
        // async: false,
        url: _url+url1,
        type : method,
        data : opinion,
        dataType : "json",
        beforeSend: (XMLHttpRequest)=> {
            XMLHttpRequest.setRequestHeader("Authorization","JWT"+" "+window.sessionStorage.getItem("token"));
             if(show_error){
                 loading = layer.load(1, {shade: 0.3 });
             }
            },
        complete:()=>{
            if(show_error){
                layer.close(loading)
            }
        },
        success: function(result){
            //注意layer关闭的时候验证码框的问题！
            //layer.closeAll();
            sq.tipurl(url1);
            console.log("%c%s","color:#443312;background-color:#d1c9b8;font-size:10px;padding:10px;","Loading date success:"+JSON.stringify(opinion));
            console.log("%c%s","color:#999;background-color:#efefef;font-size:10px;padding:10px;","Loading date success:"+JSON.stringify(result));
            //alert(JSON.stringify(result));
            checkRetno(result,opinion.type,fun);
        },
        error:function (xhr){
            if(show_error === true){
                alert("通信错误："+JSON.stringify(xhr))
            }
           // layer.closeAll();
            console.log(xhr);
        }
    });


}
function getOtherAjaxDate(url1,opinion,fun){
    $.ajax({
        url: url1,
        type : "POST",
        data : opinion,
        dataType : "json",
        success: function(result){
            //注意layer关闭的时候验证码框的问题！
            //layer.closeAll();
            sq.tipurl(url1);
            console.log("%c%s","color:#443312;background-color:#d1c9b8;font-size:10px;padding:10px;","Loading date success:"+JSON.stringify(opinion));
            console.log("%c%s","color:#999;background-color:#efefef;font-size:10px;padding:10px;","Loading date success:"+JSON.stringify(result));
            //alert(JSON.stringify(result));
            checkRetno(result,opinion.type,fun);
        },
        error:function (xhr){
            // alert("正在测试："+JSON.stringify(xhr))
            // layer.closeAll();
            console.log(xhr);
        }
    });
}
function checkRetno(result,type,fun){
    //alert("正在测试："+JSON.stringify(result))
    switch (parseInt(result.code)){
        case 700 :
            sq.open('lgin.html');
            break;
        case 302:
            console.log('302');
            break;
        case 100 :
            //sq.open(result.msg);
            break;
        case 10 :
            console.log("没有数据");
            break;
        case 50 :
            sq.msg(result.msg);
            break;
        case 60 :
            sq.inputWindow(survey.loginWindow);
            break;
        case 1 :
            fun(result);
            break;
        case 0 :
            // if (url1==="modifyUserInfo"){
            //     break;
            // }
            fun(result);
            // if (result.msg ==='登录状态下不允许进行此操作！'){
            //     setTimeout(function(){
            //         sq.open("index.html");//1秒后执行
            //     },500);
            //     break;
            // }
            // else if (result.msg ==='getuserinfo接口需用户登录'){
            //     setTimeout(function(){
            //         sq.open("lgin.html");//1秒后执行
            //     },500);
            //     break;
            // }
            // sq.msg(result.msg);
            // setTimeout(function(){
            //     sq.open("lgin.html");//1秒后执行
            // },500);
            break;
        default :

            console.log("["+type+"]:出错了！");
            break;
    }
}
var sq = {
    openDataPage :function (s,title) {
        this.violet("打开了："+s,"color:#FF00FF;background-color:#79008f;font-size:12px;padding:10px;");
        layer.open({
            type: 2,
            skin: 'layui-layer-molv',
            title: title,
            shadeClose: true,
            shade: 0.618,
            maxmin: true, //开启最大化最小化按钮
            area: ['90%', '450px'],
            content: s
        });
    },
    openImg :function (s,st) {
        sq.violet("打开了："+s,"color:#FF00FF;background-color:#79008f;font-size:12px;padding:10px;");
        layer.open({
            type: 2,
            skin: 'layui-layer-molv',
            title: st,
            shadeClose: true,
            shade: 0.618,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: s
        });
    },
    openImgCanRotate :function (s,st) {
        sq.violet("打开了："+s,"color:#FF00FF;background-color:#79008f;font-size:12px;padding:10px;");
        layer.open({
            type: 2,
            skin: 'layui-layer-molv',
            title: st,
            shadeClose: true,
            shade: 0.618,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '450px'],
            content: "iframewindow/imgrotate.html#u="+s
        });
    },
    open :function (s){
        window.location.href = s;
    },
    log :function (s,css) {
        css = (css == undefined) ? "color:#fff7d3;background-color:#ff4f49;font-size:12px;padding:10px;" : css;
        // console.log(window.location.href+"\n--------------------------------------------");
        //console.log(css);
        console.log("%c%s",css,s);
    },
    green :function (s,css) {
        css = (css == undefined) ? "color:#fff7d3;background-color:#33a600;font-size:12px;padding:10px;" : css;
        // console.log(window.location.href+"\n--------------------------------------------");
        console.log(css);
        console.log("%c%s",css,s);
    },
    blue :function (s,css) {
        css = (css == undefined) ? "color:#fff7d3;background-color:#00768f;font-size:12px;padding:10px;" : css;
        //console.log(window.location.href+"\n--------------------------------------------");
        //console.log(css);
        console.log("%c%s",css,s);
    },
    violet :function (s,css) {
        css = (css == undefined) ? "color:#fff7d3;background-color:#79008f;font-size:12px;padding:10px;" : css;
        //console.log(window.location.href+"\n--------------------------------------------");
        //console.log(css);
        console.log("%c%s",css,s);
    },
    tipurl :function (s,css) {
        css = (css == undefined) ? "color:#fff7d3;background-color:#675c48;font-size:12px;padding:10px;" : css;
        //console.log(window.location.href+"\n--------------------------------------------");
        //console.log(css);
        console.log("%c%s",css,s);
    },
    getHashStringArgs : function() {
        var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "");
        hashArgs = {};
        items = hashStrings.length > 0 ? hashStrings.split("&") : [];
        item = null;
        _name = null;
        value = null;
        i = 0;
        len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split("=");
            _name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            if (_name.length > 0) {
                hashArgs[_name] = value;
            }
        }
        return hashArgs;
    },
    existence:function (s) {
        try{
            JSON.parse(localStorage.getItem(s));
            if(localStorage.getItem(s) == undefined){
                return false;
            }else{
                return true;
            }
        }catch(error) {
            localStorage.removeItem(s);
            return false;
        }
    },
    roleindex : function (id) {
        for(var i = 0;i<roleList.length;i++){
            if(roleList[i].id == id){
                return i;
            }
        }
        return -1;
    },
    isundefinde :function (str) {
        if(str == undefined){
            return "";
        }else{
            return str;
        }
    },
    msg:function(str){
      layer.msg(str)
    },
    fmtDate:function (time,type) {
        var date;
        date = (parseInt(time) >100000) ? new Date(time * 1000) : new Date(time);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        switch (type){
            case 0 :
                return y + '-' + m + '-' + d;
            case 1 :
                return y + '/' + m + '/' + d;
            case 2 :
                return y + '年' + m + '月' + d+"日";
            case 3 :
                return m + '-' + d;
            case 4 :
                return m + '月' + d+"日";
            default :
                return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        }
    },
    isnull : function (str,behindstr,exnullstr) {
        if(str == null){
            return (exnullstr == undefined) ? "" : exnullstr;
        }else if(str == undefined){
            return (exnullstr == undefined) ? "" : exnullstr;
        }else{
            return (behindstr == undefined) ? str : str+behindstr;
        }
    },
    hasimg : function (str) {
        if(str == null){
            return "../images/no.png";
        }else if(str == undefined){
            return "../images/no.png";
        }else{
            return imgurl+str;
        }
    },
    category : function (id) {
        id = parseInt(id);
        var cate = JSON.parse(localStorage.getItem("tree"));
        for(var i = 0;i<cate.length;i++){
            if(cate[i].id == id){
                return cate[i].level_name;
            }
            if(cate[i]){
                for(var j = 0 ;j<cate[i].son.length;j++){
                    if(cate[i].son[j].id == id){
                        return cate[i].son[j].level_name;
                    }
                    if(cate[i].son[j].son) {
                        //console.log(cate[i].son[j].son);
                        for (var k = 0; k < cate[i].son[j].son.length; k++) {
                            if (cate[i].son[j].son[k].id == id) {
                                return cate[i].son[j].son[k].level_name;
                            }
                            if(cate[i].son[j].son[k].son) {
                                //console.log(cate[i].son[j].son);
                                for (var l = 0; l < cate[i].son[j].son[k].son.length; l++) {
                                    if (cate[i].son[j].son[k].son[l].id == id) {
                                        return cate[i].son[j].son[k].son[l].level_name;
                                    }
                                    if(cate[i].son[j].son[k].son[l].son) {
                                        //console.log(cate[i].son[j].son);
                                        for (var m = 0; m < cate[i].son[j].son[k].son[l].son.length; m++) {
                                            if (cate[i].son[j].son[k].son[l].son[m].id == id) {
                                                return cate[i].son[j].son[k].son[l].son[m].level_name;
                                            }
                                            if(cate[i].son[j].son[k].son[l].son[m].son) {
                                                //console.log(cate[i].son[j].son);
                                                for (var n = 0; n < cate[i].son[j].son[k].son[l].son[m].son.length; n++) {
                                                    if (cate[i].son[j].son[k].son[l].son[m].son[n].id == id) {
                                                        return cate[i].son[j].son[k].son[l].son[m].son[n].level_name;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return "无";
    },
    unescapeHTML: function(a){
        a = "" + a;
        return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    },
    page : function(o){
        if(o.size == undefined){
            o.size = 20;
        }
        // sq.violet(JSON.stringify(o))
        if($("#pageDiv").html() == undefined){
            $(o.bro).after('<div style="text-align: center;"><div id="pageDiv"></div></div>');
            //sq.green(o);
        }
        sq.green(sq.whatNumber(o.page));
        layui.use(['laypage', 'layer'], function(){
            var laypage = layui.laypage;
            laypage.render({
                elem: 'pageDiv'
                ,count: sq.whatNumber(o.count)
                ,limit: o.size
                ,limits:[10,20,50,100]
                ,page : sq.whatNumber(o.page)
                ,curr : sq.whatNumber(o.page)
                ,layout: ['limit','count', 'prev', 'page', 'next',  'refresh', 'skip',]
                ,jump: function(obj,first){
                    //console.log(obj);
                    if(!first){
                        o.jump(obj);
                    }


                }
            });
        });
    },
    showTax : function (s) {
        if(parseInt(s) == 1){
            return "<span style='color: #007DDB;font-size: 10px; font-weight: bold;margin-right: 3px;'>税</span>"
        }else{
            return "";
        }
    },
    whatNumber : function(s){
        return ((s == undefined) || (s == null) || (s == NaN)) ? 0 : parseFloat(s);
    },
    showTrans : function (s) {
        if(parseInt(s) >0){
            return "<span style='color: #FF5722;font-size: 10px;font-weight: bold;cursor: pointer;' title='"+s+"元'>运</span>"
        }else{
            return "";
        }
    },
    loadExcel : function (sourceID,successfun) {
        var X;
        try{
            X = XLSX;
            console.log($("#"+sourceID).change)

        }catch(e){
            $.getScript('/js/jszip.js',function(){
                $.getScript('/js/xlsx.js',function(){
                    X = XLSX;
                });
            });
        }
        $("#"+sourceID).change(
            function handleFile(e) {
                do_file(e.target.files);
            });
        var do_file = (function() {
            return function do_file(files) {
                var f = files[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data = e.target.result;
                    var result = {};
                    data = X.read(data, {type: 'binary'});
                    data.SheetNames.forEach(function(sheetName) {
                        var roa = X.utils.sheet_to_json(data.Sheets[sheetName], {header:1});
                        if(roa.length) result[sheetName] = roa;
                    });
                    successfun(result);
                };
                reader.readAsBinaryString(f);
            };
        })();
    },
    saveExcel : function (obj,filename,sheetName) {
        sheetName = (sheetName) ? sheetName : "Sheet1";
        var X;
        try{
            X = XLSX;
            console.log($("#"+sourceID).change)

        }catch(e){
            $.getScript('/js/jszip.js',function(){
                $.getScript('/js/xlsx.js',function(){
                    X = XLSX;
                });
            });
        }

        var data = obj;
        var ws_name = sheetName; //Excel第一个sheet的名称
        var wb = X.utils.book_new(), ws = X.utils.aoa_to_sheet(data);
        X.utils.book_append_sheet(wb, ws, ws_name);  //将数据添加到工作薄
        X.writeFile(wb, filename); //导出Excel
    },
    uploadFunction : function (o) {
        $(o.container).html('<div class="layui-upload"><button type="button" class="layui-btn layui-btn-danger" id="'+o.uploadImgBT+'">上传图片</button></div>')
        layui.use('upload', function () {
            upload = layui.upload;

            //普通图片上传
            var uploadInst = upload.render({
                elem: "#"+o.uploadImgBT
                , url: '../action/upload.php'
                , before: function (obj) {
                    if(o.preview != undefined){
                        obj.preview(function (index, file, result) {
                            $(o.preview).html('<img src="'+result+'" style="width: 60px;" />'); //图片链接（base64）
                        });
                    }
                }
                , done: function (res) {
                    //如果上传失败
                    if (res.code != 1) {
                        return layer.msg('上传失败');
                    }
                    if (res.code == 1) {
                        o.success(res.src);
                    }
                    //上传成功
                }
                , error: function () {
                    if(o.error != undefined){
                        o.error();
                    }
                }
            });
        });
    },
    inputWindow : function (param) {
        layui.use(['layer','form','laydate'], function() {
            layer = layui.layer;
            var form = layui.form;
            var laydate = layui.laydate;
            var str = "";
            var obj = {
                title:{
                    text:"标题",//标题
                    bgColor:"#003c97",//弹窗背景色
                    titleColor:"#FFFFFF"//弹窗文字颜色
                },
                width : "400px",
                top:'auto',
                offset: 'auto',
                closeBtn:1,
                shadeClose:true,
                button :{
                    sure:{
                        bgColor:"#1E9FFF",
                        titleColor:"#b0C0C0C"
                    }
                },
                form:{

                },
                sure : function (rel) {
                    console.log(rel);
                }
            };
            for(var key in param){
                if(typeof(obj[key]) == "object"){
                    for(sonKey in param[key]){
                        obj[key][sonKey] = param[key][sonKey];
                    }
                }else{
                    obj[key] = param[key];
                }
            }
            var forms = obj.form;
            obj.button = (obj.button == undefined) ? {} : obj.button;
            for(var key in forms){
                switch(forms[key].type){
                    case "select" :
                        var optionStr = "";
                        for(var i = 0;i<forms[key].value.length;i++){
                            optionStr += '<option value="'+forms[key].value[i].value+'" '+((forms[key].selectedValue == forms[key].value[i].value) ? 'selected' : '')+'>'+forms[key].value[i].label+'</option>'
                        }
                        str += '<div class="layui-form-item">' +
                            '    <label class="layui-form-label">'+forms[key].label+'</label>' +
                            '    <div class="layui-input-block">' +
                            '<select id="'+ key +'" name="'+ key +'">' +
                            optionStr +
                            '</select>'+
                            '    </div>' +
                            '  </div>';
                        break;
                    case "textarea" :
                        var optionStr = "";
                        str += '<div class="layui-form-item">' +
                            '    <label class="layui-form-label">'+forms[key].label+'</label>' +
                            '    <div class="layui-input-block">' +
                            '<textarea id="'+key+'" name="'+key+'" value="'+forms[key].value+'" autocomplete="off" placeholder="'+forms[key].tip+'" class="layui-textarea">'+forms[key].value+'</textarea>'+
                            '    </div>' +
                            '  </div>';
                        break;
                    case "date" :
                    case 'datetime':
                    case 'year':
                    case 'month':
                    case 'day':
                    case 'time':
						// 反结账标识*
                        var historyUpdateMark = "";
                        // 获取session值判断是否有反结账权限 具有权限标*
                        if (window.sessionStorage.getItem("historyUpdate") != 0) {
                            historyUpdateMark = "*";
                        }
                        str +=
                            '<div class="layui-form-item">' +
                            '    <label class="layui-form-label">' +
                            forms[key].label +
                            historyUpdateMark +
                            "</label>" +
                            '    <div class="layui-input-block">' +
                            '      <input type="text" id="' +
                            key +
                            '" name="' +
                            key +
                            '" value="' +
                            forms[key].value +
                            '" autocomplete="off" placeholder="' +
                            forms[key].tip +
                            '" class="layui-input">' +
                            "    </div>" + 
                            "  </div>";
                        break;
					case 'hdtext':
                        str += '<div class="layui-form-item">' +
                            '    <label class="layui-form-label">'+forms[key].label+'</label>' +
                            '    <div class="layui-input-block">' +
                            '      <input type="'+forms[key].type+'" id="'+key+'" name="'+key+'" value="'+forms[key].value+'" autocomplete="off" placeholder="'+forms[key].tip+'" class="layui-input" style="background:#EFEFEF" readonly="true">' +
                            '    </div>' +
                            '  </div>';
                        break;
                    default :
                        str += '<div class="layui-form-item">' +
                            '    <label class="layui-form-label">'+forms[key].label+'</label>' +
                            '    <div class="layui-input-block">' +
                            '      <input type="'+forms[key].type+'" id="'+key+'" name="'+key+'" value="'+forms[key].value+'" autocomplete="off" placeholder="'+forms[key].tip+'" class="layui-input">' +
                            '    </div>' +
                            '  </div>';
                        break;
                }
            }
            layer.open({
                type: 1,
                title:sq.voidReplace(obj.title.text,"提示"),
                skin: 'layui-layer-demo', //样式类名
                closeBtn: sq.voidReplace(obj.closeBtn,1), //不显示关闭按钮
                anim: 2,
                area:[obj.width,obj.top],
                offset: obj.offset,
                shadeClose: sq.voidReplace(obj.shadeClose,true), //开启遮罩关闭
                content: "<div class='layui-form sq-form-content'>"+str+"" +
                    "<div class='sq-form-btContent'>" +
                    "<button class='layui-btn' id='sureBT' style='font-weight: bold'>确定</button>" +
                    "<button class='layui-btn layui-btn-primary' id='cancelBT' style='font-weight: bold'>取消</button>" +
                    "</div>" +
                    "</div>"
            });
            form.render('select');
            var dateObj;
            for(var key in forms){
                dateObj = new Object();

                if(forms[key].type == "date"||
                    forms[key].type == "datetime"||
                    forms[key].type == "time"||
                    forms[key].type == "year"||
                    forms[key].type == "month"||
                    forms[key].type == "day"){
                    sq.green(forms[key].type);
                    dateObj.elem = "#"+key;
                    dateObj.type=forms[key].type;
                    let cur_year = new Date().getFullYear();
                    let year_start = cur_year+"-01-01";
                    let year_end = cur_year+"-12-31";
                    // 反结账标识
                    if (window.sessionStorage.getItem("historyUpdate") == 0) {
                        dateObj.min = year_start; // 关闭反结账
                    }
                    // dateObj.min = year_start;
                    dateObj.max = year_end;
                    (forms[key].theme == undefined) ? "" : dateObj.theme = forms[key].theme;
                    laydate.render(dateObj);
                }

            }
            $(".layui-layer-title").css("background-color",sq.voidReplace(obj.title.bgColor,"#333"));
            $(".layui-layer-title").css("color",sq.voidReplace(obj.title.titleColor,"#FFF"));
            $("#sureBT").css("background-color",sq.voidReplace(obj.button.sure.bgColor,"#666"));
            $("#sureBT").css("color",sq.voidReplace(obj.button.sure.titleColor,"#FFF"));
            $("#sureBT").click(function(){
                var relData = new Object();
                for(var key in forms){
                    if(!sq.voidReplace(forms[key].allowNull,false)){
                        if($("#"+key).val().length<1){
                            return layer.msg("<strong style='color: #FFB800;'>"+forms[key].label+"</strong>不能为空！");
                        }
                    }
                    relData[key] = $("#"+key).val();
                }
                obj.sure(relData);
                // layer.closeAll();
            });
            $("#cancelBT").click(function(){
                layer.closeAll();
            });
        })
    },
    voidReplace : function (testValue,displayStr,replacedValue) {
        if(displayStr == undefined){
            if((testValue == undefined)||(testValue == null)){
                return "";
            }else{
                return testValue;
            }
        }
        if(replacedValue == undefined){
            if((testValue == undefined)||(testValue == null)){
                return displayStr;
            }else{
                return testValue;
            }
        }else{
            if((testValue == undefined)||(testValue == null)||(testValue == replacedValue)){
                return displayStr;
            }else{
                return testValue;
            }
        }
    },
    checkBoxToTable : function(tableId) {
        if($(tableId+" thead tr input").length == 0){
            $(tableId+" thead tr").prepend('<th style="width: 50px;text-align: center;"><input type="checkbox" name="sq-check-table-all" title="全选" lay-skin="primary" lay-filter="sq-check-table-all"> </th>');
        }
        if($( tableId+" tbody tr td div input[name='sq-check-table-one']").length == 0){
            $(tableId+" tbody tr").prepend('<td style="text-align: center;"><div style="width: 50px;overflow: hidden;display: inline-block;"><input type="checkbox" name="sq-check-table-one" title="" lay-skin="primary" lay-filter="sq-check-table-one"> </div></td>');
        }

        layui.use(['form'], function(){
            var form = layui.form;
            form.on('checkbox(sq-check-table-all)', function(data){
                if(data.elem.checked){
                    $("tr .layui-form-checkbox").addClass("layui-form-checked")
                }else{
                    $("tr .layui-form-checkbox").removeClass("layui-form-checked")
                }
            });

        });
        layui.form.render("checkbox");
    },
    getCheckBoxFromTable : function(tableId) {
        var checkArray = [];
        var data1 = $(tableId +" .layui-form-checked").parent().parent().parent()
        for(var i=0;i<data1.length;i++){
            if($(data1[i]).attr("sqid")){
                console.log($(data1[i]).attr("sqid"))
                checkArray.push($(data1[i]).attr("sqid"));
            }
        }
        return checkArray;
    },

    findIframebyTgt:function(tgt,cur){
        for(var i=0;i<cur.frames.length;++i)
        {
            if ('tgt' in cur.frames[i])
            {
                if (cur.frames[i]['tgt']==tgt)
                    return cur.frames[i];
                findinChild = findIframebyTgt(tgt,cur.frames[i])
                if (findinChild!=null)
                    return findinChild
            }

        }
        return null;
    },

    checkNumber: function (theObj, numberMark=1) {
        var reg = ""
        if(numberMark) {
            reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/; //验证字符串是否是大于0的数字
        }else {
            reg = /^([0-9]+\.?[0-9]*|-[0-9]+\.?[0-9]*)$/;  //验证字符串是否为全部数字
        }
        if (reg.test(theObj)) {
            return true;
        }
        return false;
    }
};

// 11.3 禁止用微信端以外的浏览器访问
$(function () {
    // 判断URL中的字符串是否包含“wechat”，且保留程序员入口
    if(window.location.href.indexOf("wechat") >= 0 && sq.getHashStringArgs()['debug'] !== '1') {
        let useragent = navigator.userAgent;
        // 对浏览器的UserAgent进行正则匹配，不含有微信独有标识的则为其他浏览器
        if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
            // 这里警告框会阻塞当前页面继续加载
            alert('已禁止本次访问：您必须使用微信内置浏览器访问本页面！');
            // 以下代码是用javascript强行关闭当前页面
            let opened = window.open('about:blank', '_self');
            opened.opener = null;
            opened.close();
        }
    }
})