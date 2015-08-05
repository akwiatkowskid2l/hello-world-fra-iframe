/*global System */

const auth = require('superagent-d2l-session-auth'),
	localeProvider = require('frau-locale-provider');

System.config({
	map: {
		ifrau: 'https://s.brightspace.com/lib/ifrau/0.7.2/ifrau.js',
		superagent: 'https://s.brightspace.com/lib/superagent/1.2.0/superagent.min.js'
	}
});

function createProperty(label, value) {
	const labelNode = document.createElement('strong');
	labelNode.appendChild(document.createTextNode(label + ': '));
	const liNode = document.createElement('li');
	liNode.appendChild(labelNode);
	liNode.appendChild(document.createTextNode(value));
	document.getElementById('props').appendChild(liNode);
}

function initOrgunit(client) {
	return client.request('orgUnit').then((orgUnit) => {
		createProperty('org id', orgUnit.OrgId);
		createProperty('org unit id', orgUnit.OrgUnitId);
	});
}

function initLang(client) {
	return localeProvider.getLangTag().then((langTag) => {
		document.getElementsByTagName('html')[0]
			.setAttribute('lang', langTag);
		createProperty('locale', langTag);
	});
}

function initRtl(client) {
	return localeProvider.isRtl().then((isRtl) => {
		if(isRtl) {
			document.body.dir = 'rtl';
		}
		createProperty('right-to-left', isRtl.toString());
	});
}

function installStyles(client) {
	return client.getService('style', '0.1')
		.then((style) => { return style.getFont(); })
		.then((font) => {
			document.body.style.fontFamily = font.family;
			document.body.style.fontSize= font.size;
			createProperty('font family', font.family);
			createProperty('font size', font.size);
		});
}

function whoami(client, request) {
	return new Promise((resolve, reject) => {
		client.request('valenceHost').then((valenceHost) => {
			createProperty('valence host', valenceHost);
			request.get(valenceHost + '/d2l/api/lp/1.0/users/whoami')
				.withCredentials()
				.use(auth)
				.end((err,res) => {
					document.getElementById('whoami')
						.appendChild(document.createTextNode(
							err ? err : res.text
						));
					resolve();
				});
		});
	});
}

Promise.all([
	System.import('ifrau'),
	System.import('superagent')
]).then((modules) => {
	const ifrau = modules[0],
		request = modules[1],
		client = new ifrau.Client();
	client
		.connect()
		.then(() => {
			client.setTitle('hello world iframe');
			Promise.all([
				initOrgunit(client),
				initLang(client),
				initRtl(client),
				whoami(client, request),
				installStyles(client)
			]).then(() => {
				document.getElementById('content').style.display = 'block';
			});
		});
	});
