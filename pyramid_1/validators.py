import logging
log = logging.getLogger(__name__)

import pyramid.httpexceptions as exc

from formencode import validators, Schema, Invalid


def validate(params=None, match=None):
    """Basic validation decorator for usage in `view_config`.

    Takes `params` and `match` as arguments. 
        `params` - Schema to use to and instruct to validate requests.params
        `match` - Schema to use to and isntruct to validate request.match
    """
    if params is None and match is None: # Validate the usage of the validator!
        raise ValueError("`validate` expected a `params` schema or a `match` "
                            "schema.")
    if params and not issubclass(params, Schema):
        raise ValueError("`params` expected a `formencode.Schema` type.")
    if match and not issubclass(match, Schema):
        raise ValueError("`match` expected a `formencode.Schema` type.")
    def _decorator(view_callable):
        def _inner(context, request):
            def validate_params(this):
                try:
                    data = request.json_body or request.params
                    return params.to_python(data)
                except Invalid:
                    log.error("`validate` failed on request.params %s." % data)
                    raise exc.HTTPBadRequest()

            def validate_match(this):
                try:
                    return match.to_python(request.matchdict)
                except Invalid:
                    log.error("`validate` failed on request.matchdict %s." % request.matchdict)
                    raise exc.HTTPNotFound()

            if params:
                request.set_property(validate_params, 'validated_params',
                                        reify=True)
            if match:
                request.set_property(validate_match, 'validated_matchdict',
                                        reify=True)
            return view_callable(context, request)
        return _inner
    return _decorator


class UserSchema(Schema):
    """Simple schema for models.MyModel.
    """
    allow_extra_fields = True
    filter_extra_fields = True

    name = validators.UnicodeString(not_empty=True, max=128)
    value = validators.Int(not_empty=True)


class UserGetSchema(Schema):
    """Simple schema to validate matchdict for /users/:id routes.
    """
    allow_extra_fields = False

    id = validators.Int(not_empty=True)