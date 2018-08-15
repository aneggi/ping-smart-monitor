// Debugging
process.env.DEBUG='app:*'; //app:http ecc per vedere solo uno
var debug_work = require('debug')('app:work');
var debug_http = require('debug')('app:http');

// LOCAL DB LOWDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const fs = require('fs');
const home = require('./home.js');
const ping = require('ping');
const express = require('express');
const app = express();

var config = JSON.parse(fs.readFileSync('./config.json','utf8'));
const hosts = [];
var lastPings  = [];
var pingCycle = 0;

app.use('/', home);
app.use("/public", express.static(__dirname + '/public'));
// Check ready to run

function run() {
    console.log('PING-Monitor-v0.1 - Satrting (' + Date.now() + ')');
    if (!db.has('pings')
        .value()) {
            db.set('pings', [])
        .write()
        debug_work(`Aggiunto il repository *pings*`)
        }
    config.hosts.forEach((_host)=>{
        hosts.push(_host.address);
        console.log(' -> ' + _host.address);
    });
    debug_work(`Pings time set to: ${config.pings} `);
    debug_work('Configurations finished...');
    setTimeout(groupPingExecution , 500);
    
}
run();

function groupPingExecution(){
        if(lastPings.length != 0 ) lastPings = [];
        hosts.forEach(function(host){ping.promise.probe(host)
            .then(function(res){
                db.get('pings')
                    .push({ 'host': host ,   'reqtime': Date.now(),'alive': res.alive, 'time': res.time })
                    .write();
            }); 
        });    
    setTimeout(groupPingExecution , config.pings); 
    pingCycle++; 
}

app.listen(3002,function (){
    console.log('Webserver listening on port 3002');
});
