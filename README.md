# SHA-Coach-Xmas2017`s API

### 1. 提交成绩API

Method: POST

##### API URL:

```html
domian/api/recode
```
##### Get Parameter

times: 144122(时间戳)

```javascript
{
times: 144122
}
```


##### Response

##### status 1

```javascript
{
    status: '1',
    msg: '成绩刷新成功！',
}
```

#####  status 0

```javascript
{
    status: '0',
    msg: '成绩刷新失败！',
}
```

#####  status 2

```javascript
{
    status: '0',
    msg: '低于最佳成绩',
}
```

---

### 2.jssdk分享
```
http://coach.samesamechina.com/api/v1/js/{jssdkid}/wechat
```