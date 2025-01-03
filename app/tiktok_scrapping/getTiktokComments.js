import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";
import { postTiktokUserComments } from "./postTiktokUserComments.js";

export async function getTiktokComments(clientName, todayItems) {

    console.log('Exec Get Tiktok Comments');
    let cursorNumber = 0;
    let switchNumber = 0;
    let newDataUsers = [];    
    
    for (let i = 0; i < todayItems.length; i++) {

        forLoopGetComments(todayItems[i], cursorNumber);   

        async function forLoopGetComments(items, cursorNumber) {

            tiktokCommentAPI(items, cursorNumber).then (async responseComments =>{
                let commentItems = responseComments.data.comments;
                for (let ii = 0; ii < commentItems.length; ii++) {
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            newDataUsers.push(commentItems[ii].user.unique_id);
                        }
                    }
                }
    
                if (switchNumber = 0){
                    if (responseComments.data.has_more === 1){    
                        console.log(responseComments.data.cursor );
                        setTimeout(async() => {
                            console.log('next data');
                            forLoopGetComments(items, responseComments.data.cursor);
            
                        }, 2000);
            
                    } else {
                        console.log(responseComments.data.cursor );
                        if(responseComments.data.total > 400){
                            if (responseComments.data.cursor < responseComments.data.total){
                                setTimeout(async () => {
                                    console.log('next data');
                                    forLoopGetComments(items, responseComments.data.cursor);
                                }, 2000);
                            } else {
                                switchNumber = 1;
                                postTiktokUserComments(clientName, items, newDataUsers)
                            }
                        } else {
                            setTimeout(async () => {
                                console.log('next data');
                                forLoopGetComments(items, responseComments.data.cursor);
                            }, 2000);                    
                        }
                    }
                } else {
                    postTiktokUserComments(clientName, items, newDataUsers);
                }
                    
            }). catch (response => {
                console.log(response);
            });
        }
    }
}