'use strict';

const PHOTOBUCKET_URL_PATTERN = new RegExp('^[^:]+://([^.]+\\.)?photobucket.com/.*');
const REFERER = 'http://photobucket.com/gallery/user/';

const PROXY_URL_PATTERN = new RegExp('[^:]+://(?:(?:[^.]+\\.)?wp.com|p.dreamwidth.org)/.*?((?:[^./]+\\.)?photobucket.com/.*)');

chrome.webRequest.onBeforeSendHeaders.addListener(({requestHeaders}) => {
  let refererSet = false;
  for (const header of requestHeaders) {
    const {name, value} = header;
    if (name === 'Referer') {
      if (value && !value.match(PHOTOBUCKET_URL_PATTERN)) {
        header.value = REFERER;
      }

      refererSet = true;
      break;
    }
  };

  if (!refererSet) {
    requestHeaders.push({name: 'Referer', value: REFERER});
  }

  return {requestHeaders: requestHeaders};
}, {
  urls: ['*://*.photobucket.com/*'],
  types: ['image']
}, ['blocking', 'requestHeaders']);

chrome.webRequest.onBeforeRequest.addListener(({url}) => {
  const [, photobucketUrl] = url.match(PROXY_URL_PATTERN);
  if (photobucketUrl) {
    return {
      redirectUrl: `https://${photobucketUrl}`
    };
  }
}, {
  urls: [
    '*://p.dreamwidth.org/*photobucket.com/*',
    '*://*.wp.com/*photobucket.com/*'
  ],
  types: ['image']
}, ['blocking'])
