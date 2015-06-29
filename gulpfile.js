'use strict';

var publishOptions = {
	id: 'hello-world-fra-iframe',
	creds: {
		key: 'AKIAIM47CVYWTO5GGHVA',
		secret: process.env.S3_SECRET
	},
	devTag: process.env.TRAVIS_COMMIT,
	version: process.env.TRAVIS_TAG
};

var frau = require('free-range-app-utils'),
	gulp = require('gulp'),
	pg = require('peanut-gallery'),
	publisher = require('gulp-frau-publisher').app(publishOptions);

var appFilename = 'index.html';
var localAppResolver = frau.localAppResolver('hello-world-fra-iframe');

gulp.task('appconfig', function() {
	var target = (process.env.TRAVIS === 'true') ? publisher.getLocation()
		: localAppResolver.getUrl();
	return frau.appConfigBuilder.iframe.buildStream( target + appFilename )
		.pipe( gulp.dest('dist') );
});

gulp.task('appresolver', function() {
	localAppResolver.host();
});

gulp.task( 'publish-release', function( cb ) {
	gulp.src('./dist/**')
		.pipe( publisher.getStream() )
		.on( 'end', function() {
			var message = '[Deployment available online](' + publisher.getLocation() + appFilename + ')';
			pg.comment( message, {}, function( error, response ) {
				if( error )
					return cb( JSON.stringify( error ) );
				cb();
			} );
		} );
});
