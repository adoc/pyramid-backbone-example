define(['jquery', 'underscore', 'backbone', 'routes', 'jquery_serialize_object', 'authapi'],
    function($, _, Backbone, Routes) {
        var initialize = function(){
            Routes.initialize();
        }

        return {
            initialize: initialize
        };
    });