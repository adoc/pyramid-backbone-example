<%inherit file="desk.root.html.mako" />
<%def name="script()">
    require(['app'], 
        function(App) {
            App.initialize();
        });
</%def>
<div class="container">
    <h2>Users</h2>
    <hr />
    <div class="page"></div>
</div>