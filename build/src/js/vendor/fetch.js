// fetch.js

function ajaxFun(type, url, data, callback){
	
	$.ajax({  // records:游戏成绩 animal:动物 bar:跳过几个障碍物
        type: type,
        url: url,
        data: data,
        dataType: 'json'
    }).done(function(data){
    	console.log(data);
    	if(data.status == 1){
    		callback(data)
    	}
    }).fail
}


function Fetch(){}


/* 
{
  records: record,
  animal: animal,
  bar: bar
}
*/

Fetch.prototype.record = function(data, callback){
	ajaxFun('POST', 'domian/api/record', data, callback)
}

/* 
null
*/
Fetch.prototype.authorize = function({}, callback){  // 授权下拉取排行榜API
	ajaxFun('GET', 'domian/api/topten', {}, callback)
}

/* 
null
*/
Fetch.prototype.noAuthorize = function({}, callback){  // 未授权下拉取排行榜API
	ajaxFun('GET', 'domian/api/omg/topten', {}, callback)
}
	
