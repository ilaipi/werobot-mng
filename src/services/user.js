import { post, posts, gets, get } from '../utils/request';

export async function query() {
  return get('/api/users');
}

export const login = async data => post('/auth/login', data);

export const queryCurrent = () => gets('/account');

export const save = data => posts('/account', data);
