import { rooms } from '@/services/autoReply';

export default {
  namespace: 'room',

  state: {
    list: [],
  },

  effects: {
    *list(_, { call, put }) {
      const response = yield call(rooms);
      yield put({
        type: 'updateList',
        payload: response,
      });
    },
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
