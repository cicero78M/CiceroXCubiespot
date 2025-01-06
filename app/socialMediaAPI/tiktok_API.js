import { ciceroKey } from '../database/new_query/sheet_query.js';
import { request } from './insta_API.js';

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': ciceroKey.tiktokKey.tiktokKey,
  'x-rapidapi-host': ciceroKey.tiktokKey.tiktokHost
}

export async function tiktokUserInfoAPI(key) {
  const options = {
    method: 'GET',
    url: ciceroKey.tiktokKey.tiktokhostInfo,
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
    url: ciceroKey.tiktokKey.tiktokhostContent,
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
    url: ciceroKey.tiktokKey.tiktokhostComments,
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