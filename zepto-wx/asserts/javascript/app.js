(function ($, config, Swiper) {
  if (!$.getJSONP) {
    $.getJSONP = function (url, data, success, fail) {
      $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'jsonp',
        success: success,
        error: fail
      });
    };
  }
  // 存储当前状态信息
  var status = {
    info: {
      pwsId: '31',
      macAddress: '',
      adIds: [],
      ads: [],
      sceneCode: '',
      pwsConnectInfoId: '',
    },
    advertPlayRecordIds: [],
    isFinish: false,
    intervalTime: 0,
    intervalId: 0,
    intervals: []
  };
  var getAdById = function (adId) {
    for (var i = status.info.ads.length - 1; i >= 0; i--) {
      if (status.info.ads[i].ADVERT_ID == adId) {
        return status.info.ads[i];
      }
    }
    return null;

  };

  // 广告点击事件
  var adClick = function (adId) {
    var ad = getAdById(adId);
    if (ad) {
      var advertPlayRecordId = '';
      for (var i = status.advertPlayRecordIds.length - 1; i >= 0; i--) {
        if (status.advertPlayRecordIds[i].ADVERT_ID == ad.ADVERT_ID) {
          advertPlayRecordId = status.advertPlayRecordIds[i].ADVERT_PLAY_RECORD_ID;
        }
      }
      $.getJSONP(config.api.adClick, {
        advertPlayRecordId: advertPlayRecordId
      });
      var url = ad.LINK_URL;
      if (!url) return false;
      if (url && url.indexOf('http://') !== 0) {
        url = 'http://' + url;
        window.open(url, '_blank');
      }
    }
  };
  // 验证通过时调用
  var postOnlineRecord = function () {
    // $('.modal-mask').css('display', 'block');
    $.getJSONP(config.api.postOnlineRecord, {
      pwsConnectInfoId: status.info.pwsConnectInfoId
    }, function (data) {});
    // $('.modal-mask').show();
    window.location.href = 'redirect.html';
  };
  var app = {
    methods: {
      api: {
        // 获取基站ID
        getPwsId: function (callback) {
          $.getJSONP(config.api.getPwsId, {}, function (data) {
            status.info.pwsId = data.data.result;
            callback(data);
          }, function () {
            callback();
          });
        },
        // 获取广告资源
        getAdResource: function (callback) {
          $.getJSONP(config.api.getAdResource, {
            pwsId: status.info.pwsId
          }, function (data) {
            status.info.ads = data.resultList;
            callback(status.info.ads);
          }, function () {
            callback();
          });
        },
        // 查看广告时触发
        viewAd: function (adId) {
          var ad = getAdById(adId);
          if (ad) {
            $.getJSONP(config.api.adPlayRecord, {
              advertId: adId,
              pwsId: status.info.pwsId,
              macAddress: status.info.macAddress
            }, function (data) {
              status.advertPlayRecordIds.push({
                ADVERT_PLAY_RECORD_ID: data.resultList[0].ADVERT_PLAY_RECORD_ID,
                ADVERT_ID: adId
              });
            });
          }
        },
        // 得到MAC地址
        getMacIP: function (callback) {
          $.getJSONP(config.api.getMacIP, {
            pwsId: status.info.pwsId
          }, function (data) {
            status.info.macAddress = data.data.mac;
            status.info.ip = data.data.ip;
            callback(data);
          }, function (data) {
            callback(data);
          });
        },
        // 得到区域编码
        getSceneCode: function (callback) {
          $.getJSONP(config.api.getSceneCode, {
            deviceCode: status.info.pwsId,
            deviceType: '01'
          }, function (data) {
            status.info.sceneCode = data.data.sceneCode;
            callback(data.data.sceneCode);
          }, function () {
            callback();
          });
        },
        // 访问记录
        visitRecord: function () {
          $.getJSONP(config.api.visitRecord, {
            pwsId: status.info.pwsId,
            sceneCode: status.info.sceneCode,
            macAddress: status.info.macAddress,
            ip: status.info.ip
          }, function (data) {
            status.info.pwsConnectInfoId = data.pwsConnectInfoId;
          });
        }
      },
      // 广告剩余时间倒计时
      timeoutManager: function (time, swiper, realIndex) {
        if (status.isFinish) {
          swiper.unlockSwipes();
          swiper.unlockSwipeToPrev();
          return false;
        }
        app.methods.api.viewAd(status.info.adIds[realIndex]);
        swiper.lockSwipes();
        swiper.lockSwipeToPrev();
        status.intervalTime = time / 1000;
        $('.swiper-time').html(status.intervalTime);
        status.intervalId = setInterval(function () {
          status.intervalTime--;
          $('.swiper-time').html(status.intervalTime);
        }, 1000);
        setTimeout(function () {
          swiper.unlockSwipes();
          swiper.lockSwipeToPrev();
          // 如果是最后一条
          if (swiper.activeIndex === status.intervals.length) {
            status.isFinish = true;
            postOnlineRecord();
            swiper.unlockSwipeToPrev();
          }
          if (status.intervalId) {
            clearInterval(status.intervalId);
            status.intervalId = 0;
          }
          swiper.slideNext();
        }, time + 10);
      },
      // 根据广告资源生成HTMl轮播代码
      parseAdResource: function (adList) {
        var swiperHtml = function (ad) {
          var typeHtml = '';
          if (ad.ADVERT_TYPE === '0') {
            typeHtml = '<img class="img-responsive" src="' + ad.ADVERT_FILE_PATH + '" />';
          }
          return '<div class="swiper-slide">' +
            '<a targetId="' + ad.ADVERT_ID + '" target="_blank">' +
            typeHtml +
            '</a>' +
            '</div>';
        };
        var htmlResult = '';
        for (var i = 0; i < adList.length; i++) {
          htmlResult += swiperHtml(adList[i]);
          status.intervals.push(parseInt(adList[i].ADVERT_PLAY_TIME) * 1000);
          status.info.adIds.push(adList[i].ADVERT_ID);
        }
        $('.swiper-wrapper').html(htmlResult);
        $('a').on('click', function () {
          adClick(this.attributes.targetId.value);
        });
      },
      // 轮播初始化
      initSwipe: function () {
        Swiper('.swiper-container', {
          loop: true,
          pagination: '.swiper-pagination',
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          onSlideNextEnd: function (swiper) {
            var realIndex = 0;
            if (swiper.activeIndex > status.intervals.length) {
              realIndex = 0;
            } else {
              realIndex = swiper.activeIndex - 1;
            }
            app.methods.timeoutManager(status.intervals[realIndex], swiper, realIndex);
          }
        });

      }
    }
  };

  // 程序开始
  app.methods.api.getPwsId(function (data) {
    app.methods.api.getSceneCode(function (data) {
      app.methods.api.getMacIP(function (data) {
        app.methods.api.visitRecord();
        app.methods.api.getAdResource(function (data) {
          app.methods.parseAdResource(data);
          app.methods.initSwipe(data);
        });
      });
    });
  });


})(Zepto, config, Swiper);
