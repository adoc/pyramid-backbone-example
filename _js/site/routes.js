define([
    'backbone',
    'views',
    'auth_views',
    'auth',
    'events'
    ],
    function(Backbone, Views, AuthViews, Auth, Events){

        var NotLoggedIn = AuthViews.NotLoggedIn();

        // Set up login form event hooks.
        var LoginFormHeading = AuthViews.LoginFormHeading(); // Get the view "class".
        var loginFormHeading = new LoginFormHeading();

        Events.on('auth.logged_out', function () {
            console.log('auth.logged_out');
            loginFormHeading.render();
        });

        Events.on('auth.logged_in', function() {
            console.log('auth.logged_in');
            loginFormHeading.render(true);
        });

        // Home/Root Router.
        var HomeRouter = function() {
            return Backbone.Router.extend({
                routes: {
                    'users': 'users',
                    '*path': 'home'
                },
                home: function (path) {
                },
                users: function () {
                    var usersListRouter = getInstance(UsersListRouter);
                    usersListRouter.refresh();
                },
                logout: function () {
                    
                }
            });
        }

        var UsersListRouter = function() {
            var UserList = Views.UserList(); // Get the view "class".
            return Auth.AuthRequiredRouter.extend({
                routes: {
                    '*path': 'users_list'
                },
                // Set up some views.
                initialize: function() {
                    this.userList = new UserList();
                    this.notLoggedIn = new NotLoggedIn();
                    this.auth_required(); // Initialize auth_required.
                },
                // Render Not-Logged-In form.
                not_loggedin: function() {
                    var that = this;
                    // Hook event to refresh router 
                    Events.on('auth.logged_in', function () {
                        that.userList = new UserList();
                        that.refresh();
                    });
                    this.notLoggedIn.render();
                },
                // Render Users-List.
                users_list: function() {
                    var that = this;
                    // Hook event to remove userlist and render
                    //  not-logged-in form.
                    Events.on('auth.logged_out', function () {
                        that.userList.remove();
                        that.userList.initialize();
                        that.not_loggedin();
                    });
                    this.userList.render();
                }
            });
        }

        // Return routes.
        return {
            HomeRouter: HomeRouter,
            LoginRouter: function() { return Auth.LoginRouter(AuthViews.LoginForm()); },
            LogoutRouter: Auth.LogoutRouter,
            UsersListRouter: UsersListRouter
        };
    });