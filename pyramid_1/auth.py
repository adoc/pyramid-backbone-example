import time
import json
import base64
import hmac
import hashlib
import collections
import functools

import pyramid.httpexceptions as exc
from pyramid.view import view_config


# Provides consistency for serialization/hashing.
json_dumps = functools.partial(json.dumps, separators=(',', ':'))
json_loads = functools.partial(json.loads, object_pairs_hook=collections.OrderedDict)


# Exceptions
# ==========
class AuthException(Exception):
    pass


class SignatureBad(AuthException):
    pass


class ClientBad(AuthException):
    pass


class SignatureTimeout(AuthException):
    pass


# View Config
# ===========
def auth_view_config(model_type, *args, **kwa):
    def decorator(func):
        def _inner(request):
            auth_api = request.registry.settings['auth_api'] # Can I get this elsewhere?
            auth_api.receive(request, default_type=model_type)
            request.add_response_callback(auth_api.send)
            return func(request)
        _inner.__name__ = func.__name__
        kwa['_depth'] = 1
        return view_config(*args, **kwa)(_inner)
    return decorator


# Main Api
# ========
class AuthApi(object):
    """
    """
    def __init__(self, clients, passes=100, threshold=600):
        """
        """
        self.passes = passes
        self.threshold = threshold
        self.clients = clients

    def sign(self, client_id, timestamp, *args):
        """Tighter HMAC-SHA256 that uses the UTC timestamp and multiple
        passes.
        """
        #print(timestamp)
        #print(args[0])
        #print(args[1])
        secret = self.clients[client_id]
        h = hmac.new(secret.encode(), None, hashlib.sha256)
        for i in range(self.passes):
            h.update(timestamp.encode())
            for arg in args:
                h.update(arg.encode())            
        return base64.b64encode(h.digest()).decode(encoding='utf-8')

    def unsign(self, client_id, timestamp, signature, *args):
        """
        """
        timestamp = int(timestamp)
        utcnow = int(time.time())
        delta = utcnow - timestamp;
        if abs(delta) > self.threshold*1000:
            raise SignatureTimeout("Signature it too old. %s:%s" %
                                    (utcnow, timestamp))
        challenge = self.sign(client_id, str(timestamp), *args)
        if signature != challenge:
            raise SignatureBad("Incorrect HMAC challenge. %s:%s" %
                                (signature, challenge))

    def send(self, request, response):
        """
        """
        client_id = str(request.headers.get('X-Client-Id', ''))

        payload = json_loads(response.body.decode('utf-8'))

        now = int(time.time())

        payload = json_dumps(payload)
        meta = json_dumps({})
        now = json_dumps(now)

        response.headers['X-Signature'] = self.sign(client_id, now, payload, meta)
        response.headers['X-Signature-Timestamp'] = now

    def receive(self, request, default_type=dict):
        """
        """
        try:
            payload = json_loads(request.body.decode('utf-8'))
        except ValueError:
            if default_type is dict:
                default_type = collections.OrderedDict
            payload = default_type()

        signature = str(request.headers.get('X-Signature', ''))
        timestamp = int(request.headers.get('X-Signature-Timestamp', 0))
        client_id = str(request.headers.get('X-Client-Id', ''))

        if not client_id in self.clients:
            raise ClientBad("Client id %s is not a valid client." % client_id)

        payload = json_dumps(payload)
        meta = json_dumps({'_cid': client_id})

        self.unsign(client_id, timestamp, signature, payload, meta)