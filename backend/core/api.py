from http import HTTPStatus

from django.http import HttpRequest
from ninja import NinjaAPI

from core.exceptions import ErroBaseVoxRC, PermissaoNegada, RegistroNaoEncontrado

api = NinjaAPI(
    title="Vox Regina Caeli API",
    version="1.0.0",
    description="API REST da revista digital católica Vox Regina Caeli",
)


@api.get("/status", tags=["Sistema"])
def status(request: HttpRequest):
    return {
        "status": "operante",
        "versao": "1.0.0",
        "projeto": "Vox Regina Caeli",
    }


@api.exception_handler(RegistroNaoEncontrado)
def handler_registro_nao_encontrado(request: HttpRequest, exc: RegistroNaoEncontrado):
    return api.create_response(
        request,
        {"detail": exc.detalhe},
        status=exc.codigo_http,
    )


@api.exception_handler(PermissaoNegada)
def handler_permissao_negada(request: HttpRequest, exc: PermissaoNegada):
    return api.create_response(
        request,
        {"detail": exc.detalhe},
        status=exc.codigo_http,
    )


@api.exception_handler(ErroBaseVoxRC)
def handler_erro_base(request: HttpRequest, exc: ErroBaseVoxRC):
    return api.create_response(
        request,
        {"detail": exc.detalhe},
        status=exc.codigo_http,
    )
