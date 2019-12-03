/** 
 * 封装ajax步骤：
 * 1.创建XMLHttpRequest对象
 * 2.参数处理
 * 3.设置请求头
 * 4.结果处理
 * 5.发送请求
 */
!function(window, $){

    class Ajax{
        constructor(ct){
            this.url = ct.url;
            this.type = ct.type;
            this.async = ct.async;
            this.contentType = ct.contentType;
            this.dataType = ct.dataType;
            this.data = ct.data;
            this.beforeSend = ct.beforeSend;
            this.complete = ct.complete;
            this.success = ct.success;
            this.error = ct.error;

            this.xhr = this.createXhr();
            let bs = this.handleData().openRequest().setRequestHead();
            if(bs === true){
                this.sendRequest().handleResponse();
            }
                
        }

        //创建xhr对象
        createXhr(){
            let xhr;
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest();
            } else {
                xhr = ActiveXObject("Microsoft.XMLHTTP");
            }
            return xhr;
        }

        //参数处理
        handleData(){
            let type = this.type.toLowerCase()
            if(type === "post"){
                this.data = JSON.stringify(this.data);
            } else if (type === "get"){
                this.url += "?";
                for(let key in this.data){
                    this.url += key + "=" + this.data[key];
                }
            }
            return this;
        }

        openRequest(){
            this.xhr.open(this.type, this.url, this.async);
            return this;
        }

        sendRequest(){
            this.xhr.send(this.data);
            return this;
        }

        //设置对象头
        setRequestHead(){
            this.xhr.setRequestHeader("Content-Type",this.contentType);
            return this.beforeSend(this.xhr);
        }
        //处理结果
        handleResponse(){
            let that = this;
            this.xhr.onreadystatechange = function(){
                if(this.readyState === 4){
                    that.complete(that.xhr);//请求完成之后回调
                    let res;
                    if(that.dataType === "json"){
                        res = JSON.parse(this.responseText);
                    }else if(that.dataType === "xml"){
                        res = this.responseXML;
                    }else{
                        res = that.xhr.responseText;
                    }

                    if(this.status != 200){
                        that.error(statusText);
                    }else{
                        that.success(res);
                    }
                }
            }
        }
        
    }

    window.ajax = function(args){
        //处理参数
        let content = $.extend(true,{},window.ajax.defaults,args);
        return new Ajax(content);
    }

    //设置ajax默认值
    window.ajax.defaults = {
           "url":"",
           "type":"get",
           "async":true,
           "contentType":"application/json",//发给服务器的数据类型
           "dataType":"json",//响应的数据类型
           "data":{},
           "beforeSend":(xhr)=>{
            // 发送之前可修改xmlhttprequest对象，如自定义http头
            //返回false取消ajax请求
                return true;
           },
           "complete":(xhr)=>{
            //请求完成后回调函数
           },
           "error":(err)=>{
            //请求错误回调函数
           },
           "success":(data)=>{
            
           }
    }

}(window, jQuery);


// example
/** 
    ajax({
           "url":"http://127.0.0.1:3000/backend/template/getAllTemplate",
           "type":"get",
           "async":true,
           "contentType":"application/json",
           "dataType":"json",
           "data":{"id":1},
           "success":function(data){
               console.log(data);
               
               if(data && data.status && data.status === 200){
                 $("div").append(JSON.stringify(data.result));
               }else{
                 $("div").append(data.message);
               }
           }
        });
 */