var request = require('request');

var base_api_url = "https://api.um.warszawa.pl/api/action/wmsstore_get/?id=470bc91b-caf3-41e2-b790-289f1db7bbda"
base_api_url += "&apikey=klucz"
base_api_url += "&size=2000x2000"
// base_api_url += "&zoom=20"
base_api_url += "&center=52.1,21.3"
var base_api_result;
request(base_api_url, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var api_result = JSON.parse(body);
		console.log(body)
		base_api_result = new Buffer(api_result.result.base64map, 'base64');
	}
});

var http = require('http');
http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'image/png'});
	res.end(base_api_result);
}).listen(8080, '127.0.0.1');