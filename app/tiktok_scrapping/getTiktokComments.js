import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";

export async function getTiktokComments(todayItems, cursorNumber) {

    console.log('Exec 1');

    let newDataUsers = [];    

    async function forLoopGetComments(todayItems, cursorNumber) {
        await tiktokCommentAPI(todayItems, cursorNumber).then (responseComments =>{
            let commentItems = responseComments.data.comments;
            for (let ii = 0; ii < commentItems.length; ii++) {
                if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                    if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                        newDataUsers.push(commentItems[ii].user.unique_id);
                    }
                }
            }
    
            if (responseComments.data.has_more === 1){    
                console.log(responseComments.data.cursor );
                setTimeout(async() => {
//                    console.log('next data');
                    await forLoopGetComments(todayItems, responseComments.data.cursor);
    
                }, 2000);
    
            } else {
//                console.log(responseComments.data.cursor );
                if(responseComments.data.total > 400){
                    if (responseComments.data.cursor < responseComments.data.total){
                        setTimeout(async () => {
                            console.log('next data');
                            await forLoopGetComments(todayItems, responseComments.data.cursor);
                        }, 2000);
                    } else {
                        let data = {
                            code : 200,
                            status : true,
                            userlist : newDataUsers
                        }
                        return data;
                    }
                } else {
                    let data = {
                        code : 200,
                        status : true,
                        userlist : newDataUsers
                    }
                    return data;
                }
            }
        
        }). catch (response => {
            console.log(response);
        });
    }

    await forLoopGetComments(todayItems, cursorNumber);

}