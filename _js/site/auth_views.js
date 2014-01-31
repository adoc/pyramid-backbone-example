define([
    'jquery',
    'underscore',
    'backbone',
    'views',
    'events',
    'auth',
    'text!/js/tmpl/login.html.tmpl',
    'text!/js/tmpl/login_waiting.html.tmpl',
    'text!/js/tmpl/logout.html.tmpl',
    'text!/js/tmpl/users_list.html.tmpl',
    'jquery_serialize_object',
    ],
    function($, _, Backbone, Views, Events, Auth, login_tmpl,
                login_waiting_tmpl, logout_tmpl) {

        var NotLoggedIn = function () {
            return Backbone.View.extend({
                el: '.page',
                render: function (router) {
                    var template = _.template(login_waiting_tmpl);
                    this.$el.html(template);

                    // Highlight login form.
                    $("#login_form").addClass('has-warning');
                    $('#login_form button[name="login"]').removeClass("btn-primary");
                    $('#login_form button[name="login"]').addClass("btn-warning");

                    // Refresh router on login.
                    Events.on('auth.logged_in', function () {
                        router.refresh();
                    });
                }
            });
        }

        var LoginForm = function() {
            return Auth.LoginView.extend({
                el: '#login_form',
                events: {'submit #login_form': 'loginEvent',
                        'click button[name="login"]': 'loginEvent'},
                invalidForm: Views.invalidForm,
                render: function(edit) {
                    /* Render the data/template only. */
                    var template = _.template(login_tmpl, {
                            login: this.login,
                        });
                    this.$el.html(template);
                    this.invalid = false;
                },
            });
        }

        var LoginFormHeading = function() {
            return Auth.LoginView.extend({
                el: '#login_form_container',
                events: {
                        'submit #login_form': 'loginEvent',
                        'click button[name="login"]': 'loginEvent',
                        'click button[name="logout"]': 'logout'
                },
                invalidForm: Views.invalidForm,
                render: function(logout) {
                    if (logout) {
                        var template = _.template(logout_tmpl, {
                                            login: this.login,
                                        });
                    }
                    else {
                        var template = _.template(login_tmpl, {
                                            login: this.login,
                                        });
                    }
                    this.$el.html(
                            '<form id="login_form" class="nav navbar-form navbar-left">' +
                            template +
                            '</form>');
                }
            });
        }

        return {
            NotLoggedIn: NotLoggedIn,
            LoginForm: LoginForm,
            LoginFormHeading: LoginFormHeading
        };
    });