function searchVHID(searchTerm) {
  // do fetch here
  // return results object above
}

/*
  ACTUAL server code
*/

var express = require('express');
var app = express();

var port = process.env.PORT || 8090; // dev port
// var port = process.env.PORT || 80; // set our port

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' }); 
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears/:descr/:endt/:stdt/:vhid')

  // get all the bears (accessed at GET http://localhost:8080/api/bears)
  .get(function(req, res) {
    var http = require('http');

    var descr = req.params.descr;
    var endt = req.params.endt;
    var stdt = req.params.stdt;
    var vhid = req.params.vhid;

    var urlpath = '/stats/search/findByVhidAndDescrAndEnddtBetween?descr='+descr+'&endt='+endt+'&stdt='+stdt+'&vhid='+vhid;

    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    var options = {
      host: 'dcoeng1-paev-1.tnc.virtela.cc',
      path: urlpath,
      port: 8090,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }

    };

    callback = function(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        var parsed = JSON.parse(str)
        console.log(str);
        res.json(parsed);
      });
    }

    http.request(options, callback).end();
  });

app.use('/api', router);
app.use(express.static('public'));

app.listen(port);
console.log('Magic happens on port ' + port);

// var server = app.listen(3000, function () {

//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);

// });