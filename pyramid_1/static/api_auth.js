define(['jquery', 'underscore', 'backbone', 'crypto_sha', 'crypto_hmac'],
    function($, _, Backbone) {
        var ApiAuth = function() {
            /* REST API Authentication using HMAC. */
            return {
                init: function (clientId, hmacSecret, hmacPasses, timeThreshold, timeProvider) {
                    this.clientId = clientId.toString();
                    this.hmacSecret = hmacSecret.toString();
                    this.hmacPasses = hmacPasses || 100;
                    this.hmacHash = CryptoJS.algo.SHA256;
                    this.hmacEncode = CryptoJS.enc.Base64;
                    timeThreshold = parseInt(timeThreshold) || 600;
                    this.timeThreshold = timeThreshold * 1000; // In ms.
                    this.timeProvider = timeProvider || function() { return new Date().getTime() / 1000; };
                },
                sign: function (timestamp, payload, meta) {
                    /* Tighter HMAC-SHA256 that uses the UTC timestamp and multiple passes.
                    
                    Unfortunately this will cause issues on client machines whos clock is wrong, but we can also warn about that.
                    */
                    //console.log(timestamp.toString());
                    //console.log(payload.toString());
                    //console.log(meta.toString());                    
                    var hmac = CryptoJS.algo.HMAC.create(this.hmacHash, this.hmacSecret);
                    for (i = 0; i < this.hmacPasses; i++) {
                        hmac.update(timestamp.toString());
                        hmac.update(payload.toString());
                        hmac.update(meta.toString());                        
                    }
                    return hmac.finalize().toString(this.hmacEncode);
                },
                verify: function (signature, timestamp, payload, meta) {
                    /* */
                    timestamp = parseInt(timestamp);
                    var now = parseInt(this.timeProvider());
                    var delta = now - timestamp;
                    if (Math.abs(delta) > this.timeThreshold) {
                        throw "api_auth.verify: Signature is too old.";
                    }
                    var challenge = this.sign(timestamp, payload, meta);
                    if (signature !== challenge) {
                        throw "api_auth.verify: Incorrect HMAC challenge.";
                    }
                },
                send: function (payload) {
                    /* */
                    payload = payload || {};

                    var now = parseInt(this.timeProvider());

                    payload = JSON.stringify(payload);
                    meta = JSON.stringify({_cid: this.clientId});

                    var signature = this.sign(now, payload, meta);

                    var headers = {"X-Signature": signature,
                                    "X-Signature-Timestamp": now,
                                    "X-Client-Id": this.clientId};
                    return headers;

                },
                receive: function (payload, headers) {
                    /* */
                    var signature = headers("X-Signature");
                    var timestamp = headers("X-Signature-Timestamp");
                    payload = JSON.stringify(payload);
                    var meta = JSON.stringify({});
                    this.verify(signature, timestamp, payload, meta);
                }
            }
        };

        //Temporary
        var api_secret = "12345";
        var client_id = "01918182783";
        var hash_passes = 10;

        function sync(method, model, options) {
            /* Backbone.sync hook to provide bidirectional HMAC. */
            var auth = new ApiAuth();
            auth.init(client_id, api_secret, hash_passes);

            options.headers = auth.send(model.toJSON(options));

            var success = options.success;
            options.success = function(model, resp, xhr) {
                auth.receive(xhr.responseJSON, xhr.getResponseHeader);
                if (success)
                    success(model, resp, options);
            }
            Backbone.sync.apply(this, [method, model, options]);
        }
        
        Backbone.Collection.prototype.sync = sync;
        Backbone.Model.prototype.sync = sync;

        return ApiAuth;
    });