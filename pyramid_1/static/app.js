define([
    'jquery',
    'underscore',
    'backbone',
    'routes'],
    function($, _, Backbone, Routes){
        var initialize = function(){
            Routes.initialize();
        }

        return {
            initialize: initialize
        };
    });