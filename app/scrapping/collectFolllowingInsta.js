import { instaPostAPI } from "../socialMediaAPI/instaAPI.js";

export async function collectFollowing(username) {

    let responseData = await instaPostAPI(username);

    console.log(responseData);

    let data = {
        data: responseData,
        code: 200,
        state: false
    };

    return data;
}