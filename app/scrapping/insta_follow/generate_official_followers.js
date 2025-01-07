import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(username, pages, array) {
    console.log("Execute insta user following");
    console.log(username);
    return new Promise(async (resolve, reject) => {
        try {
            await instaFollowersAPI(username, pages).then(
                async response => {

                    console.log(response);

                    let childrenArray = array.concat(response.data.data.items);

                    let responseData =  {
                        data: childrenArray,
                        code: 200,
                        state: true
                    }                
                    resolve (responseData);
                    
                    // if(response.data.pagination_token != null){
                    //     setTimeout(() => {
                    //         instaUserFollowing(username, response.data.pagination_token, childrenArray);
                    //     }, 2000);
                    // } else {
                    //     let responseData =  {
                    //         data: childrenArray,
                    //         code: 200,
                    //         state: true
                    //     }                
                    //     resolve (responseData);
                    // }
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