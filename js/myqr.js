


function MyQr(config){
    this.qr_container=config.qr_container
    this.uuid=config.uuid
    this.qr_url = config.qr_url
    this.check_url = config.check_url
    this.check = config.check
    this.timeout = config.timeout
    this.check_times=typeof config.check_times =='undefined'?60:config.check_times
    this.time_span = typeof config.time_span =='undefined'?1000:config.time_span
    this.timer = null



    this.check_scaned=(refresh_times)=> {
        let url = this.check_url+this.uuid+'&t='+new Date().getTime()
        // let url = this.check_url+this.uuid//+'&t='+new Date().getTime()
        getAjaxDate(url, 'get', '', (rel)=> {
            if (rel.code == 1) {
               if(this.check(rel))return;//如果检查成功，则不用再继续查询
            } else {
                // layer.msg(rel.msg, 1000);
            }
            if(refresh_times<this.check_times) {
                this.timer = setTimeout(()=>{this.check_scaned(refresh_times+1)}, this.time_span)
            }
            else{
                this.qrcode.clear()
                this.timeout()
            }

        },false);
    }

    this.qrcode = new QRCode(document.getElementById(this.qr_container), {
          text: this.qr_url,
          width:280,
          height:280,
          margin:0,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });

    this.start_scan=()=>{ //开始刷新
        this.check_scaned(0)//开始刷新
    }

    this.refresh_url=(url)=>{//更新url
        this.qrcode.clear()
        this.qrcode.makeCode(url);
    }

    this.stop_scan=()=>{
        if(this.timer !=null )
        {
            clearTimeout(this.timer)
            this.timer=null
        }

    }



}