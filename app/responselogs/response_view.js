import { client } from "../../app";

export function logsResponse(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);
}

export function logsSend(params, message) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);

    client.sendMessage('6281235114745@c.us', message);
}

export function sendResponseData(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);

    client.sendMessage('6281235114745@c.us', params);
}