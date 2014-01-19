define([
    'jquery',
    'underscore',
    'backbone',
    'views'],
    function($, _, Backbone, UserList){
        var Router = Backbone.Router.extend({
            routes: {
                '': 'home'
            }
        });

        var initialize = function() {
            var router = new Router();
            var userList = new UserList();

            router.on('route:home', function() {
                userList.render();
            });

            Backbone.history.start();
        }

        return {initialize: initialize};
    });