/*global System */

let auth = require('superagent-d2l-session-auth');

System.config({
	map: {
		ifrau: 'https://s.brightspace.com/lib/ifrau/0.4.0/ifrau.js',
		superagent: 'https://s.brightspace.com/lib/superagent/1.2.0/superagent.min.js'
	}
});

function setProperty(id, value) {
	document.getElementById(id).appendChild(
		document.createTextNode(value)
	);
}

Promise.all([
	System.import('ifrau'),
	System.import('superagent')
]).then((modules) => {
	let ifrau = modules[0],
		request = modules[1],
		client = new ifrau.Client();
	client
		.connect()
		.then(() => {
			client.setTitle('hello world iframe');
			client.request('orgUnit').then((orgUnit) => {
				setProperty('orgId', orgUnit.OrgId);
				setProperty('orgUnitId', orgUnit.OrgUnitId);
			});
			client.request('valenceHost').then((valenceHost) => {
				setProperty('valenceHost', valenceHost);
				request.get(valenceHost + '/d2l/api/lp/1.0/users/whoami')
					.withCredentials()
					.use(auth)
					.end((err,res) => {
						setProperty('whoami', err ? err : res.text);
					});
			});
		});
	});
