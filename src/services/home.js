import { gets, posts } from '@/utils/request';

export async function queryHomeDetail() {
  return gets('/home/detail');
}

export async function updateHome(params) {
  return posts('/home/update', params);
}
