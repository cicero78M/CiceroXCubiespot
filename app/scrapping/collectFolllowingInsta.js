import { readFileSync } from "fs";
import { instaUserAPI } from "../socialMediaAPI/instaAPI.js";

const ciceroKey = JSON.parse (readFileSync('ciceroKey.json'));

export async function collectFollowing(username) {
    let responseData = await instaUserAPI(username, ciceroKey.instaKey.instaFollowing);

    console.log(responseData);

    let data = {
        data: responseData,
        code: 200,
        state: false
    };

    return data;
}