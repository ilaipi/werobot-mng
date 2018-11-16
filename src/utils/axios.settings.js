import axios from 'axios';
import { notification } from 'antd';
import router from 'umi/router';

import { checkCookie, getCookie, setCookie } from './cookie';
import { COOKIE_KEY, AUTH_INFO } from './consts';

axios.defaults.withCredentials = true;

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

/**
 * 这里可以每个请求前，校验Cookie
 * 前提是，登录请求完成后需要在Cookie中加入一个token，key是设置好的COOKIE_KEY
 */
axios.interceptors.request.use(config => {
  const { url } = config;
  const authInfo = window.localStorage.getItem(AUTH_INFO);
  if (/^\/fssapi\//.test(url) && (!checkCookie(COOKIE_KEY) || !authInfo)) {
    // @HACK
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({
      type: 'user/logout',
    });
    return Promise.reject(new Error('需要登录'));
  }
  return config; // eslint-disable-line consistent-return
});

axios.interceptors.response.use(
  response => {
    // refresh cookie
    /* 这里可以每个请求完成后刷新Cookie的有效期
     * 需要前后端保持统一的机制。
     * 即，如果后端设置了session每个请求都刷新，前端这里才需要每次刷新
     * 不然前端这里不需要每次刷新
    */
    const token = getCookie(COOKIE_KEY);
    setCookie(COOKIE_KEY, token, 7);
    return response;
  },
  (error = {}) => {
    console.log('=====error', error);
    const {
      request: { responseURL } = {},
      response: { status, statusText, data: { msg = '服务器发生错误' } = {} } = {},
    } = error;
    const text = codeMessage[status] || statusText || msg;
    if (status === 401) {
      // @HACK
      /* eslint-disable no-underscore-dangle */
      window.g_app._store.dispatch({
        type: 'user/logout',
      });
      return;
    }
    if (status === 403) {
      router.push('/exception/403');
      return;
    }
    if (status <= 504 && status >= 500) {
      router.push('/exception/500');
      return;
    }
    if (status >= 404 && status < 422) {
      router.push('/exception/404');
    }
    if (!status || !responseURL) return;
    notification.error({
      message: `请求错误 ${status}: ${responseURL}`,
      description: text,
    });
  }
);
