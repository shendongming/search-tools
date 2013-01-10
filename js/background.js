window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
window.URL = window.URL || window.webkitURL;



 
var image_spider={};
 
  
 
image_spider.on_get_redirect_url=function(request, sender, sendResponse) {

    
    redirect_req.test(request.url);
    redirect_req.add(request.url,function(url2){
       
        sendResponse({
            'url':url2
        });
    })
}

var redirect_req={};

redirect_req.queue={};
redirect_req.cache={};
redirect_req.add=function(url,callback){
    
    if(redirect_req.cache[url]){
        callback(redirect_req.cache[url]);
        return;
    }
    redirect_req.queue[url]=callback;
}

redirect_req.change=function(){
    
    }
redirect_req.test=function(url){
    
    var client = new XMLHttpRequest();
    client.onreadystatechange = redirect_req.change;
    client.open("GET", url);
    
    client.send();
}
redirect_req.ok=function(url,url2){
   
    if(redirect_req.queue[url] ){
   
        redirect_req.queue[url](url2);
        delete redirect_req.queue[url];
    }
    redirect_req.cache[url]=url2;
}


//接受请求的分发器
image_spider.onRequest=function(request, sender, sendResponse) {
    
    var fun='on_'+request.action;
   
    if(image_spider[fun]){

        return image_spider[fun](request, sender, sendResponse);
    }
    console.error('error '+fun);    
}

 
   
  
chrome.webRequest.onBeforeRedirect.addListener(
    function(details) {
        redirect_req.ok(details.url,details.redirectUrl);
    },
    {
        urls: ["http://www.baidu.com/link*"]
    },
    ["responseHeaders"]
    );
 

chrome.extension.onRequest.addListener(image_spider.onRequest);


  
