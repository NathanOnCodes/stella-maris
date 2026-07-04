from ninja import Router
from ninja_jwt.authentication import JWTAuth

from publicacoes.api.publicacao_schemas import (
    PublicacaoIn,
    PublicacaoOut,
    PublicacaoResumoOut,
    PublicacaoUpdate,
)
from publicacoes.services.publicacao_service import (
    _publicacao_para_dict,
    _publicacao_resumo_para_dict,
    atualizar_publicacao,
    buscar_publicacao_por_id,
    buscar_publicacao_por_slug,
    criar_publicacao,
    deletar_publicacao,
    listar_publicacoes_admin,
    listar_publicacoes_publicas,
)

router = Router(tags=["Publicações"])
auth = JWTAuth()


@router.get("/", response=list[PublicacaoResumoOut])
def listar_publicas(request):
    return [_publicacao_resumo_para_dict(p) for p in listar_publicacoes_publicas()]


@router.get("/{slug}", response=PublicacaoOut)
def obter_publica(request, slug: str):
    publicacao = buscar_publicacao_por_slug(slug)
    return _publicacao_para_dict(publicacao)


@router.get("/admin/", response=list[PublicacaoResumoOut], auth=auth)
def listar_admin(request):
    return [
        _publicacao_resumo_para_dict(p) for p in listar_publicacoes_admin(request.auth)
    ]


@router.get("/admin/{publicacao_id}", response=PublicacaoOut, auth=auth)
def obter_admin(request, publicacao_id: int):
    publicacao = buscar_publicacao_por_id(publicacao_id)
    return _publicacao_para_dict(publicacao)


@router.post("/admin/", response=PublicacaoOut, auth=auth)
def criar(request, payload: PublicacaoIn):
    publicacao = criar_publicacao(request.auth, payload.model_dump())
    return _publicacao_para_dict(publicacao)


@router.put("/admin/{publicacao_id}", response=PublicacaoOut, auth=auth)
def atualizar(request, publicacao_id: int, payload: PublicacaoUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    publicacao = atualizar_publicacao(request.auth, publicacao_id, dados)
    return _publicacao_para_dict(publicacao)


@router.delete("/admin/{publicacao_id}", response={204: None}, auth=auth)
def deletar(request, publicacao_id: int):
    deletar_publicacao(request.auth, publicacao_id)
    return 204, None
