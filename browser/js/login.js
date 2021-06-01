function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

var wlanuserip = getQueryString("wlanuserip")
var wlanacip = getQueryString("wlanacip")

function login() {
  var username = $("#username").val();

  if (username == "") {
    alert("请输入上网帐号，@后面去掉");
    $("#username").focus();
    return;
  }

  var password = $("#password").val();

  if (password == "") {
    alert("请输入密码");
    $("#password").focus();
    return;
  }

  var code = $("#code").val();

  console.log(code)

  if (code == "") {
    alert("请输入验证码");
    $("#code").focus();
    return;
  }

  setMaxDigits(200);
  var key = new RSAKeyPair("10001", "", "b2867727e19e1163cc084ea57b9fa8406a910c6703413fa7df96c1acdca7b983a262e005af35f9485d92cd4c622eca4a14d6fd818adca5cae73d9d228b4ef05d732b41fb85f80af578a150ebd9a2eb5ececb853372ca4731ca1c8686892987409be3247f9b26cae8e787d8c135fc0652ec0678a5eda0c3d95cc1741517c0c9c3");
  var loginKey = encryptedString(key, '{"userName":"' + username + '","password":"' + password + '","rand":"' + code + '"}');

  $.ajax({
    type: 'POST',
    url: '/ajax/login',
    cache: false,
    data: {
      loginKey: loginKey,
      wlanuserip: wlanuserip,
      wlanacip: wlanacip
    },
    dataType: 'json',
    success: function (data) {
      if (data.resultCode == "0" || data.resultCode == "13002000") {
        $("#login").css('display', 'none')
        $("#success").css('display', 'block')
      } else if (data.resultCode == "13018000") {
        alert("已办理一人一号多终端业务的用户，请使用客户端登录")
      } else {
        console.log(data)
        alert(data.resultInfo)
      }
    }
  });

}

function logout() {
  $.ajax({
    type: 'POST',
    url: '/ajax/logout',
    cache: false,
    data: "wlanuserip=" + wlanuserip + "&wlanacip=" + wlanacip,
    dataType: 'json',
    success: function (data) {
      if (data.resultCode == "0") {
        alert("下线成功");
      } else {
        alert(data.resultInfo);
      }

      window.location.reload();
    }
  });
}