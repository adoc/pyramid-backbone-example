import json
from pyramid.view import view_config
import pyramid.httpexceptions as exc

from sqlalchemy.sql.expression import desc


from ..models import DBSession, DBCommit, User
from ..validators import validate, UserSchema, UserGetSchema
from ..util import chained

def auth_defaults(request):
    return {'remotes':
                json.dumps(request.auth_api.build_client_defaults())}

@view_config(route_name='site_index', renderer='index.html.mako', permission='scaffold')
def index(request):
    return auth_defaults(request)


@view_config(route_name='site_users', renderer='users_list.html.mako', permission='scaffold')
def users(request):
    return auth_defaults(request)


@view_config(route_name='site_login', renderer='login.html.mako', permission='scaffold')
def login(request):
    return auth_defaults(request)


@view_config(route_name='site_logout', renderer='logout.html.mako', permission='scaffold')
def logout(request):
    return auth_defaults(request)    