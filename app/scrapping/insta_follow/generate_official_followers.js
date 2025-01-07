import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";
import { postInstaFollowersOfficial } from "./post_insta_official_follower.js";

export async function instaUserFollowing(clientName, username, pages) {

    console.log("Execute insta user following");

    return new Promise(
        async (resolve, reject) => {
            try {
                await instaFollowersAPI(username, pages).then(
                    async response => {
                        let pagination = response.data.pagination_token;
                        let total = response.data.total ;

                        let followersList = response.data.data.items;
                        let followersListTotal = followersList.lenght;
                        let followersListFinal = followersListTotal+followersListFinal;
                        console.log(followersListFinal);
                        await postInstaFollowersOfficial(clientName, followersList).then(
                            async response => {
                                console.log(response);
                                if(total > followersListFinal.data){
                                    console.log("Execute");
                                    setTimeout(async () => {
                                        await instaUserFollowing(clientName, username, pagination);
                                    }, 2000);
            
                                } else {
                                    console.log("Execute");
                                    let responseData =  {
                                        data: "Insta Follower API Done!!",
                                        code: 200,
                                        state: true
                                    }                
                                    resolve (responseData);
                                }
                            }
                        );
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
        }
    );
}