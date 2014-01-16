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
            if params:
                try:
                    request.params = params.to_python(request.params)
                except Invalid:
                    raise exc.HTTPBadRequest()
            if match:
                try:
                    request.matchdict = match.to_python(request.matchdict)
                except Invalid:
                    raise exc.HTTPNotFound()
            return view_callable(context, request)
        return _inner
    return _decorator


class MyModelSchema(Schema):
    """Simple schema for models.MyModel.
    """
    allow_extra_fields = True
    filter_extra_fields = True

    name = validators.UnicodeString(max=128)
    value = validators.Int()


class UserMatchSchema(Schema):
    """Simple schema to validate matchdict for /users/:id routes.
    """
    allow_extra_fields = False

    id = validators.Int()