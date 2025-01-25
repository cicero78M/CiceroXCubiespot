//Date Time
let d = new Date();
let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
let time = localDate+" >> "+hours;

export async function logsResponse(params) {
    return (time+ ">>" +params);
}