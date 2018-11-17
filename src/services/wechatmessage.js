import { gets } from '../utils/request';

export const list = data => gets('/wechatmessages', data);

// @deprecated
export const list2 = data => gets('/wechat', data);
