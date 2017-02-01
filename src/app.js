/*global System */

const auth = require('superagent-d2l-session-auth'),
	localeProvider = require('frau-locale-provider');

System.config({
	map: {
		'ifrau/client': 'https://s.brightspace.com/lib/ifrau/0.13.1/ifrau/client.js',
		superagent: 'https://s.brightspace.com/lib/superagent/1.2.0/superagent.min.js'
	}
});

function getHost(baseUrl) {
	var host = /https?:\/\/([^\/]+).*/.exec(baseUrl)[1];
	return host;
}

function whoami(client, request) {
	return new Promise((resolve, reject) => {
		client.request('valenceHost').then((valenceHost) => {
			request.get(valenceHost + '/d2l/api/lp/1.0/users/whoami')
				.use(auth({ trustedHost: getHost(valenceHost) }))
				.end((err,res) => {
					resolve(err ? err : JSON.parse(res.text));
				});
		});
	});
}

Promise.all([
	System.import('ifrau/client'),
	System.import('superagent')
]).then((modules) => {
	const Client = modules[0],
		request = modules[1];
	new Client({ syncFont: true, syncLang: true})
		.connect()
		.then((client) => {
			Promise.all([
				/*client.request('orgUnit'),
				client.request('font'),
				whoami(client, request)*/
				client.getService( 'dialog', '0.1' )
			]).then((ifrauData) => {
				var dialog = ifrauData[0];
				var suxes = function(){ alert("good");
			};
				var fail = function(reason){ alert("bad" + reason);
			};
				dialog.openConfirm({
					title: "Upload in Progress",
					primaryMessage:"An image you pasted is still uploading. Do you want to wait until it's finished?",
					positiveButtonText: "Yes, wait",
					negativeButtonText: "No, save without the image"
				}
			).then( function(){suxes();},
		function(reason ){ fail(reason); }
	);
			//	openConfirm : function ( title, primaryMessage, secondaryMessage,primaryButtonText, secondaryButtonText ){
			 	//dialog.open( '/d2l/le/content/6606/delete/CreateSCDialog?objectId=11&deletableObjectType=0' );

				/*var data = {
					orgUnit: ifrauData[0],
					langTag: localeProvider.getLangTag(),
					isRtl: localeProvider.isRtl(),
					font: ifrauData[1],
					whoAmI: ifrauData[2]
				};
				var code = document.getElementById('ifrauData');
				code.appendChild(document.createTextNode(
						JSON.stringify(data, null, '    ')
					));
				hljs.highlightBlock(code);

				document.getElementById('content').style.display = 'block';*/

			});
		});
	});
