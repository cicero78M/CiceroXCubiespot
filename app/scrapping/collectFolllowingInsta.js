import { instaInfoAPI } from "../socialMediaAPI/instaAPI.js";

export async function collectFollowing(username) {

    let responseData = await instaInfoAPI(username);

    console.log(responseData);

    let data = {
        data: responseData,
        code: 200,
        state: false
    };

    return data;
}