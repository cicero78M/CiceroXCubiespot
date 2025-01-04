import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";

export async function getTiktokComments(items) {

    console.log('Exec Generate Tiktok Comments');

    let cursorNumber = 0;

    let newDataUsers = [];    
    
    newDataUsers.push(items);

    return new Promise((resolve, reject) =>{
        
        forLoopGetComments(items, cursorNumber);
        async function forLoopGetComments(items, cursorNumber) {    
            await tiktokCommentAPI(items, cursorNumber).then ( response =>{

                let commentItems = response.data.comments;
    
                for (let ii = 0; ii < commentItems.length; ii++) {
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            newDataUsers.push(commentItems[ii].user.unique_id);
                        }
                    }
                }
    
                if (response.data.has_more === 1){    
                    setTimeout(async() => {
                        console.log('next data '+response.data.cursor);
                        forLoopGetComments(items, response.data.cursor);
                    }, 1200);
                } else {    
                    if(response.data.total > 400){
                        if (response.data.cursor < response.data.total){
                            setTimeout(async () => {
                                console.log('next data '+response.data.cursor);
                                forLoopGetComments(items, response.data.cursor);
                            }, 1200);
                        } else {
                            let data = {
                                data: newDataUsers,
                                state: true,
                                code: 200
                              };
                            resolve (data);                        }
                    } else {
    
                        setTimeout(async () => {
                            console.log('next data '+response.data.cursor);
                            forLoopGetComments(items, response.data.cursor);
                        }, 1200);                    
                    }
                }
            }). catch (error => {
                let data = {
                    data: error,
                    state: false,
                    code: 303
                  };
                reject (data);              
            });
        }
    });   
}