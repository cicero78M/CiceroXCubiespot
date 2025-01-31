import axios from 'axios';
import 'dotenv/config';
export const private_key = process.env;

export const { request } = axios;

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': private_key.INSTA_API_KEY,
  'x-rapidapi-host': private_key.INSTA_API_HOST
}

const headersnocache = {
    'x-rapidapi-key': private_key.INSTA_API_KEY,
    'x-rapidapi-host': private_key.INSTA_API_HOST
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
        url: private_key.INSTA_HOST_FOLLOWERS,
        
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

    console.log("Insta Following API Start");

    let parameters;
    if (pagination === ""){
        parameters = {
            username_or_id_or_url: key,
            amount:'1000'
        }
    } else {
        parameters = {
            username_or_id_or_url: key,
            amount:'1000',
            pagination_token: pagination
        }
    }

    //Insta Post API
    let options = {
        method: 'GET',
        url: private_key.INSTA_HOST_FOLLOWING,
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
        url: private_key.INSTA_HOST_LIKES,
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
        url: private_key.INSTA_HOST_POSTS,
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
        url: private_key.INSTA_HOST_POST_INFO,
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
        url: private_key.INSTA_HOST_USER_INFO,
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