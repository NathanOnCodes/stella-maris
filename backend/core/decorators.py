from functools import wraps

from django.contrib.auth.models import User

from core.exceptions import PermissaoNegada


def requer_admin(func):
    @wraps(func)
    def wrapper(solicitante: User, *args, **kwargs):
        if not solicitante.perfil.eh_administrador:
            raise PermissaoNegada("Ação restrita a administradores.")
        return func(solicitante, *args, **kwargs)
    return wrapper
