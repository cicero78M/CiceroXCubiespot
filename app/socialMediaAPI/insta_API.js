import axios from 'axios';
import { ciceroKey } from '../database/new_query/sheet_query.js';

export const { request } = axios;

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': ciceroKey.instaKey.instakeyAPI,
  'x-rapidapi-host': ciceroKey.instaKey.instahostAPI
}

const headersnocache = {
    'x-rapidapi-key': ciceroKey.instaKey.instakeyAPI,
    'x-rapidapi-host': ciceroKey.instaKey.instahostAPI
  }

export async function instaFollowersAPI(key,pagination) {

    console.log("Insta Followers API Start");

    let parameters;

    if (pagination === ""){
        parameters = {
            username_or_id_or_url: key,
            amount:'500'
        }
    } else {
        parameters = {
            username_or_id_or_url: key,
            amount:'500',
            pagination_token: pagination
        }
    }

    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instaFollowers,
        
        params: parameters,
        headers: headersnocache
    };

    return new Promise(async(resolve, reject) => {
        try {
            let response = await request(options);
            
            let data = {
                data: response.data,
                code: 200,
                state: true
            };
            console.log(data);
            resolve (data);
        } catch (error) {

            console.error (error);
            let data = {
                data: error,
                code: 303,
                state: false
            };
            reject (data);
        }
    });
}
export async function instaFollowingAPI(key,pagination) {

    console.log("Insta Followers API Start");
    
    let parameters;
    if (pagination === ""){
        parameters = {
            username_or_id_or_url: key,
            amount:'100'
        }
    } else {
        parameters = {
            username_or_id_or_url: key,
            amount:'100',
            pagination_token: pagination
        }
    }

    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instaFollowing,
        params: parameters,
        headers: headers
    };

    return new Promise(async(resolve, reject) => {
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
export async function instaLikesAPI(key) {
    //Insta Likes API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instahostLikes,
        params: {
            code_or_id_or_url: key
        },
        headers: headers
    };

    return new Promise(async(resolve, reject) => {
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
export async function instaPostAPI(key) {
    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instahostContent,
        params: {
            username_or_id_or_url: key
        },
        headers: headers
    };

    return new Promise(async(resolve, reject) => {
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
export async function instaPostInfoAPI(key) {
    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instapostInfo,
        params: {
            code_or_id_or_url: key,
            include_insights: 'false'
        },
        headers: headers
    };

    return new Promise(async(resolve, reject) => {
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
export async function instaInfoAPI(key) {
    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instaUserInfo,
        params: {
            username_or_id_or_url: key
        },
        headers: headers
    };

    return new Promise(async(resolve, reject) => {
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
