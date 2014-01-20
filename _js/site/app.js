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
                success: function () { Backbone.history.start() },
                error: function () { Events.trigger('logged_out'); },
                logged_in: function () { Events.trigger('logged_in'); },
                logged_out: function () { Events.trigger('logged_out'); },
                tight: Config.apiTight,
                apiDefault: Config.apiDefault,
                apiRoot: Config.apiRoot
            });
        }

        return {initialize: initialize};
    });