var config = (function () {
  var serverUrl = 'http://58.23.16.163:8088/';
  var baseUrl = 'http://10.10.0.1:8088/';
  return {
    api: {
      getAdResource: serverUrl + 'portMgt/backstageJson/Advert_getOnShlefAdvert.do',
      getSceneCode: serverUrl + 'portMgt/app/MP_Scene_getDeviceSceneRel.do?',
      adPlayRecord: serverUrl + 'portMgt/backstageJson/Advert_addAdvertPlayRecord.do?',
      adClick: serverUrl + 'portMgt/backstageJson/Advert_clickAdvertRecord.do',
      // /portMgt/pws/ConnectInfo_onlineRecord.do?pwsConnectInfoId=*
      postOnlineRecord: serverUrl + 'portMgt/pws/ConnectInfo_onlineRecord.do',
      // portMgt/pws/ConnectInfo_visitRecord.do?pwsId=*&sceneCode=*&mobile=*&macAddress=*
      visitRecord: serverUrl + 'portMgt/pws/ConnectInfo_visitRecord.do',
      getMacIP: baseUrl + 'p2pMgt/Ad_getMacIp.do',
      getPwsId: baseUrl + 'p2pMgt/Ad_getPwsId.do',
      sendVisit: baseUrl + 'wifidog/send_visit?',
      authOnekey: baseUrl + 'wifidog/auth_onekey',
      authTemp: baseUrl + 'wifidog/auth_temporary'
    }
  };
})();
