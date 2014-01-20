<!doctype html>
<html>
    <head>
        <!-- Inspired by http://backbonetutorials.com/videos/beginner/ /-->
      %if hasattr(self, 'title'):
        <title>Backbone/Pyramid - ${self.title}</title>
      %else:
        <title>Backbone/Pyramid</title>
      %endif
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
        <link href="/css/root.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-default" role="navigation">
            <div class="nav navbar-header">
                <a class="navbar-brand" href="/">Backbone/Pyramid</a>
            </div>

            <ul class="nav nav-tabs">
                <li class="active"><a href="/">Home</a></li>
                <li ><a href="/users">People</a></li>
            </ul>

            <div id="login_form_container">
            </div>
        </nav>
        <div id="wrap">
            ${next.body()}
            <div id="push"></div>
        </div>
        <div id="footer">
            <div class="container">
                <p class="pull-left"><strong>A simple project to learn <a href="http://www.pylonsproject.org/">Pyramid</a> and <a href="http://backbonejs.org/">Backbone.js</a>.</strong></p>
                <div class="clearfix"></div>
                <p class="pull-left">by: <a href="https://github.com/adoc/">Nick Long</a> (Jan. 2014)</p>
                <div class="clearfix"></div>
                <p class="pull-left">Inspired by <a href="http://backbonetutorials.com/videos/beginner/">Backbone Tutorials</a> and <a href="http://backbonetutorials.com/organizing-backbone-using-modules/">Organizing Backbone</a></p>
                <div class="clearfix"></div>
                <div class="pull-right">
                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
                </div>
            </div>
        </div>
        <script src="/js/lib/require-min.js" type="text/javascript"></script>
        <script src="/js/site/common.js" type="text/javascript"></script>
        %if hasattr(next, 'script'):
        <script>
            ${next.script()}
        </script>
        %endif
    </body>
</html> 