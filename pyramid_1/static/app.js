define(['jquery', 'underscore', 'backbone', 'routes', 'events', 'auth', 'jquery_serialize_object'],
    function($, _, Backbone, Routes, Events, Auth) {

        var initialize = function() {
            // Wait for auth to get to its tighter state.
            Events.on('ready_auth', function() {
                Events.off('ready_auth', this.prototype); // Unregister this function from the event.
                Routes.initialize();
            });

            Auth.initialize(function() { Events.trigger('ready_auth'); });
        }

        return {
            initialize: initialize
        };
    });

            function set_cookies() {
                Cookie.set('rest_auth.recipients', JSON.stringify({'server1': '12345'}), 1, '/', '', false);
                Cookie.set('rest_auth.clientId', '"client1"', 1, '/', '', false);
                Cookie.set('rest_auth.hmacPasses', '10', 1, '/', '', false);
            }