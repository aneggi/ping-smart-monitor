

// LOCAL DB LOWDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const fs = require('fs');
var debug_http = require('debug')('app:http');

var config = JSON.parse(fs.readFileSync('./config.json','utf8'));




function createStatus(_pings){
    let _status = { 'host': _pings[0].host, 'name': _pings[0].name ,'status' : 'notcalculated', 'bclass': '' ,'nanswer' : 0 , 'nfailed' : 0   }
    //if(_status.host === "") _status.host = _ping.host;
    _pings.forEach((_ping) => {
        debug_http(` --> Create status for ${_ping.host} with time to answer of ${_ping.time}...`)
        
        if(_ping.alive === true) {
            _status.nanswer++ ;
        }
        else{
            _status.nfailed++;
        }
    } );
    if (_pings.length > 100 && _status.nfailed < 1) {
        _status.status = 'Perfect';
        _status.bclass = 'table-success';
    }else if (_pings.length > 100 && ((_status.nfailed/_pings.length)*100 < 1)){
        _status.status = 'Good';
        _status.bclass = 'table-success';
    }else if (_pings.length > 100 && ((_status.nfailed/_pings.length)*100 < 10)){
        _status.status = 'Warning';
        _status.bclass = 'table-warning';
    }
    else if (_pings.length > 100 && ((_status.nfailed/_pings.length)*100 > 9)){
        _status.status = 'Bad';
        _status.bclass = 'table-danger';
    } else {
        _status.status = 'Wait more data...';
        _status.bclass = 'table-info';
    }
    debug_http(` --> Set status of ${_status.host} as ${_status.status}...`)
    return _status
}

module.exports = {
    getStatus: function(){
        let resp = [];
        debug_http(`Processing ${config.hosts.length} hosts...`)
        config.hosts.forEach((host)=> {
            debug_http(` -> ${host.address} processing...`)
            var hostData = db.get('pings')
            .filter({ host: host.address })
            .value()
            debug_http(` -> Data from LOWDB - ${hostData[0]}...`)
            resp.push(createStatus(hostData));
            
        });
        debug_http(` -> Value of status for example - ${resp[0].status} ...`)
        return resp;
    }

}