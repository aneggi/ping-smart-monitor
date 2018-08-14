const express = require('express');
const router = express.Router();
var debug_http = require('debug')('app:http');

router.get('/', function (req, res) {
    debug_http('Request home')
    var resp = [];
    hosts.forEach((host)=> {
        var hostData = db.get('pings')
        .filter({ host: host })
        .value()
        resp.push(createStatus(hostData));
    });

    res.send(resp);
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