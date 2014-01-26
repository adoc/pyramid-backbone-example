define([
    'jquery',
    'underscore',
    'backbone',
    'cookies',
    'models_collections',
    'events',
    'auth',
    'text!/js/tmpl/login.html.tmpl',
    'text!/js/tmpl/login_waiting.html.tmpl',
    'text!/js/tmpl/logout.html.tmpl',
    'text!/js/tmpl/users_list.html.tmpl',
    'jquery_serialize_object',
    ],
    function($, _, Backbone, Cookies, Models, Events, Auth, login_tmpl, login_waiting_tmpl, logout_tmpl, users_list_tmpl) {

        Backbone.View.prototype.remove = function() {
            this.undelegateEvents();
            this.$el.empty();
            this.stopListening();
            return this;
        }

        var invalidView = function(that, form, prefix) {
            /* Update view with errors/warnings for form validation. */
            function inner(model, errors) {
                /* validation error handler for this view. */
                that.invalid = true;

                $.each($('.form-group.has-error', form), function(i, clearme) {
                    // Clear any errors in the form.
                    $(clearme).removeClass('has-error');
                    $(clearme).children('label').html('');
                });

                for (i in errors) {
                    var error = errors[i];

                    if (error.hasOwnProperty('form')) {
                        var par = form.children('#form_label')
                        form.addClass('has-error');
                        par.children('label').html(error['msg']);

                    } else {
                        var field = error['field'];
                        if (prefix)
                            var name = prefix + '_' + field;
                        else
                            var name = field;
                        var el = form.find('input[name="' + name + '"]'); // TODO: Ugly. Use string replacement, templating, etc.
                        var par = el.parent('.form-group');
                        par.addClass('has-error');
                        par.children('label').html(error['msg']);
                    }
                }
            }
            return inner;
        }

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

                    // Refresh on login.
                    Events.on('backbone_auth.logged_in', function() {
                        router.refresh();
                    });
                }
            });
        }

        var LoginForm = function() {
            var Login = Models.Login;

            return Backbone.View.extend({
                el: '#login_form',
                events: {'submit #login_form': 'loginEvent',
                        'click button[name="login"]': 'loginEvent'},

                initialize: function () {
                    this.login = new Login();
                },

                render: function(edit) {

                    /* Render the data/template only. */
                    var template = _.template(login_tmpl, {
                            login: this.login,
                        });
                    this.$el.html(template);
                    this.invalid = false;
                },

                loginEvent: function(ev) {
                    var that = this;
                    var form = $(ev.currentTarget).closest('form');
                    var obj = form.serializeObject();
                    var userDetails = {name: obj.name, pass:obj.pass};
                    var login = new Login();
                    login.on("invalid", invalidView(this, form));

                    login.save(userDetails, {
                        success: Auth.api.loginSuccess,
                        error: function(xhr, Status) {
                            if(Status.status==401) {
                                login.trigger('invalid', null , [
                                    {'form': form,
                                    'msg': "User or Password is incorrect."}]);
                                return false;
                            } 
                            else if (Status.status==403) {

                            }
                        }
                    });

                    return false;
                },


            });
        }

        var LoginFormHeading = function() {
            return LoginForm().extend({
                el: '#login_form_container',
                events: {
                        'submit #login_form': 'loginEvent',
                        'click button[name="login"]': 'loginEvent',
                        'click button[name="logout"]': 'logout'
                },

                logout: function() {
                    Events.trigger('backbone_auth.logged_out');
                    return false;
                },

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

        var UserList = function() {
            var Users = Models.Users;
            var User = Models.User;

            return Backbone.View.extend({
                el: '.page',
                events: {
                    'click button[name="new"]': 'newUser',
                    'click button[name="save"]': 'saveUser',
                    'click button[name="edit"]': 'editUser',
                    'click button[name="delete"]': 'deleteUser',
                    'click button[name="cancel"]': 'renderOnly'
                },
                initialize: function() {
                    /* Init the UserList view */
                    this.users = new Users();
                    this.users.on('add', this.renderOnly, this);
                    this.users.on('remove', this.renderOnly, this);
                    this.invalid = false;
                },
                renderOnly: function(edit) {
                    /* Render the data/template only. */
                    var template = _.template(users_list_tmpl, {
                            users: this.users.models,
                            edit: edit
                        });
                    this.$el.html(template);
                    this.delete_state = null;
                    this.invalid = false;
                },
                render: function() {
                    /* Fetch data model and render template. */
                    var that = this;
                    this.users.fetch({
                        success: function() {
                            that.renderOnly();
                        }
                    });
                },

                invalidView: function(form, prefix) {
                    /* Update view with errors/warnings for form validation. */
                    var that = this;
                    function inner(model, errors) {
                        /* validation error handler for this view. */
                        that.invalid = true;

                        $.each($('.form-group.has-error', form), function(i, clearme) {
                            // Clear any errors in the form.
                            $(clearme).removeClass('has-error');
                            $(clearme).children('label').html('');
                        });

                        for (i in errors) {
                            var error = errors[i];
                            var field = error['field'];
                            var msg = error['msg'];
                            var el = form.find('input[name="' + prefix + '_' + field + '"]'); // TODO: Ugly. Use string replacement, templating, etc.
                            var par = el.parent('.form-group');
                            par.addClass('has-error');
                            par.children('label').html(msg);
                        }
                    }
                    return inner;
                },
                getUserId: function(ev) {
                    /* */
                    return $(ev.currentTarget).data('id');
                },
                newUser: function(ev) {
                    /* New user intent. Serialize and save. 
                    */
                    var that = this;
                    var form = $(ev.currentTarget).closest('form');
                    var obj = form.serializeObject();
                    var userDetails = {name: obj.new_name, value:obj.new_value};
                    user = new User();
                    user.on("invalid", this.invalidView(form, 'new'));
                    user.save(userDetails, {
                        success: function () {
                            that.users.add(user);
                        },
                        error: function(xhr, textStatus) {
                            if(textStatus.status==400) {
                                throw("newUser: Server said request was bad.");
                            } else {
                                throw("newUser: Server Error.");
                            }
                        }
                    });
                },
                saveUser: function(ev) {
                    /* 
                    TODO: Refactor this and newUser. Similar code.
                    */
                    var that = this;
                    var form = $(ev.currentTarget).closest('form');
                    var obj = form.serializeObject();
                    var userDetails = {name: obj.edit_name, value:obj.edit_value};
                    var id = this.getUserId(ev);
                    var user = this.users.get(id);

                    user.on("invalid", this.invalidView(form, 'edit'));
                    user.set(userDetails, {validate: true});
                    if (user.hasChanged()) { // Does .save really not check to see if the model has changed?
                        user.save(userDetails, {
                            success: function () {
                                that.renderOnly(null);
                            }
                        });
                    } else if (!this.invalid) {
                        that.renderOnly(null);
                    }
                },
                editUser: function(ev) {
                    /* Instruct render to show edit "subview" for user of `id`. */ 
                    var id = this.getUserId(ev);
                    this.renderOnly(id);                    
                },
                deleteUser: function(ev) {
                    /* Instructs removal of user of `id`. */
                    var el = ev.currentTarget;
                    if (this.delete_state && this.delete_state == el) {
                        var id = this.getUserId(ev);
                        var user = this.users.get(id);
                        user.destroy();
                        this.deleteCancel(ev);
                    } else if (this.delete_state && this.delete_state != el) {
                        this.deleteCancel(this.delete_state);
                        this.deleteReady(ev);
                    } else {
                        this.deleteReady(ev);
                    }
                },
                deleteReady: function(ev) {
                    /* Ready the delete. Start the timer. */
                    var that = this;
                    var el = ev.currentTarget;
                    this.delete_state = el;
                    clearInterval(this.deleteTimer);
                    this.deleteTimer = setInterval(function() {that.deleteCancel(ev);}, 3000);
                    $(ev.currentTarget).addClass('btn-danger');
                },
                deleteCancel: function(ev) {
                    /* Cancel the delete and timer. */ 
                    $(ev.currentTarget).removeClass('btn-danger');
                    this.delete_state = null;
                    clearInterval(this.deleteTimer);
                },
            });
        }

        return {
            NotLoggedIn: NotLoggedIn,
            LoginForm: LoginForm,
            LoginFormHeading: LoginFormHeading,
            UserList: UserList
        };
    });