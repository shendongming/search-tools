/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function log (msg) {
    var  time=function(){
        var now = new Date()
        return [now.getFullYear(),now.getDate(),now.getMonth() + 1].join('-')
        +[now.getHours(),now.getMinutes(),now.getTime() % 60000/1000].join(':');
    }
    try{
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage('['+time()+'] ' + msg);

    }catch(e){
    }
}

var util={};
util.each = function(array,fun){
    for(var i =0;i<array.length;i++){
        fun(array[i]);
    }
};

util.is_empty=function(obj){
    if(typeof obj=='object'){
        if(obj instanceof Array){
            if( obj.length>0){
                return false;
            }else{
                return true;
            }
        }
        for(var i in obj){
            return false;
        }
        return true;

    }
    return obj?false:true;
}
//test
//alert(is_empty([])==1);
//alert(is_empty([1,2])==0);
//alert(is_empty(0)==1);
//alert(is_empty({})==1);
//alert(is_empty({"a":"a"})==0);
util.copy=function(d){
    if(typeof(d)!='object'){
        return d;
    }
    var t;
    if(d instanceof Array){
        t=[];
    }else{
        t={};
    }
    for(var i in d){
        t[i]=util.copy(d[i]);
    }
    return t;
}
//alert('test copy');
//test copy
//alert('1'==util.copy('1'));
//a={'a':1};
//b=util.copy(a)
//a['a']=2;
//alert(b['a']==1);

util.trim=function(s,c){
    // 用正则表达式将前后空格
    // 用空字符串替代。
    if(!s){
        return '';
    }
    if(!c){
        c='\s';
    }
    var r='^('+c+'*)|('+c+'*)$';

    return s.replace(/(^\s*)|(\s*$)/g,   "");
}

String.prototype.trim= function(){
    // 用正则表达式将前后空格
    // 用空字符串替代。
    return util.trim(this.toString());
}

//获取url的顶级域名 
util.super_domain=function(url){
    var vdomain=".com.cn|.net.cn|.org.cn|.gov.cn".split('|');
    var p='http://,https://,ftp://'.split(',')
    url=url.toString().toLowerCase();
    var is_find=0;
    for(var i=0;i <p.length;i++){
        if(url.substring(0,p[i].length)==p[i]){
            url=url.substring(p[i].length);
            is_find=1;
            break;
        }
    }
    if(!is_find){
        //非法 协议 返回空
        return '';
    }
    var pos=url.indexOf('/');
    if(pos>-1){
        url=url.substring(0,pos);
    }
    
    //ip地址
    var r=/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/;
    if(r.test(url)){
        return url;
    }
    var c=2;
    for(var i=0;i<vdomain.length;i++){
        if(url.indexOf(vdomain[i])>0){
            //域名后面有.gov.cn com.cn
            c=3;
        }
    }
    var arr=url.split('.');
    if(arr.length<2 || arr.length<c){
        return url;
    }
    var t=[];
    for(var i=0;i<c;i++){
        //alert([arr.length-c-1+i,c,i]);
        t.push(arr[arr.length-c+i]);
    }
    return t.join('.');

}
util.parse_url=function(url,base_url){
    //http://,https://
    var r1=new RegExp('^http[s]*:[/]+([a-z0-9A-Z\\-_\.]+)(.*)','ig');
    //绝对路径
    var info={
        'domain':'',
        'path':''
    };
    if(r1.test(url)){
        
        info['path']=RegExp.$2;
        info['domain']=RegExp.$1;

    }else{
        info['path']=url;
        info['domain']='';
    }
    
    //alert([ 'url:',url,  'domain:',info['domain'],'path:',info['path']]);
    return info;
}

util.URLParser = function(url) {

    this._fields = {
        'Username' : 4,
        'Password' : 5,
        'Port' : 7,
        'Protocol' : 2,
        'Host' : 6,
        'Pathname' : 8,
        'URL' : 0,
        'Querystring' : 9,
        'Fragment' : 10
    };

    this._values = {};
    this._regex = null;
    this.version = 0.1;
    this._regex = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;
    for(var f in this._fields)
    {
        this['get' + f] = this._makeGetter(f);
    }

    if (typeof url != 'undefined')
    {
        this._parse(url);
    }
}
util.URLParser.prototype.setURL = function(url) {
    this._parse(url);
}

