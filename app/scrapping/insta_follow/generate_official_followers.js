import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(username, pages, array) {
    return new Promise(async (resolve, reject) => {
        try {
            await instaFollowingAPI(username, pages).then(
                async response => {
                    let childrenArray = array.concat(response.data.data.items);
                    if(response.data.pagination_token != null){
                        instaUserFollowing(username, response.data.pagination_token, childrenArray);
                    } else {
                        let responseData =  {
                            data: childrenArray,
                            code: 200,
                            state: true
                        }                
                        resolve (responseData);
                    }
                }
            );
        } catch (error) {
            let responseData = {
                data: error,
                code: 303,
                state: false
            }
            reject (responseData);   
        } 
    });
}