define([
    'backbone',
    'views',
    'auth_views',
    'auth',
    'events'
    ],
    function(Backbone, Views, AuthViews, Auth, Events){

        var LoginFormHeading = AuthViews.LoginFormHeading();
        var loginFormHeading = new LoginFormHeading();

        Events.on('auth.logged_out', function () {
            console.log('logged_out');
            //Auth.api.restAuth.logout();
            //Auth.remove_cookies();
            loginFormHeading.render();
        });

        Events.on('auth.logged_in', function() {
            console.log('logged_in');
            loginFormHeading.render(true);
        })

        var HomeRouter = function() {
            return Backbone.Router.extend({
                routes: {
                    '*path': 'home'
                },
                home: function (path) {
                }
            })
        }

        // Login page only.
        var LoginRouter = function() {
            var LoginForm = AuthViews.LoginForm();
            var loginForm = new LoginForm();

            return Backbone.Router.extend({
                routes: {
                    '*path': 'login'
                },
                login: function(path) {
                    // Redirect if we are logged in.
                    Events.on('auth.logged_in', function () {
                        var hash = Backbone.history.location.hash;

                        if (hash) {
                            window.location = hash.slice(1);
                        } else {
                            window.location = '/'; // Set this elsewhere.
                        }
                    });
                    loginForm.render();
                }
            })
        }

        // Logout link only.
        var LogoutRouter = function() {
            return Backbone.Router.extend({
                routes: {
                    '*path': 'logout'
                },
                logout: function(path) {
                    Events.trigger('view.logged_out');
                    Events.trigger('auth.logged_out');
                }
            })
        }
        
        var NotLoggedIn = AuthViews.NotLoggedIn();
        
        //
        var UsersListRouter = function() {
            var UserList = Views.UserList(); // Init the view object.
            var userList = new UserList(); // Construct the view object.

            return Backbone.Router.extend({
                routes: {
                    '*path': 'users_list'
                },
                users_list: function(path) {
                    var that = this;
                    var notLoggedIn = new NotLoggedIn();

                    if (Auth.api.restAuth.authenticated) {
                        Events.on('auth.logged_out', function () {
                            userList.remove();
                            userList.initialize();
                            notLoggedIn.render(that);
                        });
                        userList.render();
                    } 
                    else {
                        notLoggedIn.render(this);
                    }
                }
            });
        }

        // Return routes.
        return {
            HomeRouter: HomeRouter,
            LoginRouter: LoginRouter,
            LogoutRouter: LogoutRouter,
            UsersListRouter: UsersListRouter
        };
    });