'use strict';

/*global System */

function setProperty(id, value) {
	document.getElementById(id).appendChild(
		document.createTextNode(value)
	);
}

System
	.import('https://s.brightspace.com/lib/ifrau/0.2.0/ifrau.js')
	.then(function(ifrau) {
		var client = new ifrau.Client();
		client
			.connect()
			.then(function() {
				client.setTitle('hello world iframe');
				client.request('orgUnit').then(function(orgUnit) {
					setProperty('orgId', orgUnit.OrgId);
					setProperty('orgUnitId', orgUnit.OrgUnitId);
				});
				client.request('valenceHost').then(function(valenceHost) {
					setProperty('valenceHost', valenceHost);
				});
			});
	});
