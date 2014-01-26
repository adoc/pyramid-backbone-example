define(['jquery', 'underscore', 'backbone', 'events', 'auth', 'cookies',
    'config'],
    function($, _, Backbone, Events, Auth, Cookies, Config) {

        Backbone.Router.prototype.refresh = function() {
            //http://stackoverflow.com/a/8991969
            var newFragment = Backbone.history.getFragment($(this).attr('href'));
            if (Backbone.history.fragment == newFragment) {
                // need to null out Backbone.history.fragement because 
                // navigate method will ignore when it is the same as newFragment
                Backbone.history.fragment = null;
                Backbone.history.navigate(newFragment, true);
            }
        }

        var initialize = function(Router) {
            var router = new Router();  

            // Initialize auth and success callback.
            Auth.api = Auth.initialize({
                apiDefault: Config.apiDefault,
                apiRoot: Config.apiRoot
            });

            if (Config.apiTight) {
                Events.on('backbone_auth.auth_tight', function () {
                    Events.off('backbone_auth.auth_tight', this.prototype);
                    Backbone.history.start();
                });
                Auth.api.tightenAuth();
            }
        }

        return {initialize: initialize};
    });