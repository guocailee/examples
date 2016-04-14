import md5 from 'js-md5'

export default {
  /**
   * 微信连Wi-Fi协议3.1供运营商portal呼起微信浏览器使用
   */
  Wechat_GotoRedirect: function (appId, extend, timestamp, sign, shopId, authUrl, mac, ssid, bssid) {
    // 将回调函数名称带到服务器端
    var url = 'https://wifi.weixin.qq.com/operator/callWechatBrowser.xhtml?appId=' + appId + '&extend=' + extend + '&timestamp=' + timestamp + '&sign=' + sign
      // 如果sign后面的参数有值，则是新3.1发起的流程
    if (authUrl && shopId) {
      url = 'https://wifi.weixin.qq.com/operator/callWechat.xhtml?appId=' + appId + '&extend=' + extend + '&timestamp=' + timestamp + '&sign=' + sign + '&shopId=' + shopId + '&authUrl=' + encodeURIComponent(authUrl) + '&mac=' + mac + '&ssid=' + ssid + '&bssid=' + bssid
    }

    // 通过dom操作创建script节点实现异步请求
    var script = document.createElement('script')
    script.setAttribute('src', url)
    document.getElementsByTagName('head')[0].appendChild(script)
  },
  callWechatBrowser: function () {
    var timestamp = new Date().getTime()
    var md5str = 'wx786a69f832f19144' + 'demoNew' + timestamp + '' + '7744299' + 'http://10.10.0.1:8088/wifidog/auth_weixin' + 'aa:aa:aa:aa:aa:aa' + 'WX_Wifi-World' + 'ff:ff:ff:ff:ff:ff' + 'ea7fab6d83a5ace7efcc9425e9190065'
    var md5Value = md5(md5str)
    this.Wechat_GotoRedirect('wx786a69f832f19144', 'demoNew', timestamp, md5Value, '7744299', 'http://10.10.0.1:8088/wifidog/auth_weixin', 'aa:aa:aa:aa:aa:aa', 'WX_Wifi-World', 'ff:ff:ff:ff:ff:ff')
  }
}