util.URLParser.prototype._initValues = function() {
    for(var f in this._fields)
    {
        this._values[f] = '';
    }
}

util.URLParser.prototype._parse = function(url) {
    this._initValues();
    var r = this._regex.exec(url);
    if (!r) throw "DPURLParser::_parse -> Invalid URL";

    for(var f in this._fields) if (typeof r[this._fields[f]] != 'undefined')
    {
        this._values[f] = r[this._fields[f]];
    }
}
util.URLParser.prototype._makeGetter = function(field) {
    return function() {
        return this._values[field];
    }
}
//test
//var url = 'http://user:password@www.jb51.net:1234/test/test.asp?id=1#test';
//var p = new util.URLParser(url);
//document.write("<strong>URL:</strong> " + url + "<br>");
//document.write("解析结果如下：<br>");
//document.write("<strong>协议:</strong> " + p.getProtocol() + "<br>");
//document.write("<strong>用户:</strong> " + p.getUsername() + "<br>");
//document.write("<strong>密码:</strong> " + p.getPassword() + "<br>");
//document.write("<strong>主机:</strong> " + p.getHost() + "<br>");
//document.write("<strong>端口:</strong> " + p.getPort() + "<br>");
//document.write("<strong>路径:</strong> " + p.getPathname() + "<br>");
//document.write("<strong>查询字符串:</strong> " + p.getQuerystring() + "<br>");
//document.write("<strong>锚点:</strong> " + p.getFragment() + "<br>");

util.check_url=function(url){
    //空串不通过
    url=url.split('#')[0]
    if(!url || ! util.trim(url) ){
        return  0;
    }
    return util.filter_url(url);
}
util.check_url_type=function(url){
    //todo
    }

util.get_links=function(html,base_url)    {
    //控制全局排重的url列表
    var result={};
    var links=[];
    var div=document.createElement('div');
    div.innerHTML=html;
    links=util.get_a(div,base_url,result);

    for(var t=0;t<links.length;t++){
        var v=links[t];
        links[t]={'url':v[1],'text':v[0]}
    }
    return links;

}
/**
 * 得到一个元素下面的所有的节点 的连接
 * 过滤重复的包括 #  这个url直接去掉 
 */
util.get_a=function(ele,base,get_obj){
    var link=[];
    var n=ele.getElementsByTagName('a');
    //过滤重复的url
    var a_map={};
    //当时的对象也要获取
    var base_domain=util.super_domain(base);
    for(var i=0;i<n.length;i++){
        //跳过
        if(! util.check_url(n[i].href)){
            continue;
        }
        var t=util.absurl(base,n[i].href).split('#')[0];
        var t_domain=util.super_domain(t);
        //跳过
        if (t_domain!=base_domain){
            continue;
        }
        //已经存在的就不覆盖了,有文字的会被优先保留
        if(! a_map[t]){
            a_map[t]=util.trim(n[i].textContent);
        }
        
        if(get_obj){
            try{
                get_obj[t]=1;
            }catch(e){
                
            }
        }
    }

    for(var url in a_map){
       
        link.push([a_map[url],url]);
        
    }


    return link;
}
//自动分析url的模式
util.parse_group=function(urls){

    }

util.dump=function(obj){
    var s=[];
    for(var i in obj){
        try{
            s.append(i+'='+obj[i]);
        }catch(e){

        }
    }
    log(s.join("\n"));
}
util.clear_table=function(table_child){
    if(!table_child){
        alert('表格是空的');
        return;
    }
    while(table_child.childNodes.length>0){
        table_child.removeChild(table_child.childNodes[0]);
    }
}

util.fill_table=function(doc,table_child,arr){
    for(var i=0;i<arr.length;i++){

        var item=doc.createElement('treeitem');
        var row=doc.createElement('treerow');
        for(var j=0;j<arr[i].length;j++){
            var c1=doc.createElement('treecell');
            c1.setAttribute('label', arr[i][j]);
            c1.setAttribute('tooltiptext', arr[i][j]);
            row.appendChild(c1);
        }
        item.appendChild(row);
        table_child.appendChild(item);
    }
}
util.fill_url_table=function(doc,table_child,arr){
    for(var i=0;i<arr.length;i++){

        var item=doc.createElement('treeitem');
        var row=doc.createElement('treerow');
        //alert(arr[i]);
        var url=arr[i][1];
        var url_info=util.parse_url(url);
        arr[i][1]=url_info['path'];
        arr[i][2]=url_info['domain'];
        //abs url
        arr[i][3]=url;
 

        for(var j=0;j<arr[i].length;j++){
            var c1=doc.createElement('treecell');
            c1.setAttribute('label', arr[i][j]);
            c1.setAttribute('tooltiptext', arr[i][j]);
            row.appendChild(c1);
        }
        item.appendChild(row);
        table_child.appendChild(item);
    }
}

