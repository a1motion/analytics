import fetch from "unfetch";

let tid;
let hooked = false;
const { referrer } = document;
function ready(fn) {
  if (document.readyState !== `loading`) {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener(`DOMContentLoaded`, fn);
  } else {
    document.attachEvent(`onreadystatechange`, () => {
      if (document.readyState !== `loading`) {
        fn();
      }
    });
  }
}

const generateId = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return (
    s4() +
    s4() +
    `-` +
    s4() +
    `-` +
    s4() +
    `-` +
    s4() +
    `-` +
    s4() +
    s4() +
    s4()
  );
};

const cid = () => {
  if (localStorage) {
    let i = localStorage.getItem(`ga:_cid`);
    if (i) {
      return i;
    }

    i = generateId();
    localStorage.setItem(`ga:_cid`, i);
    return i;
  }

  return generateId();
};

const serialize = (obj) => {
  const e = encodeURIComponent;
  return Object.keys(obj)
    .map((key) => {
      if (obj[key] === undefined) {
        return undefined;
      }

      return `${e(key)}=${e(obj[key])}`;
    })
    .filter((a) => a !== undefined)
    .join(`&`);
};

const offload = (fn) => {
  if (window.requestIdleCallback) {
    return requestIdleCallback(fn);
  }

  return setTimeout(fn, 0);
};

const pageview = (type, eventCategory, eventAction, eventLabel, eventValue) => {
  offload(() => {
    const data = serialize({
      v: `1`,
      tid,
      cid: cid(),
      t: type || `pageview`,
      ds: `web`,
      z: Math.random()
        .toString()
        .slice(2),
      dr: referrer,
      sr: `${(window.screen || {}).width}x${(window.screen || {}).height}`,
      vp: window.visualViewport
        ? `${(window.visualViewport || {}).width}x${
            (window.visualViewport || {}).height
          }`
        : undefined,
      de: document.characterSet,
      sd: screen.colorDepth ? `${screen.colorDepth}-bits` : undefined,
      ul: (navigator.language || ``).toLowerCase(),
      dl:
        document.location.origin +
        document.location.pathname +
        document.location.search,
      dt: document.title,
      ec: eventCategory || undefined,
      ea: eventAction || undefined,
      el: eventLabel || undefined,
      ev: eventValue || undefined,
    });
    const url = `https://www.google-analytics.com/collect`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, data);
    } else {
      fetch(url, {
        method: `post`,
        body: data,
      });
    }
  });
};

function analytics(id) {
  tid = id;
  ready(() => pageview());
  if (hooked) {
    return;
  }

  hooked = true;
  if (`pushState` in window.history) {
    /* eslint-disable */
    const pushState = window.history.pushState
    window.history.pushState = function(state) {
      if (typeof history.onpushstate == `function`) {
        history.onpushstate({ state })
      }
      pushState.apply(window.history, arguments)
      setTimeout(() => pageview(), 50)
    }
    /* eslint-enable */
  }
}

const event = (eventCategory, eventAction, eventLabel, eventValue) =>
  pageview(`event`, eventCategory, eventAction, eventLabel, eventValue);

analytics.event = event;

export default analytics;
