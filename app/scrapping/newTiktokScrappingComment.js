import { tiktokCommentAPI } from "../socialMediaAPI/tiktokAPI.js";

export async function getLikesTiktok(todayItems, cursorNumber) {

    console.log('Exec 1');

    let newDataUsers = [];    

    await tiktokCommentAPI(todayItems, cursorNumber).then (responseComments =>{

            let commentItems = responseComments.data.comments;
            for (let ii = 0; ii < commentItems.length; ii++) {
                if (commentItems[ii].user.unique_id != undefined || commentItems[ii].user.unique_id != null || commentItems[ii].user.unique_id != "") {
                    if (!newDataUsers.includes(commentItems[ii].user.unique_id)) {
                        newDataUsers.push(commentItems[ii].user.unique_id);
                    }
                }
            }

                console.log ('Time Skip');

            if (responseComments.data.has_more === 1){    

                console.log(responseComments.data.data.cursor );

                setTimeout(() => {
                    console.log('next data');
                    getLikesTiktok(todayItems, responseComments.data.cursor);

                }, 2000);

    
            } else {

                console.log(responseComments.data.data.cursor );

                if(responseComments.data.data.total > 400){
                    if (responseComments.data.data.cursor < responseComments.data.data.total){
                        setTimeout(() => {
                            console.log('next data');
                            getLikesTiktok(todayItems, responseComments.data.cursor);
        
                        }, 2000);
                    } else {

                        let data = {
                            code : 200,
                            status : true,
                            newDataUsers : newDataUsers
                        }
                        return data;

                    }

 

                } else {
    
                    let data = {
                        code : 200,
                        status : true,
                        newDataUsers : newDataUsers
                    }
                    return data;
                }
            }
    
    }). catch (response => {
        console.log(response);

        let data = {
            code : 204,
            status : false,
            newDataUsers : null

        }
        return data;    
    });

}