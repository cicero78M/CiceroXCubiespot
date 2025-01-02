import { instaFollowingAPI } from "../socialMediaAPI/instaAPI.js";
import { instaUserData } from "./collectInstaUser.js";

export async function instaUserFollowing(username, from) {
    try {
        let pages ;
        let userList;
        let isFollowing = false;
        let user_counter = 0;

        let instaUser = await instaUserData(from, username);
        const following_count = instaUser.data.data.data.following_count;
        console.log(following_count);

        while (following_count >= user_counter ) {
            console.log("Starting...");
            user_counter = user_counter+userList.length;
            let instaFollowing = await instaFollowingAPI(username, pages);
            userList = await instaFollowing.data.data.items;
            pages = await instaFollowing.data.pagination_token;
            console.log(pages);
            for (let i = 0; i < userList.length; i++){
                user_counter++;
                if (userList[i].username = username){
                    isFollowing = true;
                    break;
                }
            }            
        }

        if(isFollowing){
            let responseData = {
                data: "User Following",
                code: 200,
                state: true
            };
            return responseData;
        } else {
            let responseData = {
                data: "User Not Following",
                code: 201,
                state: true
            };
            return responseData;
        }
    
    } catch (error) {
        let responseData = {
            data: error,
            code: 303,
            state: false
        }
        return responseData;   
    }
}