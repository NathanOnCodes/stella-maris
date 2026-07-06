from ninja import Router
from ninja_jwt.authentication import JWTAuth

from publicacoes.api.publicacao_schemas import (
    PublicacaoIn,
    PublicacaoOut,
    PublicacaoResumoOut,
    PublicacaoUpdate,
)
from publicacoes.services.publicacao_service import PublicacaoService

router = Router(tags=["Publicações"])
auth = JWTAuth()


@router.get("/", response=list[PublicacaoResumoOut])
def listar_publicas(request):
    return [
        PublicacaoService._publicacao_resumo_para_dict(p)
        for p in PublicacaoService.listar_publicacoes_publicas()
    ]


@router.get("/{slug}", response=PublicacaoOut)
def obter_publica(request, slug: str):
    publicacao = PublicacaoService.buscar_publicacao_por_slug(slug)
    return PublicacaoService._publicacao_para_dict(publicacao)


@router.get("/admin/", response=list[PublicacaoResumoOut], auth=auth)
def listar_admin(request):
    return [
        PublicacaoService._publicacao_resumo_para_dict(p)
        for p in PublicacaoService.listar_publicacoes_admin(request.auth)
    ]


@router.get("/admin/{publicacao_id}", response=PublicacaoOut, auth=auth)
def obter_admin(request, publicacao_id: int):
    publicacao = PublicacaoService.buscar_publicacao_por_id(publicacao_id)
    return PublicacaoService._publicacao_para_dict(publicacao)


@router.post("/admin/", response=PublicacaoOut, auth=auth)
def criar(request, payload: PublicacaoIn):
    publicacao = PublicacaoService.criar_publicacao(
        request.auth, payload.model_dump()
    )
    return PublicacaoService._publicacao_para_dict(publicacao)


@router.put("/admin/{publicacao_id}", response=PublicacaoOut, auth=auth)
def atualizar(request, publicacao_id: int, payload: PublicacaoUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    publicacao = PublicacaoService.atualizar_publicacao(
        request.auth, publicacao_id, dados
    )
    return PublicacaoService._publicacao_para_dict(publicacao)


@router.delete("/admin/{publicacao_id}", response={204: None}, auth=auth)
def deletar(request, publicacao_id: int):
    PublicacaoService.deletar_publicacao(request.auth, publicacao_id)
    return 204, None
