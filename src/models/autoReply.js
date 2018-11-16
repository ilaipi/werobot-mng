import { list, save, remove } from '@/services/autoReply';

export default {
  namespace: 'autoReply',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      yield put({
        type: 'updateList',
        payload: response,
      });
    },
    *save({ payload }, { call, put }) {
      yield call(save, payload);
      yield put({ type: 'list' });
    },
    *remove({ payload }, { call, put }) {
      yield call(remove, payload);
      yield put({ type: 'list' });
    }
  },

  reducers: {
    updateList(state, { payload }) {
      return {
        ...state,
        list: payload.data,
      };
    },
  },
};
