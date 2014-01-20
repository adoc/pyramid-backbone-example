define(['jquery', 'underscore', 'backbone', 'views'],
    function($, _, Backbone, UserList){
        var userList = new UserList();

        var UsersListRoute = Backbone.Router.extend({
            routes: {
                '': 'users_list'
            },
            users_list: function() {
                userList.render();
            }
        });

        return {UsersListRoute: UsersListRoute};
    });