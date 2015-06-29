'use strict';

/*global System */

System
	.import('https://s.brightspace.com/lib/ifrau/0.2.0/ifrau.js')
	.then(function(ifrau) {
		var client = new ifrau.Client();
		client
			.connect()
			.then(function() {
				client.request('orgUnit').then(function(orgUnit) {
					console.log('orgUnit', orgUnit);
				});
				client.request('valenceHost').then(function(valenceHost) {
					console.log('valenceHost', valenceHost);
				});
			});
	});
