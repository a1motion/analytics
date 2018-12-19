const fetch = require('fetch-ponyfill')();
export default function pageview(id, report) {
  let referrer = document.referrer;
  function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState != 'loading')
          fn();
      });
    }
  }
  const generateId = () => {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  const cid = () => {
    if (localStorage) {
      let i = localStorage.getItem('ga:_cid');
      if (i) return i;
      i = generateId();
      localStorage.setItem('ga:_cid', i);
      return i;
    } else {
      return generateId();
    }
  }
  const serialize = (obj) => {
    const e = encodeURIComponent;
    Object.keys(obj).map((key) => {
      if (obj[key] === undefined) return undefined;
      return `${e(key)}=${e(obj[key])}`;
    }).filter(a => a !== undefined).join('&');
  }
  const offload = (fn) => {
    if (window.requestIdleCallback) {
      return requestIdleCallback(fn)
    }
    return setTimeout(fn, 0);
  }
  const pageview = (extra, fetchOptions) => {
    offload(() => {
      const data = Object.assign({}, {
        v: '1',
        tid: id,
        cid: cid(),
        t: 'pageview',
        ds: 'web',
        z: Math.random().toString().slice(2),
        dr: referrer,
        sr: `${(window.screen || {}).width}x${(window.screen || {}).height}`,
        vp: window.visualViewport ? `${(window.visualViewport || {}).width}x${(window.visualViewport || {}).height}` : undefined,
        de: document.characterSet,
        sd: screen.colorDepth ? `${screen.colorDepth}-bits` : undefined,
        ul: (navigator.language || "").toLowerCase(),
        dl: document.location.origin + document.location.pathname + document.location.search,
        dt: document.title
      }, extra);
      fetch(`${report || 'https://www.google-analytics.com/collect'}?${serialize(data)}`, Object.assign({}, {
        method: report ? 'post' : 'get'
      }, fetchOptions));
      referrer = undefined;
    });
  }
  ready(pageview);
  return pageview;
}
export function AnalyticsMiddleware(id) {
  const pv = pageview(id);
  return (req, res, next) => {
    next();
  }
}