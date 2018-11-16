import { queryHomeDetail, updateHome } from '@/services/home';

export default {
  namespace: 'home',

  state: {
    banners: [],
    entrances: [],
    sections: [],
    id: '',
  },

  effects: {
    *fetchHomeDetail(_, { call, put }) {
      const response = yield call(queryHomeDetail);
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    *updateHome({ payload }, { call }) {
      yield call(updateHome, payload);
    },
  },

  reducers: {
    saveDetail(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const exp = new RegExp('^/platform/home');
        if (exp.test(pathname)) {
          dispatch({ type: 'fetchHomeDetail' });
        }
      });
    },
  },
};
