import { list } from '@/services/wechatmessage';

export default {
  namespace: 'wechatmessage',

  state: {
    data: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'updateList',
        payload: response,
      });
    },
  },

  reducers: {
    updateList(state, { payload: { data } }) {
      return {
        ...state,
        data,
      };
    },
  },
};
