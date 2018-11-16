import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

import { query as queryUsers, queryCurrent, login, save } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { setCookie } from '@/utils/cookie';
import { AUTH_INFO, COOKIE_KEY } from '@/utils/consts';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { success, id, home } = response.data;
      if (!success) {
        return;
      }
      setCookie(COOKIE_KEY, id, 1);
      window.localStorage.setItem(AUTH_INFO, JSON.stringify(response.data));
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.startsWith('/#')) {
            redirect = redirect.substr(2);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      yield put(routerRedux.replace(home || '/account/settings'));
    },
    *logout(_, { put }) {
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      if (!response) return;
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    *save({ payload }, { call }) {
      yield call(save, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
