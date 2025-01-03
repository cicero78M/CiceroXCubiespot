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

            console.log(items);
            tiktokCommentAPI(items, cursorNumber).then (response =>{
                console.log(response);

                let commentItems = response.data.comments;
                console.log(commentItems);
                for (let ii = 0; ii < commentItems.length; ii++) {
                    console.log(commentItems[ii].user.unique_id);
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            console.log("OK");
                            newDataUsers.push(commentItems[ii].user.unique_id);
                        }
                    }
                }
    
                if (switchNumber = 0){
                    if (response.data.has_more === 1){    
                        console.log(response.data.cursor );
                        setTimeout(async() => {
                            console.log('next data');
                            forLoopGetComments(items, response.data.cursor);
            
                        }, 2000);
            
                    } else {
                        console.log(response.data.cursor );
                        if(response.data.total > 400){
                            if (response.data.cursor < response.data.total){
                                setTimeout(async () => {
                                    console.log('next data');
                                    forLoopGetComments(items, response.data.cursor);
                                }, 2000);
                            } else {
                                switchNumber = 1;
                                postTiktokUserComments(clientName, items, newDataUsers)
                            }
                        } else {
                            setTimeout(async () => {
                                console.log('next data');
                                forLoopGetComments(items, response.data.cursor);
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