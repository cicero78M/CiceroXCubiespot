export function logsResponse(params) {
    //Date Time
    let d = new Date();
    let localDate = d.toLocaleDateString("en-US", {timeZone: "Asia/Jakarta"});
    let hours = d.toLocaleTimeString("en-US", {timeZone: "Asia/Jakarta"});     
    let time = localDate+" >> "+hours;

    console.log(time+ " >> "+process.env.APP_SESSION_NAME+" >> "+params);
}