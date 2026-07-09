from http import HTTPStatus

from django.http import HttpRequest
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from autenticacao.api.perfil_routes import router as autenticacao_router
from categorias.api.categoria_routes import router as categorias_router
from tags.api.tag_routes import router as tags_router
from publicacoes.api.publicacao_routes import router as publicacoes_router
from configuracoes.api.configuracao_routes import router as configuracoes_router
from core.exceptions import ErroBaseVoxRC, PermissaoNegada, RegistroNaoEncontrado

api = NinjaExtraAPI(
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


api.register_controllers(NinjaJWTDefaultController)
api.add_router("/autenticacao", autenticacao_router)
api.add_router("/categorias", categorias_router)
api.add_router("/tags", tags_router)
api.add_router("/publicacoes", publicacoes_router)
api.add_router("/configuracoes", configuracoes_router)
