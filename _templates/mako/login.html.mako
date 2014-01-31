<%inherit file="desk.root.html.mako" />
<%def name="script()">
    require(['app', 'routes', 'config'], 
        function(App, Routes, Config) {
            // Initialize backbone.js app.
            Config.requireApi = true;
            Config.apiTight = true;
            Config.apiDefault = {remotes: ${remotes|n}};
            App.initialize(Routes.LoginRouter());
        });
</%def>
<div class="container">
    <h2>login</h2>
    <hr />
    <div class="page">
        <div style="width: 300px">
            <form id="login_form">
            </form>
        </div>
    </div>
</div>