define(['backbone', 'events', 'auth', 'config'],
    function(Backbone, Events, Auth, Config) {
        return {
            initialize: function(Router) {
                var router = new Router();  

                // Initialize auth. (Hackish to put it on .api)
                Auth.api = Auth.initialize({
                    apiDefault: Config.apiDefault,
                    apiRoot: Config.apiRoot
                });

                // Instruct API client to require "tight" (IP Address hashing)
                // auth.
                if (Config.apiTight) {
                    Events.on('auth.auth_tight', function () {
                        Events.off('auth.auth_tight', this.prototype);
                        Backbone.history.start();
                    });
                    Auth.api.tightenAuth();
                } 
                else {
                    Backbone.history.start();
                }
            }
        };
    });