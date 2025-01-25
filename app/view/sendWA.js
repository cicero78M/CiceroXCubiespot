import { client } from "../../app.js";
import { logsResponse } from "../responselogs/response_view.js";
//Response By User
export async function sendResponse(from, responseData, errormessage) {
    
    switch (responseData.code){
        case 200:
            logsResponse("SUCCESS GENERATE DATA");
            await client.sendMessage(from, responseData.data);
            break;
        case 201:
            logsResponse(responseData);
            await client.sendMessage(from, responseData.data);
            break;
        case 303:                                
            logsResponse(responseData);
            await client.sendMessage(from, errormessage);
            break;
        default:
            logsResponse(responseData);
            break;
    }   
}
//Response By Client
export async function sendClientResponse(clientID, supervisor, operator, group, responseData, type) {

    switch (responseData.code){
        case 200 :
            logsResponse(clientID+' SUCCESS '+type+' DATA');
            await client.sendMessage(supervisor, responseData.data);           
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        case 201:
            logsResponse(responseData);
            await client.sendMessage(supervisor, responseData.data);
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        case 303 :
            logsResponse(responseData);
            await client.sendMessage('6281235114745@c.us', clientID+' FAIL '+type+' DATA');
            break;           
        default:
            logsResponse(responseData);
            break;
    }
}