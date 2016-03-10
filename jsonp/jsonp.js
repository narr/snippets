function log(str, type) {
  if (window.console) {
    /* eslint-disable no-console */
    if (!type) {
      console.log(str);
    } else {
      console[type](str);
    }
    /* eslint-enable no-console */
  }
}


function getJson(src, options) {
  var callbackName = options.callbackName || 'callback';
  var onSuccess = options.onSuccess || function onSuccess() {};
  var onTimeout = options.onTimeout || function onTimeout() {};
  var timeout = options.timeout || 4;
  var script = document.createElement('script');

  var timeoutTrigger = setTimeout(function timeoutCb() {
    window[callbackName] = function callback() {};
    onTimeout();
  }, timeout * 1000);

  // &callback=callbackName
  window[callbackName] = function callback(response) {
    clearTimeout(timeoutTrigger);
    onSuccess(response);
  };

  script.type = 'text/javascript';
  script.src = src;
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
}


function example(apiKey, searchTerm) {
  var that;
  var callbackName;
  var searchUrl;

  that = this;
  if (!apiKey) {
    that.disabled = false;
    log('no apikey..!!', 'error');
    alert('no apikey..!!');
    return false;
  }
  callbackName = 'getImage';
  searchUrl = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(searchTerm) +
    '&cx=015734221451335448505%3Aogelzxkrimi&imgSize=medium&dateRestrict=d30&key=' +
    encodeURIComponent(apiKey) + '&callback=' + callbackName;

  getJson(searchUrl, {
    callbackName: callbackName,
    onSuccess: function onSuccess(response) {
      var i;
      var item;
      var result;
      var img;
      that.disabled = false;
      log('success..!!');
      log(response);
      if (!response || !response.items || response.items.length === 0) {
        log('No response from yahoo..!!');
        alert('No response from yahoo..!!');
        return false;
      }
      result = document.querySelector('.result');
      if (response.items.length > 0) {
        result.innerHTML = '';
      } else {
        alert('No imgs from yahoo..!!');
        return false;
      }
      for (i = response.items.length - 1; i > -1; i--) {
        item = response.items[i];
        if (item.pagemap && item.pagemap.cse_thumbnail) {
          log(item.pagemap.cse_thumbnail[0]);
          img = document.createElement('img');
          img.src = item.pagemap.cse_thumbnail[0].src;
          img.width = item.pagemap.cse_thumbnail[0].width;
          img.height = item.pagemap.cse_thumbnail[0].height;
          result.appendChild(img);
        }
      }
      return true;
    },
    onTimeout: function onTimeout() {
      that.disabled = false;
      log('timeout!');
      alert('timeout!');
      return true;
    },
    timeout: 5
  });

  return true;
}
