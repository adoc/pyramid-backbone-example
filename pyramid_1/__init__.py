from pyramid.config import Configurator
from pyramid.session import UnencryptedCookieSessionFactoryConfig as SessionFactory
from pyramid.events import NewRequest, NewResponse

from sqlalchemy import engine_from_config

from .models import DBSession, Base
from restauth import PyramidAuthApiServer


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    # SQLA
    # ====
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    # Configurator
    # ============
    config = Configurator(settings=settings,
                    session_factory=SessionFactory('pyramid_backbone_simple'))
    config.include('pyramid_chameleon')
    
    # Authentication API
    # ==================
    # Note: Can I put this elsewhere? This is a little Pylons-ish
    #   (except the config isn't global.)
    config.add_settings({'auth_api': PyramidAuthApiServer('server1',
                                             remotes={'client1': '12345'},
                                             passes=10)})

    # Routes
    # ======
    # Users RESTful API
    config.add_route('users', '/users')
    config.add_route('user', '/users/{id}')

    # Static Views
    # ============
    config.add_static_view('/', 'static', cache_max_age=0)


    config.scan()
    return config.make_wsgi_app()