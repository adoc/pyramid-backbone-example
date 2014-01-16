from sqlalchemy import Column, Index, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

import transaction

from zope.sqlalchemy import ZopeTransactionExtension

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()

def DBCommit():
    """Just a convenient wrapper for SQLA Session commit and rollback if needed.
    """
    try:
        transaction.commit()
    except DBAPIError:
        # Not sure this is right. The Zope Transaction stuff is new to me.
        transaction.rollback()
        raise
    else:
        return True

class User(Base):
    __tablename__ = 'models'
    id = Column(Integer, primary_key=True)
    name = Column(Text)
    value = Column(Integer)


Index('my_index', User.name, unique=True, mysql_length=255)