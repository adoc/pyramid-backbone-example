from pyramid.view import view_config
import pyramid.httpexceptions as exc

from sqlalchemy.sql.expression import desc

from restauth import auth_view_config

from ..models import DBSession, DBCommit, User
from ..validators import validate, UserSchema, UserGetSchema
from ..util import chained


@view_config(route_name='site_index', renderer='index.html.mako')
def index(request):
    return {}


@view_config(route_name='site_users', renderer='users_list.html.mako')
def users(request):
    return {}