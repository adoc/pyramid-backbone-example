define(['backbone', 'auth', 'config'],
    function(Backbone, Auth, Config) {
        var User = Auth.EnabledModel.extend({
            uri: '/users',
        
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

        var Users = Auth.EnabledCollection.extend({
                uri: '/users',
                model: User
            });

        return {
            User: User,
            Users: Users
        };
    });