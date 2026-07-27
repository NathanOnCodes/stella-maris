from functools import wraps

from django.contrib.auth.models import User

from core.exceptions import PermissaoNegada
from autenticacao.models.perfil_model import MASTER


def requer_admin(func):
    @wraps(func)
    def wrapper(solicitante: User, *args, **kwargs):
        if not solicitante.perfil.eh_administrador:
            raise PermissaoNegada("Ação restrita a administradores.")
        return func(solicitante, *args, **kwargs)
    return wrapper


def requer_master(func):
    @wraps(func)
    def wrapper(solicitante: User, *args, **kwargs):
        if solicitante.perfil.tipo != MASTER:
            raise PermissaoNegada("Ação restrita ao usuário master.")
        return func(solicitante, *args, **kwargs)

    return wrapper
