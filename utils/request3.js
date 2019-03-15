import fetch from 'dva/fetch';
import { notification,message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

const API_URL_PREFIX = '/api/v2';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

class APIRequestError {
  constructor(props) {
    const { code, message, data, url } = props;
    this.code = code;
    this.message = message;
    this.data = data;
    this.url = url;
  }
}

function checkIfCustomizedData(jsonData = {}) {
  return (
    jsonData.code !== undefined &&
    jsonData.success !== undefined &&
    jsonData.code !== 'INVALID_USERNAME_PASSWORD'
  );
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return new Promise((resolve, reject) => {
      response.json().then(jsonData => {
        if (!checkIfCustomizedData(jsonData)) {
          resolve(jsonData);
          return;
        }
        const { success, data, message, code } = jsonData;
        if (!success) {
          notification.error({
            // message: `Error when requesting api. url: ${response.url}, code: ${code}`,
            description: message,
          });
          reject(new APIRequestError({ url: response.url, code, message, data }));
        } else {
          resolve(data);
        }
      });
    });
  }

  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function requestExpon(url, options) {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  };

  const token = localStorage.getItem('token');
  const locale = localStorage.getItem('locale');

  if (token) {
    defaultOptions.headers = {
      Authorization: `Bearer ${token}`,
      "X-Accept-Locale":locale,
      ...defaultOptions.headers,
    };
  }

  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(`${API_URL_PREFIX}${url}`, newOptions)
    .then((res)=>{
        res.blob().then((blob)=>{
            // console.log(blob)
            // if(blob.type != "application/msexcel"){
            //   message.error('导出错误')
            //   return 
            // }
            const filename = res.headers.get('Content-Disposition');
            const index=filename.search(/filename=/)
            const filenames=filename.substring(index+9,filename.length)
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filenames;
            document.body.appendChild(a)
            a.click();                  
        })
    })
    .catch(e => {
      if (e instanceof APIRequestError) {
        throw e;
      }
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('authority');
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        // dispatch(routerRedux.push('/exception/404'));
      }
    });
}
