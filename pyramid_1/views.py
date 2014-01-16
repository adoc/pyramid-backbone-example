from pyramid.response import Response
from pyramid.view import view_config
import pyramid.httpexceptions as exc

from sqlalchemy.exc import DBAPIError

from .models import DBSession, DBCommit, User
from .validators import validate, UserSchema, UserGetSchema
from .util import chained


# View Utilities
# ==============

def get_user(view_callable):
    # I'm sure there's a better way to hook this request property.
    def _inner(context, request):
        def query(this):
            print(this)
            id_ = request.validated_matchdict['id']
            user = DBSession.query(User).get(id_)
            if user:
                return user
            else:
                raise exc.HTTPNotFound()
        request.set_property(query, 'user')
        return view_callable(context, request)
    return _inner


def userdict(user):
    """Model expected by backbone.js"""
    return {'id': user.id, 'name': user.name, 'value': user.value}


# Views
# =====

@view_config(route_name='users', request_method='GET', renderer='json')
def users_get(request):
    """Query and return a list of users."""

    users = DBSession.query(User).all()
    return [userdict(user) for user in users]


@view_config(decorator=validate(params=UserSchema), route_name='users',
                request_method='POST', renderer='json')
def users_post(request):
    """Create a new user."""

    name = request.validated_params['name']    
    value = request.validated_params['value']
    user = User(name=name, value=value)

    DBSession.add(user)
    DBSession.flush()
    return userdict(user)


@view_config(decorator=chained(validate(match=UserGetSchema), get_user),
                route_name='user', request_method='GET', renderer='json')
def user_get(context, request):
    """Get a specific user by `id`."""

    user = request.user
    return userdict(user)


@view_config(decorator=chained(
                        validate(params=UserSchema, match=UserGetSchema),
                        get_user),
                route_name='user', request_method='PUT', renderer='json')
def user_put(request):
    """Update an existing user with `id`"""

    user = request.user
    name = request.validated_params['name']
    value = request.validated_params['value']
    
    user.name = name
    user.value = value

    DBSession.add(user)
    DBCommit()
    return userdict(user)


@view_config(decorator=chained(validate(match=UserGetSchema), get_user),                
                route_name='user', request_method='DELETE', renderer='json')
def user_delete(request):
    """Delete a user with `id`."""

    user = request.user
    DBSession.delete(user)
    DBCommit()
    return True