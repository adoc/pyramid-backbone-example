define(['backbone', 'config'],
    function(Backbone, Config) {

        var Login = Backbone.Model.extend({
            urlRoot: Config.apiRoot + '/auth',
            validate: function(attrs, options) {
                var validation_errors = [];
                if (attrs.name.length <= 0) {
                    validation_errors.push({"field": "name",
                                            "msg": "Must give a value"});
                }
                if (attrs.name.length > 32) {
                    validation_errors.push({"field": "name",
                                            "msg": "User name too long. (32 characters)"});
                }
                if (attrs.pass.length <= 0) {
                    validation_errors.push({"field": "pass",
                                            "msg": "Must give a value"});
                }
                if (attrs.pass.length < 3) {
                    validation_errors.push({"field": "pass",
                                            "msg": "Password too short. (3 characters)"});
                }
                if (attrs.pass.length > 128) {
                    validation_errors.push({"field": "pass",
                                            "msg": "Password too long. (128 characters)"});
                }
                if (validation_errors.length > 0) {
                    return validation_errors;
                }
            }
        });

        var User = Backbone.Model.extend({
            urlRoot: Config.apiRoot + '/users',
        
            validate: function(attrs, options) {
                // Just some simple validation for a better UX.
                var validation_errors = [];
                if (attrs.name.length <= 0) {
                    validation_errors.push({"field": "name",
                                            "msg": "Must give a value"});
                }
                if (attrs.name.length >= 128) {
                    validation_errors.push({"field": "name",
                                            "msg": "Name must be less than 128 characters."});
                }
                if (!parseInt(attrs.value)) {
                    validation_errors.push({"field": "value",
                                            "msg": "Value must be a number"});
                }
                if (validation_errors.length > 0) {
                    return validation_errors;
                }
            },
        
            set: function(attributes, options) {
                // Cast integer attributes for correct attribute hashing,
                // validation, etc.
                attributes.value = parseInt(attributes.value);
                return Backbone.Model.prototype.set.call(this, attributes, options);
            },
        });

        var Users = Backbone.Collection.extend({
                url: Config.apiRoot + '/users',
                model: User
            });

        return {
            Login: Login,
            User: User,
            Users: Users
        };
    });