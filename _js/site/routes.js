define(['backbone', 'views', 'auth', 'events'],
    function(Backbone, Views, Auth, Events){

        var LoginFormHeading = Views.LoginFormHeading();
        var loginFormHeading = new LoginFormHeading();

        Events.on('logged_out', function () {
            console.log('logged_out');
            Auth.api.logout();
            Auth.remove_cookies();
            //loginFormHeading.remove();
            //loginFormHeading = new LoginFormHeading();
            loginFormHeading.render();
        });

        Events.on('logged_in', function() {
            //console.log('logged_in');
            //loginFormHeading.remove();
            //loginFormHeading = new LoginFormHeading();
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
            var LoginForm = Views.LoginForm();
            var loginForm = new LoginForm();

            return Backbone.Router.extend({
                routes: {
                    '*path': 'login'
                },
                login: function(path) {
                    // Redirect if we are logged in.
                    Events.on('logged_in', function () {
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
                    Auth.remove_cookies();
                    Events.trigger('logged_out');
                }
            })
        }
        
        var NotLoggedIn = Views.NotLoggedIn();
        
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

                    if (Auth.api.authenticated) {
                        Events.on('logged_out', function () {
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