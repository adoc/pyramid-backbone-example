define(['jquery', 'underscore', 'backbone', 'events', 'auth', 'cookies', 'config'],
    function($, _, Backbone, Events, Auth, Cookies, Config) {

        // General initialize used by all pages that require backbone.js.
        var initialize = function(Route) {
            if (Config.requireApi) {
                // Wait for auth to get in to its tighter state.
                Events.on('ready_auth', function() {
                    Events.off('ready_auth', this.prototype); // Unregister this function from the event.
                    var router = new Route();
                    Backbone.history.start();
                });

                // Initialize auth and success callback.
                Auth.initialize(function() { Events.trigger('ready_auth'); });
            } else {
                var router = new Route();
                Backbone.history.start();
            }
        }

        window.set_cookies = function() {
            Cookies.set_cookies({
                recipients: {'server1': '12345'},
                clientId: 'client1',
                hmacPasses: 10},
            {
                prefix: 'rest_auth'
            });
        }
        
        window.unset_cookies = function() {
            Cookies.unset_cookies(['recipients', 'clientId', 'hmacPasses'],
            {
                prefix: 'rest_auth',
                verify: true
            })
        }

        return {initialize: initialize};
    });