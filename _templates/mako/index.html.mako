<%inherit file="desk.root.html.mako" />
<%def name="script()">
    require(['app', 'routes', 'config'], 
        function(App, Routes, Config) {
            // Initialize backbone.js app.
            Config.requireApi = true;
            Config.apiTight = true;
            Config.apiDefault = {remotes: ${remotes|n}};
            App.initialize(Routes.HomeRouter());
        });
</%def>
<div class="container">
    <div class="page">
        <h3>Welcome!</h3>
        <p>This is where things happen!</p>
    </div>
</div>