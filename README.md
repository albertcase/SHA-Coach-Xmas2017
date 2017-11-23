# SHA-Coach-Xmas2017`s API

##备注
```
1.domain/home.html ：入口文件
2.domain/game ：游戏 
	- /template/play.tpl.php : 第一玩的模版
	- /template/repaly.tpl.php : 非第一次玩的模版
3.domain/share : 分享页面
	- /template/share.tpl.php : 分享模版
4.API list
	- 1.domain/api/record :提交游戏成绩
	- 2.domain/api/omg/topten :未授权下拉取排行榜（仅有前十名数据）
	- 3.domian/api/topten :授权下拉取排行榜（前十名+自己的成绩）
5.JSSDK 
	- http://coach.samesamechina.com/api/v1/js/{jssdkid}/wechat
6.模拟登陆
	- http://127.0.0.1:9123/wechat/curio/callback?openid=123
```

### 1. 提交成绩API

Method: POST

##### API URL:

```html
domian/api/record
```
##### Get Parameter

records: 144122(时间戳)

```javascript
{
	records: 144.122
}
```

##### Response

##### status 1

```javascript
{
    status: '1',
    msg: '成绩保存成功！',
}
```

#####  status 0

```javascript
{
    status: '0',
    msg: '成绩保存失败！',
}
```

---

### 2.未授权下拉取排行榜

Method: POST ／ GET

##### API URL:

```html
domian/api/omg/topten
```
##### Get Parameter

null

```javascript
{
	
}
```

##### Response

##### status 1

```javascript
[
  {
    "nickname": "a",
    "records": "2分3秒38毫秒"
  },
  {
    "nickname": "b",
    "records": "2分6秒34毫秒"
  }
]
```

---

### 3.授权下拉取排行榜

Method: POST / GET

##### API URL:

```html
domian/api/topten
```
##### Get Parameter

null

```javascript
{
	
}
```

##### Response

##### status 1

```javascript
{
  "topten": [
    {
      "nickname": "a",
      "records": "2分3秒28毫秒"
    },
    {
      "nickname": "b",
      "records": "2分6秒34毫秒"
    }
  ],
  "myRecord": "2分3秒28毫秒",
  "myNum": "0"
}
```
