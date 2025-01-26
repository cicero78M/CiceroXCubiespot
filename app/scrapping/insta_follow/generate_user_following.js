import { logsResponse } from "../../responselogs/logs_modif.js";
import { instaFollowingAPI } from "../../socialMediaAPI/insta_API.js";

export async function instaUserFollowing(username, pages, countData, totalData) {
    let stateFoll = false;

    logsResponse("Execute insta user following");

    return new Promise(async(resolve, reject) => {

        forLoopGenerateFollowing(username, pages, countData, totalData);

        async function forLoopGenerateFollowing(username, pages, countData, totalData) {
            try {

                let dataFollowing = [];
                logsResponse(totalData);

                await instaFollowingAPI(username, pages).then(
                    async response => {

                        dataFollowing = response.data.data.items;
                        let pagination = response.data.pagination_token;
                        let count = response.data.data.count ;

                        for (let i = 0; i < dataFollowing.length; i++){

                            
                            if (dataFollowing[i].username === 'cubiehome'){
                                logsResponse("true");
                                stateFoll = true;
                            }
                        }
    
                        let totalValue = countData + count;    
                        if (stateFoll === false){

                            logsResponse('execute');

                            if (pagination != ""){
                                if(totalData > totalValue){
                                    logsResponse("Under Total");
                                    setTimeout(async () => {
                                        forLoopGenerateFollowing(username, pagination, totalValue, totalData);
                                    }, 2000);
                                } else {
                                    logsResponse("done");
                                    let responseData =  {
                                        data: false,
                                        code: 200,
                                        state: true
                                    }                
                                    resolve (responseData);   
                                } 

                            } 
  
                        } else {
                            
                            let responseData =  {
                                data: true,
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
           
        }
    });    
}