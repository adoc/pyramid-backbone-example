// Just a little helper since most of our Routers and Views are
//  wrapped in functions.
function getInstance(classInit) {
    var Class = classInit();
    return new Class();
}

require.config({
    baseUrl: "/js/site",
    paths: {
        jquery: '/js/lib/jquery-min',
        underscore: '/js/lib/underscore-min',
        backbone: '/js/lib/backbone-min',
        text: '/js/lib/text',
        jquery_serialize_object: '/js/lib/jquery.serialize-object.compiled',
        crypto_core: '/js/lib/crypto-core',
        crypto_sha: '/js/lib/crypto-sha256',
        crypto_hmac: '/js/lib/crypto-hmac',
        crypto_b64: '/js/lib/crypto-enc-base64',
        rng: '/js/lib/rng',
        bytes: 'bytes/bytes',
        hmac: 'hmac/hmac',
        auth_client: 'auth_client/auth_client',
        persist: '/js/lib/persist-min',
        auth: 'backbone_auth/backbone_auth'
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
        },
        persist: {
            exports: 'Persist'
        },
        auth: {
            deps: ['persist']
        }
    },
    timeout: 1
});