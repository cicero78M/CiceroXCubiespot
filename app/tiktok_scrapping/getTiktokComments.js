import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";

export async function getTiktokComments(items) {

    console.log('Exec Get Tiktok Comments');
    let newDataUsers = [];    
    newDataUsers.push(items);

    return new Promise((resolve, rejected) =>{

        let cursorNumber = 0;

        forLoopGetComments(items, cursorNumber);

        async function forLoopGetComments(items, cursorNumber) {

            console.log(items);
            tiktokCommentAPI(items, cursorNumber).then (response =>{

                let commentItems = response.data.comments;
                for (let ii = 0; ii < commentItems.length; ii++) {
                    if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                        if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                            newDataUsers.push(commentItems[ii].user.unique_id);
                        }
                    }
                }
    
                console.log("Find");
                if (response.data.has_more === 1){    
                    console.log("has more");
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

                            resolve (newDataUsers);
                        }
                    } else {
                        setTimeout(async () => {
                            console.log('next data');
                            forLoopGetComments(items, response.data.cursor);
                        }, 2000);                    
                    }
                }
                    
            }). catch (response => {
                rejected (response);
            });
        }

    });   
}