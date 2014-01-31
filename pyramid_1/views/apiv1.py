import os

import base64

from pyramid.security import remember, forget
from pyramid.view import view_config
import pyramid.httpexceptions as exc

from sqlalchemy.sql.expression import desc

from restauth import ping_view

from ..models import DBSession, DBCommit, User
from ..validators import validate, UserSchema, UserGetSchema
from ..util import chained


temp_users = {'user': 'pass'}


# Auth Views
# ==========
# Not to be confused with REST auth but does instruct restauth after a
# successful auth here.
@view_config(permission='auth',
                route_name='api_auth',
                request_method='POST',
                renderer='json')
def auth(request):
    # This will be connected to a redis backend soon enough. muahahahah!
    params = request.json_body
    user = params['name']
    pass_ = params['pass']

    if temp_users.get(user) == pass_:
        return remember(request, None)
    else:
        raise exc.HTTPUnauthorized()


# View Utilities
# ==============
def get_user(view_callable):
    # I'm sure there's a better way to hook this request property.
    def _inner(context, request):
        def query(this):
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
# @auth_view_config(list, tight_auth=True,
#                     permission='users_list',
#                     route_name='api_users',
#                     request_method='GET', renderer='json')
@view_config(permission='inner_api',
                route_name='api_users',
                request_method='GET',
                renderer='json')
def users_get(request):
    """Query and return a list of users."""
    users = DBSession.query(User).order_by(desc(User.id)).all()
    return [userdict(user) for user in users]


@view_config(permission='inner_api', decorator=validate(params=UserSchema),
                    route_name='api_users', request_method='POST', renderer='json')
def users_post(request):
    """Create a new user."""

    name = request.validated_params['name']    
    value = request.validated_params['value']
    user = User(name=name, value=value)

    DBSession.add(user)
    DBSession.flush()
    return userdict(user)


@view_config(permission='inner_api', decorator=chained(
                                    validate(match=UserGetSchema),
                                    get_user),
                route_name='api_user', request_method='GET', renderer='json')
def user_get(context, request):
    """Get a specific user by `id`."""

    user = request.user
    return userdict(user)


@view_config(permission='inner_api', decorator=chained(
                            validate(params=UserSchema, match=UserGetSchema),
                            get_user),
                route_name='api_user', request_method='PUT', renderer='json')
def user_put(request):
    """Update an existing user with `id`"""

    name = request.validated_params['name']
    value = request.validated_params['value']
    
    user = request.user
    user.name = name
    user.value = value

    DBSession.add(user)
    DBSession.flush()
    return userdict(user)


@view_config(permission='inner_api', decorator=chained(
                                validate(match=UserGetSchema),
                                get_user),
                route_name='api_user', request_method='DELETE', renderer='json')
def user_delete(request):
    """Delete a user with `id`."""

    user = request.user
    DBSession.delete(user)
    DBCommit()
    return True