import { instaUserFollowing } from "./generate_user_following";

export async function bridgeFollow(username, pages, countData, responseInfo.data.data.following_count) {
    let response = await instaUserFollowing(username, pages, countData, responseInfo.data.data.following_count);

    console.log.log(response);
}