import time
import json
import base64
import hmac
import hashlib
from functools import partial
from formencode import validators, Schema, Invalid
import pyramid.httpexceptions as exc
from pyramid import renderers

# Temporary
api_secret = "12345"
valid_clients = ["01918182783"]
hash_passes = 10
time_threshold = 600 * 1000


class AuthJsonRenderer(renderers.JSON):
    def __call__(self, info):
        render = renderers.JSON.__call__(self, info)

        def _render(value, system):
            request = system['request']
            send(value, request.response.headers)
            return render(value, system)
        return _render


class AuthException(Exception):
    pass

class SignatureBad(AuthException):
    pass

class ClientBad(AuthException):
    pass

class SignatureTimeout(AuthException):
    pass


json_dumps = partial(json.dumps, separators=(',', ':'))


def sign(timestamp, payload, meta):
    """ """
    h = hmac.new(api_secret.encode(), None, hashlib.sha256)
    print(timestamp.encode())
    print(payload.encode())
    print(meta.encode())    
    for i in range(hash_passes):
        h.update(timestamp.encode())
        h.update(payload.encode())
        h.update(meta.encode())        
    return base64.b64encode(h.digest()).decode(encoding='utf-8')


def verify(timestamp, signature, payload, meta):
    """ """
    timestamp = int(timestamp)
    utcnow = int(time.time())
    delta = utcnow - timestamp;

    if abs(delta) > time_threshold:
        raise SignatureTimeout("Signature it too old. %s:%s" % (utcnow, timestamp))
    challenge = sign(str(timestamp), payload, meta)
    print(challenge)
    if signature != challenge:
        raise SignatureBad("Incorrect HMAC challenge. %s:%s" % (signature, challenge))


def send(payload, headers):
    payload = payload or {}
    now = int(time.time())

    payload = json_dumps(payload)
    meta = json_dumps({})
    now = json_dumps(now)

    headers['X-Signature'] = sign(now, payload, meta)
    headers['X-Signature-Timestamp'] = now


def receive(payload, headers):
    signature = headers.get('X-Signature', '')
    timestamp = int(headers.get('X-Signature-Timestamp', 0))
    client_id = str(headers.get('X-Client-Id', ''))

    if not client_id in valid_clients:
        raise ClientBad("Client id %s is not a valid client." % cid)

    payload = json_dumps(payload)
    meta = json_dumps({'_cid': client_id})

    verify(timestamp, signature, payload, meta)


def authenticate(as_list=False):
    def _decorator(view_callable):
        def _inner(context, request):
            try:
                payload = request.json_body
            except ValueError:
                if as_list:
                    payload = []
                else:
                    payload = {}

            try:
                receive(payload, request.headers)
            except AuthException as e:
                print(e)
                raise exc.HTTPForbidden()

            return view_callable(context, request)
        return _inner
    return _decorator