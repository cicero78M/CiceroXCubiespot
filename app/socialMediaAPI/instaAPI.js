import axios from 'axios';
export const { request } = axios;

const headers = {
  'x-cache-control': 'no-cache',
  'x-rapidapi-key': ciceroKey.instaKey.instakeyAPI,
  'x-rapidapi-host': ciceroKey.instaKey.instahostAPI
}

export async function instaFollowingAPI(key,pagination) {
    //Insta Post API
    let options = {
        method: 'GET',
        url: ciceroKey.instaKey.instaFollowing,
        params: {
            username_or_id_or_url: key,
            amount: '100',
            pagination_token: pagination


          },
        headers: headers
    };

    try {

        let response = await request(options);

        let data = {
            data: response.data,
            code: 200,
            state: true
        };


        return data;
    } catch (error) {
        let data = {
            data: error,
            code: 303,
            state: false
        };


        return data;
    }
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

    try {
        let response = await request(options);

        let data = {
            data: response.data,
            code: 200,
            state: true
        };

        return data;

    } catch (error) {

        let data = {
            data: error,
            code: 303,
            state: false
        };

        return data;
    }
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

    try {
        let response = await request(options);

        let data = {
            data: response.data,
            code: 200,
            state: true
        };


        return data;

    } catch (error) {
        let data = {
            data: error,
            code: 303,
            state: false
        };


        return data;
    }
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

    try {

        let response = await request(options);

        let data = {
            data: response.data,
            code: 200,
            state: true
        };


        return data;
    } catch (error) {
        let data = {
            data: error,
            code: 303,
            state: false
        };


        return data;
    }
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

    try {
        let response = await request(options);

        let data = {
            data: response.data,
            code: 200,
            state: true
        };


        return data;

    } catch (error) {
        let data = {
            data: error,
            code: 303,
            state: false
        };


        return data;
    }
}