util.copy=function(d){
    if(typeof(d)!='object'){
        return d;
    }
    var t;
    if(d instanceof Array){
        t=[];
    }else{
        t={};
    }
    for(var i in d){
        t[i]=util.copy(d[i]);
    }
    return t;
}


/**
 * 测试一个元素是否是一个链接
 */

util.is_link=function(e){
    if(e && e.tagName.toLowerCase()=='a' && e.href.substring(0,1)!='#' &&  e.href!='' && e.href.substring(0,'javascript:'.length).toLowerCase()!='javascript:'){
        return 1;
    }
    return 0;
}
util.absurl=function(base,url){

    var   _url=   function  (p)   {
        if(p.indexOf("/")<0)return p;
        var v=p;
        // 处理./ 注意，./可能在开头，也可能是中间/./，还有结尾/.
        v=v.replace(/^\.\//img, "");//开头
        v=v.replace(/\/\.(?=\/|$)/img, "");//中间和结尾
        // 处理../ 注意，../可能在开头，此时不附合
        //开头和中间 Gen/../
        while(/\w+?\/\.\.\//.test(v))  {
            v=v.replace(/\w+?\/\.\.\//img, "");
        }
        //结尾
        while(/\/\w+?\/\.\.$/.test(v))     {
            v=v.replace(/\/\w+?\/\.\.$/img, "");
        }
        return v;
    }
    //直接就是绝对路径
    if(url.toString().toLowerCase().substring(0,7)=='http://' || url.toString().toLowerCase().substring(0,8)=='https://'){
        return url;
    }
    base=base.toString();
    //需要去掉参数 和 ＃
    base=base.split('#')[0].split('?')[0];
    var pos=base.lastIndexOf('/');

    if(pos==-1 || pos<8){
        
        //没有/结尾的域名
        base=base+'/';
        pos=base.length;
    }
    var url_path=base.substring(0,pos+1);
    //得到 比如 http://g.cn/map/
    //跳过http://
    var path_pos=url_path.indexOf('/',8);
    var path='/';
    var host_url=url_path;
    if(path_pos>-1){
        path=url_path.substring(path_pos,url_path.length);
        host_url=url_path.substring(0,path_pos);
    }
    if(url.substring(0,1)=='/'){
        return  url_path+url;
    }else{ 
        return host_url+_url(path+url);
    }


}
//test
//alert(util.absurl('http://g.cn','aa'));
//alert(util.absurl('http://g.cn/a/','aa'));

util.request_json=function(url,param,method,callback){
    var txt=util.request(url,param,method,function(txt){
        var d={};
        try{
            if(txt){
                eval('d='+txt);
                callback(d);
            }else{
                //alert('服务器返回空');
            }
        }catch(e){
            d.errmsg=e.toString();
            log('get json obj error:'+e);
            alert('获取数据出错了');
        }
    });   
    return 1;
}
/**
 * 所有的请求改成异步的
 * 改动有点大 相关改动较多
 **/
util.request=function(url,param,method,callback){
    url=url.substring(0, 10)+url.substring(10,url.length).replace('//','/');
    if(!method){
        method='GET';
    }
    if(param){
        method='POST'
    }else{
        param={};
    }
    
    method=method.toUpperCase();
    var xmlHttp=new XMLHttpRequest();
    xmlHttp.onreadystatechange=function(r){
        if (xmlHttp.readyState==4){            
            log('post:'+url+' response:'+xmlHttp.responseText);
            if(xmlHttp.status!='200'){
                alert('请求'+url+' 出错了 服务器状态: STATUS '+xmlHttp.status+' TEXT: '+xmlHttp.statusText+'  请查看错误日志');
                log('detail:'+xmlHttp.responseText);
                return xmlHttp.responseText;
            }
            if(callback){

                try{
                    callback(xmlHttp.responseText);
                }catch(e){
                    log('callback error:'+e);
                }
            }

        }
    }
    var content='';
    var content_t=[];
    if(method=='POST'){
        for(var k in param){
            content_t.push(k+'='+encodeURIComponent(param[k]))
        }
        content=content_t.join('&');
    }
    //alert(content);
    log('request:'+method+' url:'+url+'  param:'+content)

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-Length", content.length);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    try{
        xmlHttp.send(content);
    }catch(e){
        alert('请求'+url+' 失败 '+e);
        return '';
    }
    return 1;
    if(xmlHttp.status!='200'){
        alert('请求'+url+' 出错了 服务器状态: STATUS '+xmlHttp.status+' TEXT: '+xmlHttp.statusText+'  请查看错误日志');
        log('detail:'+xmlHttp.responseText);
        return xmlHttp.responseText;
    }
    log(['post:',url,'param:',content,'result:',xmlHttp.responseText].join("\t"));
    return xmlHttp.responseText;
}

/**
 * 得到当前选择的url
 */
util.get_sel_url=function(){

    }

util.showbox=function(ele,box_id){
    var doc=ele.ownerDocument;
    var box=doc.getElementById(box_id);
    if(!box){
        return false;
    } 
    var box_close_a_id=box_id+'_close';

    var close_a=doc.getElementById(box_close_a_id);
    box.style.top=20+'px';
    box.style.left=1+'px';
    box.style.position='fixed';
    //box.style.backgroundColor='#ffffff';
    
    /*close_a.style.position='fixed';
    close_a.style.color='red';
    close_a.style.top=box.offsetTop+25+'px';
    close_a.style.left=0+box.offsetLeft+35+'px';
     */
    //alert(box.offsetLeft+box.offsetWidth-60+'px')
    //box.style.paddingTop='12px';
    box.style.display='block';

//alert(ele.parentNode.innerHTML);


    
}
util.closebox=function(ele,box_id){
    var doc=ele.ownerDocument;
    var box=doc.getElementById(box_id);
    if(box){
        box.style.display='none';
        return false;
    }
}



util.get_select_html=function () {
    var rng=null,html="";
    if (window.document.selection && window.document.selection.createRange){
        rng=window.document.selection.createRange();
        html=rng.htmlText;
        //send_event(html);
        return html;
    }else if (window.getSelection){
        rng=window.getSelection();
        if (rng.rangeCount > 0 && window.XMLSerializer){
            rng=rng.getRangeAt(0);
            //alert(rng.cloneContents());
            html=new XMLSerializer().serializeToString(rng.cloneContents());
            //send_event(html);
            return html
        }
    }
}

util.view_html=function(html){
    document.createElement('div');
    
}

util.uniq_array=function(arr){
    if(!arr){
        return arr;
    }
    var t={}
    for(var i=0;i<arr.length;i++){
        if(t[arr[i]]){
            continue;
        }
        t[arr[i]]=[arr[i]];
    }
    var r=[];
    for(var v in t){
        r.push(t[v][0]);
    }
    return r;

/*
    #  var o = {};
#             for (var i = 0; i < array.length; i++) {
#                 o[array[i]] = array[i];
#             }
#             array = [];
#             for(var el in o) {
#                 if (el == o[el]) {
#                     array.push(el - 0);
#                 }
#             }
*/
}


util.innerText=function(div){
    var s = "";
    var n = div.childNodes;
    for(var i=0; i<n.length; i++) {
        if(n[i].nodeType==1){
            var t=n[i].tagName.toUpperCase();
            if(t=='BR' || t=='HR'){
                s+="\n";
                continue;
            }
            if(t=='TR'){
                s+="\n";
            }
            if(t=='TD'){
                s+="\t";
            }
            
            s += util.innerText(n[i]);
        }
        else if(n[i].nodeType==3){
            //alert(n[i].nodeValue);
            s += n[i].nodeValue;
        }
    }
    //去掉连续的空行 前后空格
    s=util.trim(s.replace(new RegExp('([ \t]*[\n\r]+)+','img'),'\n'));    
    return s;
}

/**
 * 把光标移动到文本的末尾
 */

util.move_text_end=function(input){
    var p=input.value.length;
    input.setSelectionRange(p,p);
    return ;
}
util.set_value=function(input,value){
    input.value=value;
    try{
        input.setAttribute('tooltiptext', value);
    }catch(e){
        log('util.set_value err'+e)
    }
    return input.value;
}

/**
 * 随机生成一个id
 */

util.rand_id=function(){
    var id='id_'+Math.random();
    id=id.replace('0.','');
    return id;
}

//util={};
util.obj=function(obj,arr,value){
    var k=arr[0];
    for(var i=0;i<arr.length-1;i++){
        k=arr[i+1];
        //alert(k);
        if(obj[arr[i]]===undefined){
            obj[arr[i]]={};
        }
        obj=obj[arr[i]];
    }
    obj[k]=value;
    return obj;
}
util.filter_config={
    'ok_ext':'jsp,asp,php,php3,php4,html,shtml,html,pl,cgi,aspx',
    'err_ext':'swf,txt,pdf,js,css,cab,jpg,png,bmp,gif,asf,wmv,wma,mp3,mv,mov,doc,docx,rtf,xml,exe,rar,tar.gz,tar,zip,7z,chm,xpi,xls,mdb,bak,bin,cad,class,dat,'
}

util.filter_url=function(url){
    var url2=url.toString().toLowerCase();
    var http_name=url2.split(':',2);
    //如果是绝对路径协议必须是http协议的
    if(http_name.length==2 && http_name[0]!='http'  &&  http_name[0]!='https'){
        return false;
    }
    // http:/sss.ss.com/a.asp?id=455#aaa

    var ext=url2.split('#')[0].split('?')[0].split('/').pop().split('.');//.pop();
    var ext_name='';
    if(ext.length>1){
        ext_name=ext.pop();
    }else{
        //没有扩展名 ok
        return true;
    }
    var err_arr=util.filter_config['err_ext'].split(',');
    for(var i=0;i<err_arr.length;i++){
        if(err_arr[i]==ext_name){
            //在黑名单失败
            return false;
        }
    }
    /**
     * @todo 在白名单中找不到的 需要记录下 便于改进
     */
    return true;
    
}

/**
 * 将一个对象插入的尾部，如果已经存在移动到尾部
 * @example
 *
a=[1,2,3]
[1, 2, 3]
a.insert_last(2)
[1, 3, 2]
a.insert_last(4)
[1, 3, 2, 4]
a.insert_last(5)
[1, 3, 2, 4, 5]
a.insert_last(1)
[3, 2, 4, 5, 1]
a.insert_last(2)
[3, 4, 5, 1, 2]
a.insert_last(6)
[3, 4, 5, 1, 2, 6]
a=[1,2]
[1, 2]
a.insert_last(1)
[2, 1]
a.insert_last(3)
[2, 1, 3]
a.insert_last({'a':1})
[2, 1, 3,
Object
]
a.insert_last({'a':1})
[2, 1, 3,
Object
a: 1
__proto__: Object
,
Object
a: 1
__proto__: Object
]
a.insert_last({'a':1,'hashkey':1})
[2, 1, 3,
Object
a: 1
__proto__: Object
,
Object
a: 1
__proto__: Object
,
Object
a: 1
hashkey: 1
__proto__: Object
]
a.insert_last({'a':1,'hashkey':2})
[2, 1, 3,
Object
a: 1
__proto__: Object
,
Object
a: 1
__proto__: Object
,
Object
a: 1
hashkey: 1
__proto__: Object
,
Object
a: 1
hashkey: 2
__proto__: Object
]
a.insert_last({'a':4,'hashkey':1})
[2, 1, 3,
Object
a: 1
__proto__: Object
,
Object
a: 1
__proto__: Object
,
Object
a: 1
hashkey: 2
__proto__: Object
,
Object
a: 4
hashkey: 1
__proto__: Object
]
 */
Array.prototype.insert_last=function(v){
    var t,pos;
    for(var i=0;i<this.length;i++){
        t=this[i];
        if(v==t){
            this.splice(i, 1);
            break;
        }
        //如果存在hashkey,用于对象之间比较用的
        if(v.hashkey && t.hashkey && v.hashkey == t.hashkey){
            this.splice(i, 1);
            break;
        }
    }
    this.push(v)
    return this;
}



util.insert_last=function(arr,v){
    var t,pos;
    for(var i=0;i<arr.length;i++){
        t=arr[i];
        if(v==t){
            arr.splice(i, 1);
            break;
        }
        //如果存在hashkey,用于对象之间比较用的
        if(v.hashkey && t.hashkey && v.hashkey == t.hashkey){
            arr.splice(i, 1);
            break;
        }
    }
    arr.push(v)
    return arr;
}
