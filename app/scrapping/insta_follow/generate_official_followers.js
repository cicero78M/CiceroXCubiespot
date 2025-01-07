import { instaFollowersAPI } from "../../socialMediaAPI/insta_API.js";
import { postInstaFollowersOfficial } from "./post_insta_official_follower.js";

export async function instaUserFollowing(clientName, username, pages, array, total) {

    console.log("Execute insta user following");
    return new Promise(
        async (resolve, reject) => {

            try {
                await instaFollowersAPI(username, pages).then(
                    async response => {

                        let pagination = response.data.data.pagination_token;
                        let count = response.data.data.data.count ;

                        let followersList = await array.concat(response.data.data.data.items);

                        let totalValue = total + count;

                        console.log(response);

                        console.log(total);

                        let arrayLenght = followersList.lenght;

                        console.log(arrayLenght);

                        if(total > totalValue){

                            console.log("Under Total");
                            setTimeout(async () => {
                                await instaUserFollowing(clientName, username, pagination, followersList, totalValue);
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