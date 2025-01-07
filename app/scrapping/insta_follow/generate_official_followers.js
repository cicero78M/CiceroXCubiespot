import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";
import { postInstaFollowersOfficial } from "./post_insta_official_follower.js";

export async function instaUserFollowing(clientName, username, pages, array) {

    console.log("Execute insta user following");
    return new Promise(
        async (resolve, reject) => {

            try {
                await instaFollowersAPI(username, pages).then(
                    async response => {

                        let pagination = response.data.pagination_token;
                        let total = response.data.data.total ;

                        let followersList = await array.concat(response.data.data.items);

                        console.log(response);

                        console.log(total);

                        let arrayLenght = Array.isArray(followersList).lenght;

                        console.log(arrayLenght);

                        if(total > arrayLenght){

                            console.log("Under Total");
                            setTimeout(async () => {
                                await instaUserFollowing(clientName, username, pagination, followersList);
                            }, 2000);
    
                        } else {

                            await postInstaFollowersOfficial(clientName, followersList).then(
                                async response => {
                                    
                                    console.log(response);

                                    let responseData =  {
                                        data: "Insta Follower API Done!!",
                                        code: 200,
                                        state: true
                                    }                

                                    resolve (responseData);
                           
                                }
                            );

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
        }
    );
}