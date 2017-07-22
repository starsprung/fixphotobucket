'use strict';

const URL_PATTERN = new RegExp('^[^:]+://([^.]+\\.)?photobucket.com/.*');
const REFERER = 'http://photobucket.com/gallery/user/';

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
  let refererSet = false;
  for (const header of details.requestHeaders) {
    const {name, value} = header;
    if (name === 'Referer') {
      if (value && !value.match(URL_PATTERN)) {
        header.value = REFERER;
      }

      refererSet = true;
      break;
    }
  };

  if (!refererSet) {
    details.requestHeaders.push({name: 'Referer', value: REFERER});
  }

  return {requestHeaders: details.requestHeaders};
}, {urls: ['*://*.photobucket.com/*']}, ['blocking', 'requestHeaders']);
