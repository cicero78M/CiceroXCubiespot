const express = require('express');
const app = express();
//const axios = require('axios');
//const fs = require('fs');

var dataBase = require('./database/database');

const { Client , LocalAuth } = require('whatsapp-web.js');
const figlet = require('figlet');
const banner = require('simple-banner');
const qrcode = require('qrcode-terminal');
//const cron = require('node-cron');

//const rawdata = fs.readFileSync('./filedata.json');
//const dataList = JSON.parse(rawdata);

const port = 3007;

app.listen(port, () => {
    console.log(`Cicero System Start listening on port >>> ${port}`)
});

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "Client_Name",
    }),
});

//initialize 
client.initialize();

client.on('authenthicated', (session)=>{

    console.log(session);
});

client.on('auth_failure', msg => {

    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {

    console.log(figlet.textSync("CICERO -X- CUBIES", {
        font: "Ghost",
        horizontalLayout: "fitted",
        verticalLayout: "default",
        width: 240,
        whitespaceBreak: true,
    }));

    banner.set("Cicero System Manajemen As A Services");
    console.log('===============================');
    console.log('===============================');
    console.log('======System Fully Loaded!=====');
    console.log('=========Enjoy the Ride========');
    console.log('===We\'ll Take Care Everything==');
    console.log('===============================');
    console.log('===============================');
});

//Pairing WA Center
client.on('qr', qr => {

    qrcode.generate(qr, {small: true});
});

client.on('message', async (msg) => {

    try {
        if (msg.isStatus){

            logsFile(d.toLocaleString(), msg.from, msg.body);
        
        } else {
    
            var d = new Date();
            const splittedMsg = msg.body.split("#");
    
            if (splittedMsg[1].toLowerCase === "newsheet"){
    
                console.log(msg.from);
    
                dataBase.newSheet(splittedMsg[1], "1gwXv8rHNgX16qbDqht_OPh0pbQI5jl1WjWZz3yrcSf8");
    
            }
        }
    } catch (error) {
        console.log(error);
    }


});