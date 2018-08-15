const express = require('express');
const router = express.Router();
var debug_http = require('debug')('app:http');
const fs = require('fs');
const mustache = require('mustache');
const homeService = require('./homeService');


var demoData = [{ 'host': '192.168.168.14' ,   'status': 'warning', 'bclass': 'table-warning' ,'nanswer':40 ,  'nfailed': 10 },
                { 'host': '192.168.168.10' ,   'status': 'good', 'bclass': 'table-light','nanswer':340, 'nfailed': 9 },            
                { 'host': '192.168.168.1' ,  'status': 'perfect', 'bclass': 'table-success', 'nanswer':1240 , 'nfailed': 4 },
];

router.get('/', function (req, res) {
    debug_http('Request home')
    var rData = {records:homeService.getStatus()};  //{records:demoData};
    var page = fs.readFileSync('home.html', "utf8"); // bring in the HTML file
    //debug_http(` > Router send data to view ${rData[0].host} and status of ${rData[0].status}...`)
    var html = mustache.to_html(page, rData); // replace all of the data
    res.send(html);
    //res.send(resp);
  });

router.get('/detail/:adress', function (req, res) {
    /*var resp = db.get(req.params.adress)
            .value()*/
    var resp = db.get('pings')
        .filter({ host: req.params.adress })
        .value()
        debug_http('Request a /detail/:address')
    res.send(resp);
});

router.get('/detail/', function (req, res) {
    debug_http('Request a /detail/')
    res.send(statLocalStorage);

});

module.exports = router;