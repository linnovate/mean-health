var https = require('https');
var path = require('path');
var fs = require('fs');

exports.emit = function(event) {

	try {
		var root = path.dirname(module.parent.paths[0]);

		loadPackage(root, function(err, info) {
			if (err || !info) return;
			packagePulse(info.name, info.version);

		});

	} catch (e) {
		console.log('File read error: ' + e.message);
	}

};

function packagePulse(name, version) {

	var https = require('https');

	var options = {
		hostname: 'network.mean.io',
		port: 443,
		path: '/packages/pulse?name=' + name + '&version=' + version,
		method: 'GET'
	};

	var req = https.request(options, function(res) {

		res.on('data', function(d) {
			var json = parseJson(d);
			if (json) {
				if (!json.pulse) return console.log(name + ' does not have a pulse');
				if (json.message) console.log(json.message);

			}
		});
	});
	req.end();

	req.on('error', function(e) {
		console.error(e);
	});
}

function parseJson(data) {
	try {
		return JSON.parse(data.toString());
	} catch (e) {
		console.log('JSON parse error: ' + e.message);
		return null;
	}
}

function loadPackage(root, callback) {
	fs.readFile(root + '/package.json', function(err, data) {
		if (err || !data) return callback(true, err.message);

		var json = parseJson(data);
		if (json) return callback(null, json);

		return callback(true, e.message);
	});
}
