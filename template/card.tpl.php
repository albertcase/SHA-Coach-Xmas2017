<!DOCTYPE html>
<html>
<head>
    <title>Coach玩出趣</title>
    <script type="text/javascript" src="http://coach.samesamechina.com/api/v1/js/a77f2b6c-bad1-4f28-9fdb-e453787882dd/wechat"></script>

</head>
<body>
<div id="test">asfsdfa</div>>
<script type="text/javascript">
document.getElementById("test").addEventListener('click', function(){
    showcard();
})
var cardListJSON = <?php echo json_encode($list);?>;
function showcard() {
     wx.addCard({
        cardList: [{
            cardId: cardListJSON[0].cardId,
            cardExt: '{"timestamp":"'+cardListJSON[0].cardExt.timestamp+'","signature":"'+cardListJSON[0].cardExt.signature+'","openid":"'+cardListJSON[0].cardExt.openid+'","code":"'+cardListJSON[0].cardExt.code+'"}'
        }],
        success: function(res) {
            var cardList = res.cardList;
            //alert(JSON.stringfiy(res));
        },
        fail: function(res) {
            //alert(JSON.stringfiy(res));
        },
        complete: function(res) {
            //alert(JSON.stringfiy(res));
        },
        cancel: function(res) {
            //alert(JSON.stringfiy(res));
        },
        trigger: function(res) {
            //alert(JSON.stringfiy(res));
        }
    });
}
</script>
</body>
</html>
