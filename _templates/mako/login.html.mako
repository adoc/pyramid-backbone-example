<%inherit file="desk.root.html.mako" />
<%def name="script()">
    require(['app', 'routes', 'config'], 
        function(App, Routes, Config) {
            // Initialize backbone.js app.
            Config.requireApi = true;
            Config.apiTight = true;
            Config.apiDefault = {
                        recipients: {_any: "Dyx3hRJs5XfcslWGKdRewSe2J85p8A4rxyIF4d0WHYphnfzOEE3ETQ9Kp4xojYeX"},
                        clientId: 'guest',
                        hmacPasses: 10
                    };
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