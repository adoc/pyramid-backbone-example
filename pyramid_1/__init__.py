from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig as SessionFactory
from pyramid.authorization import ACLAuthorizationPolicy

from sqlalchemy import engine_from_config

import restauth

from .models import DBSession, Base

from pyramid.asset import resolve_asset_spec


def do(spec):
    name = resolve_asset_spec(spec)[0]
    return __import__(name, globals(), locals())


from restauth import Guest, TightGuest
from pyramid.security import Everyone, Authenticated, Allow


class ACL(object):
    __acl__ = [
        (Allow, Everyone, 'scaffold'),
        (Allow, Guest, 'ping'),
        (Allow, TightGuest, 'ping'),
        (Allow, Authenticated, 'ping'),
        (Allow, TightGuest, 'auth'),
        (Allow, Authenticated, 'auth_logout'),
        (Allow, Authenticated, 'inner_api')]


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    # SQLA
    # ====
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    acl = ACL()

    # Configurator
    # ============
    config = Configurator(
                    settings=settings,
                    root_factory=lambda r: acl,
                    session_factory=SessionFactory('pyramid_backbone_simple'))
    config.include('pyramid_chameleon')
    
    # Authentication API
    # ==================
    config.set_authentication_policy(
                restauth.RestAuthnPolicy(
                    b'server1',
                    remotes={b'guest': {'secret': b'Dyx3hRJs5XfcslWGKdRewSe2J85p8A4rxyIF4d0WHYphnfzOEE3ETQ9Kp4xojYeX', 
                                        'key': b''}}))
    config.set_authorization_policy(ACLAuthorizationPolicy())
    config.add_view(restauth.ping_view, permission='ping', route_name='api_ping',
                    request_method='GET', renderer='json')
    config.add_view(restauth.logout_view, permission='auth_logout',
                    route_name='api_auth', request_method="DELETE",
                    renderer='json')

    # Routes
    # ======
    # Users RESTful API
    config.add_route('api_ping', '/api/v1/ping')
    config.add_route('api_auth', '/api/v1/auth')

    config.add_route('api_users', '/api/v1/users')
    config.add_route('api_user', '/api/v1/users/{id}')

    # Site pages.
    config.add_route('site_index', '/')
    config.add_route('site_login', '/login')
    config.add_route('site_logout', '/logout')
    config.add_route('site_users', '/users')


    # Static Views
    config.add_static_view('/css', path='_css:css', cache_max_age=0)
    config.add_static_view('/js/lib', path='_js:lib', cache_max_age=3660)
    config.add_static_view('/js/site', path='_js:site', cache_max_age=0)
    config.add_static_view('/js/tmpl', path='_templates:backbone', cache_max_age=0)

    config.scan()
    return config.make_wsgi_app()