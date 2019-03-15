import '@babel/polyfill';
import 'url-polyfill';
import React from 'react';
import dva from 'dva';
import { getUserInfo, getLanguage, getMerchantsInfo, setMerchantsLogin } from './services/api';
import { setAuthority } from './utils/authority';
// import { notification, Button } from 'antd';
import {Button} from 'antd/lib/button'
import {notification} from 'antd/lib/notification'

import createHistory from 'history/createBrowserHistory';
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './rollbar';

import './index.less';
// 1. Initialize
const app = dva({
  history: createHistory(),
  onError: (err, dispatch) => {
    if (err.response) {
    }
  },
});
const hostStr = window.location.host;
let uriStr = 'https://dev-sso.deepblueai.com';
if (hostStr) {
  if (hostStr.toLowerCase().startsWith('localhost')) {
    uriStr = 'https://dev-sso.deepblueai.com';
  } else if (hostStr.toLowerCase().startsWith('dev-')) {
    uriStr = 'https://dev-sso.deepblueai.com';
  } else if (hostStr.toLowerCase().startsWith('test-')) {
    uriStr = 'https://test-sso.deepblueai.com';
  } else if (hostStr.toLowerCase().startsWith('uat-')) {
    uriStr = 'https://uat-sso.deepblueai.com';
  } else {
    uriStr = 'https://sso.deepblueai.com';
  }
}

const urlToken = GetQueryString('access_token'); // 检查当前地址有无token
if (urlToken) {
  if (urlToken == 'NONE') {
    const realUrl = deleteUrlToken('access_token');
    window.location.href = `${uriStr}/api/auth/login?redirect_to=${realUrl}`;
  } else {
    localStorage.setItem('token', urlToken);
    const realUrl = deleteUrlToken('access_token');
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      hasMerhcantId(merchantId, realUrl);
    } else {
      noMerchantId(realUrl);
    }
  }
} else {
  const localToken = localStorage.getItem('token');
  if (localToken) {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      hasMerhcantId(merchantId);
    } else {
      noMerchantId();
    }
  } else {
    const realUrl1 = deleteUrlToken('access_token');
    const { pathname } = window.location;
    console.log('pathname:', pathname);
    if (pathname !== '/user/register') {
      window.location.href = `/api/v2/auth/token?redirect_to=${realUrl1}`;
    }
    //
  }
}

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

function GetQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

function deleteUrlToken(ref) {
  const url = window.location.href;
  // 如果不包括此参数
  if (url.indexOf(ref) === -1) return url;
  const arrUrl = url.split('?');
  const base = arrUrl[0];
  const arrParam = arrUrl[1].split('&');
  let index = -1;
  for (let i = 0; i < arrParam.length; i++) {
    const paired = arrParam[i].split('=');
    if (paired[0] === ref) {
      index = i;
      break;
    }
  }
  if (index === -1) {
    return url;
  } else {
    arrParam.splice(index, 1);
    if (arrParam && arrParam.length > 0) {
      return `${base}?${arrParam.join('&')}`;
    } else {
      return base;
    }
  }
}

function hasMerhcantId(merchantId, realUrl) {
  const key1 = `open${Date.now()}`;
  const btn1Click = function() {
    notification.close(key1);
    clearAllData();
    window.location.href = `${uriStr}/api/auth/login?redirect_to=${realUrl ||
    window.location.href}`;
  };
  const btn1 = (
    <Button type="primary" size="small" onClick={btn1Click}>
      确定
    </Button>
  );
  const close1 = () => {
    clearAllData();
    window.location.href = `${uriStr}/api/auth/login?redirect_to=${realUrl ||
    window.location.href}`;
  };
  const merchantLogin = setMerchantsLogin(merchantId);
  merchantLogin.then(loginInfo => {
    const response = getUserInfo();
    response.then(res => {
      if (res) {
        localStorage.setItem('userName', res.username);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('mobile', res.mobile);
        let locale = 'zh_CN';
        if (localStorage.getItem('locale')) {
          locale = localStorage.getItem('locale');
        } else {
          // for(const authmerchant of res.authMerchants){
          //   if(merchantId == authmerchant.merchantId){
          //     locale = authmerchant.locale || 'zh_CN';
          //     break;
          //   }
          // }
          locale = res.locale || 'zh_CN';
        }
        localStorage.setItem('locale', locale);
        setAuthorityData(locale, res.permissions, realUrl, btn1, key1, close1);
      }
    });
  });
}

function noMerchantId(realUrl) {
  const key1 = `open${Date.now()}`;
  const btn1Click = function() {
    notification.close(key1);
    clearAllData();
    window.location.href = `${uriStr}/api/auth/login?redirect_to=${realUrl ||
    window.location.href}`;
  };
  const btn1 = (
    <Button type="primary" size="small" onClick={btn1Click}>
      确定
    </Button>
  );
  const close1 = () => {
    clearAllData();
    window.location.href = `${uriStr}/api/auth/login?redirect_to=${realUrl ||
    window.location.href}`;
  };
  const merchantInfos = getMerchantsInfo();
  merchantInfos.then(merchantInfo => {
    if (merchantInfo && merchantInfo.length > 0) {
      const merchantId = merchantInfo[0].merchantId || 0;
      const authMerchants = merchantInfo || [];
      localStorage.setItem('authMerchants', JSON.stringify(authMerchants));
      localStorage.setItem('merchantId', merchantId);
      const merchantLogin = setMerchantsLogin(merchantInfo[0].merchantId);
      merchantLogin.then(loginInfo => {
        const response = getUserInfo();
        response.then(res => {
          if (res) {
            let locale = 'zh_CN';
            if (localStorage.getItem('locale')) {
              locale = localStorage.getItem('locale');
            } else {
              locale = res.locale || 'zh_CN';
            }
            localStorage.setItem('userName', res.username);
            localStorage.setItem('userId', res.userId);
            localStorage.setItem('mobile', res.mobile);
            localStorage.setItem('locale', locale);
            setAuthorityData(locale, res.permissions, realUrl, btn1, key1, close1);
          }
        });
      });
    } else {
      notification.open({
        message: '提示',
        description: '当前用户没有权限登录任何商家！',
        btn: btn1,
        key: key1,
        onClose: close1,
      });
    }
  });
}

function setAuthorityData(locale, permissions, realUrl, btn1, key1, close1) {
  if (permissions && permissions.length > 0) {
    const merchantloginCode = permissions.filter(item => item.permissionCode === 'merchant_login');
    if (merchantloginCode && merchantloginCode.length > 0) {
      setAuthority(permissions);
      getLanguage(locale).then(data => {
        const stackdata = data || {};
        localStorage.setItem('stackdata', JSON.stringify(stackdata));
        if (realUrl) {
          window.location.href = realUrl;
        }
      });
    } else {
      notification.open({
        message: '提示',
        description: '该账号没有登录权限',
        btn: btn1,
        key: key1,
        onClose: close1,
      });
    }
  } else {
    notification.open({
      message: '提示',
      description: '当前用户没有任何权限',
      btn: btn1,
      key: key1,
      onClose: close1,
    });
  }
}

function clearAllData() {
  localStorage.removeItem('token');
  localStorage.removeItem('authority');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('mobile');
  localStorage.removeItem('merchantId');
  localStorage.removeItem('authMerchants');
}

export default app._store; // eslint-disable-line
