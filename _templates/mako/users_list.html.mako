<%inherit file="desk.root.html.mako" />
<%def name="script()">
    require(['app', 'routes', 'config'], 
        function(App, Routes, Config) {
            // Initialize backbone.js app.
            Config.requireApi = true;
            Config.apiTight = true;
            Config.apiDefault = {remotes: ${remotes|n}};
            App.initialize(Routes.UsersListRouter());
        });
</%def>
<div class="container">
    <h2>Users</h2>
    <hr />
    <div class="page">
        <img style="display: block; margin: 0 auto; width: 800px;" src="/css/loading.gif" />
    </div>
</div>