/*global System */

const auth = require('superagent-d2l-session-auth'),
	localeProvider = require('frau-locale-provider');

System.config({
	map: {
		ifrau: 'https://s.brightspace.com/lib/ifrau/0.7.2/ifrau.js',
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
	const ifrau = modules[0],
		request = modules[1],
		langTag = modules[2],
		client = new ifrau.Client();
	localeProvider.getLangTag().then((langTag) => {
		document.getElementsByTagName('html')[0]
			.setAttribute('lang', langTag);
		setProperty('locale', langTag);
	});
	localeProvider.isRtl().then((isRtl) => {
		if(isRtl) {
			document.body.dir = 'rtl';
		}
		setProperty('rtl', isRtl.toString());
	});
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
