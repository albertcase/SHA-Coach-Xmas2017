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

function Fetch(){}

Fetch.prototype.createAjax = function(type, url, data, callback, dataType){
    $.ajax({  
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

Fetch.prototype.record = function(data, callback){
    var generateEncryptedStringDATA = generateEncryptedString(JSON.stringify(data), '490ce5d064d2eb209dddaa118f7a6831');
	this.createAjax('POST', '/api/record', generateEncryptedStringDATA, callback, 'text')
}

Fetch.prototype.authorize = function(data, callback){                // 授权下拉取排行榜API
    this.createAjax('GET', '/api/topten', data, callback, 'json');
}

Fetch.prototype.noAuthorize = function(data, callback){  // 未授权下拉取排行榜API
	this.createAjax('GET', '/api/omg/topten', data, callback, 'json')
}

Fetch.prototype.getCard = function(data, callback){  // 获取卡券
    this.createAjax('GET', '/api/card', data, callback, 'json')
}

Common.prototype.fetch = new Fetch();








