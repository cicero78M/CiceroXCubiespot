import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(username, pages, countData, totalData) {

    console.log("Execute insta user following");

    return new Promise(async(resolve, reject) => {

        forLoopGenerateFollowing(username, pages, countData, totalData);

        async function forLoopGenerateFollowing(username, pages, countData, totalData) {

            try {
                let stateFoll = false;

                await instaFollowingAPI(username, pages).then(
                    async response => {

                        let dataFollowing = response.data.data.items;
                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;
    
                        for (let i = 0; i < dataFollowing; i++ ){
                            console.log(dataFollowing[i].username);
                            if (dataFollowing[i].username === 'cubiehome'){
                                stateFoll = true;

                                let responseData =  {
                                    data: true,
                                    code: 200,
                                    state: true
                                }                
                                resolve (responseData);

                                break;
                            }
                        }
    
                        let totalValue = countData + count;
    
                        if (stateFoll === false){
                            
                            console.log('execute');
                            if(totalData > totalValue){
                                console.log("Under Total");
    
                                setTimeout(async () => {
                                    forLoopGenerateFollowing(username, pagination, totalValue, totalData);
                                }, 2000);
    
                            } else {
    
                                console.log("done");
    
                                let responseData =  {
                                    data: false,
                                    code: 200,
                                    state: true
                                }                
                                resolve (responseData);   
                        
                            }   
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
    });    
}