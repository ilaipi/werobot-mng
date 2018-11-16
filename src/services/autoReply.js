import { posts, gets, request } from '../utils/request';

export const list = data => gets('/autoReply', data);

export const rooms = () => gets('/rooms');

export const save = data => posts('/autoReply', data);

export const remove = ({ id }) => request({
  url: `/fssapi/autoReply/${id}`
}, 'DELETE');
