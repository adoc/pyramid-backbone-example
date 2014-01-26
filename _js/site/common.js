require.config({
    baseUrl: "/js/site",
    paths: {
        jquery: [
            //'//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min',
            '/js/lib/jquery-min'],
        underscore: [
            //'//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
            '/js/lib/underscore-min'],
        backbone: [
            //'//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
            '/js/lib/backbone-min'],
        text: [
            //'//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
            '/js/lib/text'],
        jquery_serialize_object: [
            //'//cdnjs.cloudflare.com/ajax/libs/jquery-serialize-object/2.0.0/jquery.serialize-object.compiled',
            '/js/lib/jquery.serialize-object.compiled'],
        crypto_core: [
            //'//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/core',
            '/js/lib/crypto-core'],
        crypto_sha: [
            //'//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/sha256',
            '/js/lib/crypto-sha256'],
        crypto_hmac: [
            //'//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/hmac',
            '/js/lib/crypto-hmac'],
        crypto_b64: [
            //'//crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64',
            '/js/lib/crypto-enc-base64'],
        rng: '//webmob.net/rng',
        cookie: '/js/lib/cookie/cookie',
        cookies: 'cookies/cookies',
        bytes: 'bytes/bytes',
        hmac: 'hmac/hmac',
        auth_client: 'auth_client/auth_client',
        auth: 'backbone_auth/backbone_auth',
    },
    shim: {
        backbone: {
            deps: ['jquery', 'underscore'],
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
        hmac: {
            deps: ['bytes', 'crypto_sha', 'crypto_hmac', 'crypto_b64']
        },
        auth_client: {
            deps: ['bytes', 'crypto_b64', 'rng', 'hmac']
        }
    },
    timeout: 1
});