define(['jquery', 'underscore', 'backbone', 'pyramid_auth'],
    function($, _, Backbone, PyramidAuth) {
        /* Provides bi-directional HMAC.
        Hooks in to Backbone.Model.sync and Backbone.Collection.sync rather simply.
        */

        //Temporary
        var api_secret = "12345";
        var client_id = "01918182783";
        var hash_passes = 10;

        function sync(method, model, options) {
            /* Backbone.sync hook to provide bidirectional HMAC. */
            var AuthApi = PyramidAuth.extend({
                clientId: client_id,
                hmacSecret: api_secret,
                hmacPasses: hash_passes
            });

            auth = new AuthApi();

            console.log(auth);

            // Outbound hmac.
            if (method === 'delete') {
                options.headers = auth.send({}); // Delete has no payload.
            } else {
                options.headers = auth.send(model.toJSON(options));
            }

            var success = options.success;
            options.success = function(model, resp, xhr) {
                // Inbound hmac.
                auth.receive(xhr.responseJSON, xhr.getResponseHeader);
                if (success)
                    success(model, resp, options);
            }
            Backbone.sync.apply(this, [method, model, options]);
        }
        
        Backbone.Collection.prototype.sync = sync;
        Backbone.Model.prototype.sync = sync;

        //return AuthApi;
    });