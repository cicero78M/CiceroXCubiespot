import { private_key } from '../../app.js';
import { ciceroKey } from '../database/new_query/sheet_query.js';
import { request } from './insta_API.js';

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': private_key.TIKTOK_API_KEY,
  'x-rapidapi-host': private_key.TIKTOK_API_HOST
}

export async function tiktokUserInfoAPI(key) {
  const options = {
    method: 'GET',
    url: private_key.TIKTOK_HOST_INFO,
    params: {
      uniqueId: key
    },
    headers: headers
  };

  return new Promise(async (resolve, reject) => {
    try {
      let response = await request(options);
      let data = {
        data: response.data,
        code: 200,
        state: true
      };
      resolve (data);
    } catch (error) {
      let data = {
        data: error,
        code: 303,
        state: false
      };
      reject (data);
    }
  });
}
export async function tiktokPostAPI(key, cursors) {
  //Tiktok Post API
  const options = {
    method: 'GET',
    url: private_key.TIKTOK_HOST_POSTS,
    params: {
      secUid: key,
      count: '50',
      cursor: cursors
    },
    headers: headers
  };
  return new Promise(async (resolve, reject) => {
    try {
      let response = await request(options);
      let data = {
        data: response.data,
        code: 200,
        state: true
      };
      resolve (data);
    } catch (error) {
      let data = {
        data: error,
        code: 303,
        state: false
      };
      reject (data);
    }
  });
}
export async function tiktokCommentAPI(key, cursors) {
  //Insta Likes API
  const options = {
    method: 'GET',
    url: private_key.TIKTOK_HOST_COMMENTS,
    params: {
      videoId: key,
      count: '100',
      cursor: cursors
    },
    headers: headers
  };
  return new Promise(async (resolve, reject) => {
    try {

      let response = await request(options);

      let data = {
        data: response.data,
        code: 200,
        state: true
      };

      resolve (data);

    } catch (error) {
      let data = {
        data: error,
        code: 303,
        state: false
      };

      reject (data);
    }  
  });
}