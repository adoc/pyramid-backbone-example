define([
    'jquery',
    'underscore',
    'backbone',
    'models_collections',
    'text!/js/tmpl/users_list.html.tmpl',
    'jquery_serialize_object',
    ],
    function($, _, Backbone, Models, users_list_tmpl) {
        
        var Users = Models.Users
        
        var User = Models.User

        var UserList = Backbone.View.extend({
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
                        },
                        error: function(data) {
                            throw "saveUser: Server Error.";
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

        return UserList;
    });