import { generateFollowing } from "./generate_user_following.js";

export async function bridgeFollow(username, pages, countData, followers) {
    let response = await generateFollowing(username, pages, countData, followers);

    console.log(response);
}