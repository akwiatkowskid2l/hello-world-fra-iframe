/*global System */

const auth = require('superagent-d2l-session-auth'),
	localeProvider = require('frau-locale-provider');

System.config({
	map: {
		ifrau: 'https://s.brightspace.com/lib/ifrau/0.9.0/ifrau.js',
		superagent: 'https://s.brightspace.com/lib/superagent/1.2.0/superagent.min.js'
	}
});

function whoami(client, request) {
	return new Promise((resolve, reject) => {
		client.request('valenceHost').then((valenceHost) => {
			request.get(valenceHost + '/d2l/api/lp/1.0/users/whoami')
				.withCredentials()
				.use(auth)
				.end((err,res) => {
					resolve(err ? err : JSON.parse(res.text));
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
			Promise.all([
				client.request('orgUnit'),
				localeProvider.getLangTag(),
				localeProvider.isRtl(),
				client.request('font'),
				whoami(client, request)
			]).then((ifrauData) => {

				var langTag = ifrauData[1];
				document.getElementsByTagName('html')[0]
					.setAttribute('lang', langTag);

				var isRtl = ifrauData[2];
				if(isRtl) {
					document.body.dir = 'rtl';
				}

				var font = ifrauData[3];
				document.body.style.fontFamily = font.family;
				document.body.style.fontSize= font.size;

				var data = {
					orgUnit: ifrauData[0],
					langTag,
					isRtl,
					font,
					whoAmI: ifrauData[4]
				};
				var code = document.getElementById('ifrauData');
				code.appendChild(document.createTextNode(
						JSON.stringify(data, null, '    ')
					));
				hljs.highlightBlock(code);

				document.getElementById('content').style.display = 'block';

			});
		});
	});
