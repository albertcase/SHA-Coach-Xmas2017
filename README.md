# SHA-Coach-Xmas2017`s API

##备注
```
1.domain/home.html ：入口文件
2.domain/game ：游戏 
	- /template/play.tpl.php : 游戏模版
3.domain/share/gameid (路由会在提交成绩成成功之后返回share_url字段)
	- /template/isplay.tpl.php :自己
  - /template/share.tpl.php :非自己 【$userInfo['nickname']:昵称， $userInfo['headimgurl']：头像】
4.API list
	- 1.domain/api/record :提交游戏成绩
	- 2.domain/api/omg/topten :未授权下拉取排行榜（仅有前十名数据）
	- 3.domian/api/topten :授权下拉取排行榜（前十名+自己的成绩）
5.JSSDK 
	- http://coach.samesamechina.com/api/v1/js/a77f2b6c-bad1-4f28-9fdb-e453787882dd/wechat
6.模拟登陆
	- http://127.0.0.1:9123/wechat/coach/callback?openid=oKCDxjnSxj8QpmCvrjD0V8lb-JyE
```

### 1. 提交成绩API

Method: POST

##### API URL:

```html
domian/api/record
```
##### Get Parameter

records:游戏成绩
animal:动物
bar:吃了几个心

records=144.122&animal=konglong&bar=4

```javascript
{
  records: 144.122,
  animal: konglong,
  bar: 4  
}
```

##### Response

##### status 1

```javascript
{
    status: 1,
    msg: '成绩保存成功！',
    share_url: 'http://xmas2017.coach.samesamechina.com/share/1',
}
```

#####  status 0

```javascript
{
    status: 0,
    msg: '成绩保存失败！',
    share_url: 'http://xmas2017.coach.samesamechina.com/share/1',
}
```

#####  status 2

```javascript
{
    status: 2,
    msg: '您的操作过于频繁！请稍后再试！',
}
```

#####  status 3

```javascript
{
    status: 3,
    msg: '很遗憾！您未刷新成绩！',
    share_url: 'http://xmas2017.coach.samesamechina.com/share/1',
}
```

#####  status 4

```javascript
{
    status: 4,
    msg: '该用户为黑名单用户！',
}
```

#####  status 5

```javascript
{
    status: 5,
    msg: '游戏成绩异常！',
}
```

---

### 2.未授权下拉取排行榜API

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
{
  status : 1,
  msg : '获取成功！'
  list : [
    {
      "nickname": "a",
      "records": "2分3秒38毫秒"
    },
    {
      "nickname": "b",
      "records": "2分6秒34毫秒"
    }
  ]
}
```

##### status 0

```javascript
{
  status : 0,
  msg : '获取失败！'
}
```

---

### 3.授权下拉取排行榜API

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
  "status" : 1,
  'msg' : '获取成功！',
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

##### status 0

```javascript
{
  status : 0,
  msg : '获取失败！'
}
```
