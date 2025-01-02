import { instaFollowingAPI } from "../socialMediaAPI/instaAPI.js";

export async function instaUserFollowing(username) {
    try {
        let pages ;
        let userList;
        let isFollowing = false;

        do {
            console.log("Starting...");
            let instaFollowing = await instaFollowingAPI(username, pages);
            userList = await instaFollowing.data.data.items;
            pages = await instaFollowing.data.pagination_token;
            console.log("Is Pages "+pages);
            for (let i = 0; i < userList.length; i++){
                    if (userList[i].username === 'cubiehome'){
                    isFollowing = true;
                }
            }            

        } while (pages != null);
            
        let responseData = {
            data: isFollowing,
            code: 200,
            state: true

        }
        return responseData;
    
    } catch (error) {
        let responseData = {
            data: error,
            code: 303,
            state: false
        }
        return responseData;   
    }
}