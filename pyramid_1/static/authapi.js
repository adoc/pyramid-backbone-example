define(['backbone', 'rest_auth'],
    
    // Provides bi-directional HMAC hooked in to Model and Collection.
    function(Backbone, RestAuth) {

        // Extend RestAuth with our settings.
        // These credentials should be found and injected elsewhere. (cookie, etc.)
        var AuthApi = RestAuth.extend({
            clientId: 'client1',
            recipients: {'server1': '12345'},
            hmacPasses: 10
        });

        authApi = new AuthApi();

        // Backbone.sync hook to provide bidirectional HMAC.
        function sync(method, model, options) {

            // Outbound hmac.
            if (method === 'delete') {
                options.headers = authApi.send({}, 'server1'); // Delete has no payload.
            } else {
                options.headers = authApi.send(model.toJSON(options), 'server1');
            }

            var success = options.success;
            // Inbound hmac callback.
            options.success = function(model, resp, xhr) {
                authApi.receive(xhr.responseJSON, xhr.getResponseHeader);
                if (success)
                    success(model, resp, options);
            }
            Backbone.sync.apply(this, [method, model, options]);
        }
        
        Backbone.Collection.prototype.sync = sync;
        Backbone.Model.prototype.sync = sync;
    });