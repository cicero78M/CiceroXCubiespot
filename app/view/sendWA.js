import { client } from "../../app.js";
//Response By User
export async function sendResponse(from, responseData, errormessage) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    let hours = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Jakarta"
    });     
    let time = localDate+" >> "+hours;
    switch (responseData.code){
        case 200:
            console.log(time+" SUCCESS GENERATE DATA");
            await client.sendMessage(from, responseData.data);
            break;
        case 303:                                
            console.log(responseData);
            await client.sendMessage(from, errormessage);
            break;
        case 201:
            console.log(time+" "+responseData);
            await client.sendMessage(from, responseData.data);
            break;
        default:
            console.log(time+" Something Error on Send Messages ");
            break;
    }   
}
//Response By Client
export async function sendClientResponse(clientID, supervisor, operator, group, responseData, type) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    let hours = d.toLocaleTimeString("en-US", {
        timeZone: "Asia/Jakarta"
    });     
    let time = localDate+" >> "+hours;
    switch (responseData.code){
        case 200 :
            console.log(time+" "+clientID+' SUCCESS '+type+' DATA');
            await client.sendMessage(supervisor, responseData.data);
            
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        case 303 :
            console.log(responseData);
            await client.sendMessage('6281235114745@c.us', time+" "+clientID+' FAIL '+type+' DATA');
            break;
        case 201:
            console.log(time+" "+responseData);
            await client.sendMessage(supervisor, responseData.data);
            await client.sendMessage(operator, responseData.data);
            await client.sendMessage(group, responseData.data);
            break;
        default:
            console.log("Something Error");
            break;
    }
}