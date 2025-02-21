import { client } from "../../app.js";

export function logsSave(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);
}

export function logsSend(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);
    client.sendMessage('6281235114745@c.us', params);
}


export function logsUserSend(from,params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);
    client.sendMessage(from, params);
    setTimeout(console.log("Wait Five Second"), 5000);
    client.sendMessage('6281235114745@c.us', params);

}

export function logsError(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    switch (params.code) {
        case 201:

            console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params.data);
            client.sendMessage('6281235114745@c.us', params.data);
            
            break;

        case 303:
                
            console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params.data);
            client.sendMessage('6281235114745@c.us', params.message);
            
            break;
    
        default:
            break;
    }

}

export function logsUserError(from, params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    switch (params.code) {
        case 201:

            console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params.data);
            client.sendMessage(from, params.data);
           

            client.sendMessage('6281235114745@c.us', params.data);
           
            break;

        case 303:
                
            console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params.data);
            client.sendMessage(from, params.message);
             client.sendMessage('6281235114745@c.us', params.message);

            break;
    
        default:
            break;
    }

}