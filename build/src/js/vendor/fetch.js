// fetch.js


function generateEncryptedString(data, password) {
    var CryptoJSAesJson = {
        stringify: function (cipherParams) {
            var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
            if (cipherParams.iv) j.iv = cipherParams.iv.toString();
            if (cipherParams.salt) j.s = cipherParams.salt.toString();
            return JSON.stringify(j);
        },
        parse: function (jsonStr) {
            var j = JSON.parse(jsonStr);
            var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
            if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
            if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
            return cipherParams;
        }
    }
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), password, {format: CryptoJSAesJson}).toString();
    return encrypted;
}

function ajaxFun(type, url, data, callback, dataType){
	
	$.ajax({  // records:游戏成绩 animal:动物 bar:跳过几个障碍物
        type: type,
        url: url,
        cashe: 'false',
        data: data,
        dataType: dataType
    }).done(function(data){
    	if(data.status != 0){
    		callback(data)
    	}else{
        console.log(data);
      }
    })
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
  var generateEncryptedStringDATA = generateEncryptedString('{"records": '+ data.records +', "animal": '+ data.animal +', "bar": '+ data.bar +', "timeinit": '+ data.timeinit +'}', 'abc123');
	ajaxFun('POST', '/api/record', generateEncryptedStringDATA, callback, 'text')
}

/* 
null
*/
Fetch.prototype.authorize = function({}, callback){  // 授权下拉取排行榜API
	ajaxFun('GET', '/api/topten', {}, callback, 'json')
}

/* 
null
*/
Fetch.prototype.noAuthorize = function({}, callback){  // 未授权下拉取排行榜API
	ajaxFun('GET', '/api/omg/topten', {}, callback, 'json')
}
	
/* 
null
*/
Fetch.prototype.getCard = function({}, callback){  // 获取卡券
  ajaxFun('GET', '/api/card', {}, callback, 'json')
}

Common.prototype.fetch = new Fetch();








