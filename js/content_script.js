
if(location.toString().indexOf('baidu.com')>-1){
    var links=document.querySelectorAll('h3.t a');
    for(var i =0;i<links.length;i++){
        var a=links[i];
        (function(a){
            
            chrome.extension.sendRequest({
                'action':'get_redirect_url',
                'url':a.href
                },function(response){
                    
                    var a2=document.createElement('a');
                        a2.href=response.url;
                        a2.setAttribute('title',a.href);
                        a2.target='_blank';
                        a2.innerHTML=response.url;
                        a2.style.cssText='margin:5px;color:blue;padding-left:20px;font-weight:bold;clear:both;display:block'
                        a.parentNode.appendChild(a2)
                })
        })(a);
        
    }
}
if(location.toString().indexOf('google.com')>-1){
    var links=document.querySelectorAll('h3.r a');
    for(var i =0;i<links.length;i++){
        var a=links[i];
        var info=util.parse_url(a.href,location.toString());
        
        var a2=document.createElement('a');
        a2.href=a.href;
        a2.setAttribute('title',a.href);
        a2.target='_blank';
        a2.innerHTML=a.href;
        a2.style.cssText='margin:5px;color:blue;padding-left:20px;font-weight:bold;clear:both;display:block'
        a.parentNode.appendChild(a2)
        console.log(info);
    }
}

