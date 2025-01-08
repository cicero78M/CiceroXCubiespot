import { instaUserFollowing } from "./generate_user_following";

export async function bridgeFollow(username, pages, countData, followers) {
    let response = await instaUserFollowing(username, pages, countData, followers);

    console.log.log(response);
}