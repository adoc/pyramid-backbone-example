require.config({
    paths: {
        jquery: [
            '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
            '/lib/jquery-min'],
        underscore: [
            '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
            '/lib/underscore-min'],
        backbone: [
            '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
            '/lib/backbone-min'],
        text: [
            '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
            '/lib/text.js'],
        jquery_serialize_object: [
            '//cdnjs.cloudflare.com/ajax/libs/jquery-serialize-object/2.0.0/jquery.serialize-object.compiled',
            '/lib/jquery.serialize-object.compiled'],
        crypto_core: [
            '//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/core',
            '/lib/crypto-core'],
        crypto_sha: [
            '//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/sha256',
            '/lib/crypto-sha256'],
        crypto_hmac: [
            '//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/hmac',
            '/lib/crypto-hmac'],
        crypto_b64: [
            '//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64',
            '/lib/crypto-enc-base64'],
        auth: '/lib/backbone-rest-auth/auth',
        rest_auth: '/lib/rest-auth/rest-auth',
        cookie: '/lib/cookie'
    },
    shim: {
        backbone: {
            deps: ['jquery','underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery_serialize_object: {
            deps: ['jquery']
        },
        crypto_sha: {
            deps: ['crypto_core']
        },
        crypto_hmac: {
            deps: ['crypto_core', 'crypto_sha', 'crypto_b64']
        },
        crypto_b64: {
            deps: ['crypto_core']
        },
        rest_auth: {
            deps: ['crypto_sha', 'crypto_hmac']
        }
    },
    timeout: 1
});

require(['app'], 
    function(App) {
        App.initialize();
    });