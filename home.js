const express = require('express');
const router = express.Router();
var debug_http = require('debug')('app:http');
const fs = require('fs');
const mustache = require('mustache');
const homeService = require('./homeService');

router.get('/', function (req, res) {
    debug_http('Request home')
    var rData = {records:homeService.getStatus()};  //{records:demoData};
    var page = fs.readFileSync('./views/home.html', "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, rData); // replace all of the data
    res.send(html);
  });

router.get('/detail/:adress', function (req, res) {
    debug_http(`Request a /detail/***' + ${req.params.adress}`);
    var resp =  homeService.getPings(req.params.adress);
    var rData = {records:resp};  //{records:demoData};
    var page = fs.readFileSync('./views/detail.html', "utf8"); // bring in the HTML file
    var html = mustache.to_html(page, rData); // replace all of the data
    res.send(html);
});

module.exports = router;