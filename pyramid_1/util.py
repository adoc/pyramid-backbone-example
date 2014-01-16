# Bad namespace is bad.


def chained(*decorators):
    """Combine argument list of `decorators` in to a single decorator.
    src: http://docs.pylonsproject.org/projects/pyramid_cookbook/en/latest/views/chaining_decorators.html
    """
    def floo(view_callable):
        for decorator in decorators:
            view_callable = decorator(view_callable)
        return view_callable
    return floo