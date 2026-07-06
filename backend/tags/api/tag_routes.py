from ninja import Router
from ninja_jwt.authentication import JWTAuth

from tags.api.tag_schemas import TagIn, TagOut, TagUpdate
from tags.services.tag_service import TagService

router = Router(tags=["Tags"])
auth = JWTAuth()


@router.get("/", response=list[TagOut])
def listar(request):
    return TagService.listar_tags()


@router.get("/{tag_id}", response=TagOut)
def obter(request, tag_id: int):
    return TagService.buscar_tag_por_id(tag_id)


@router.post("/", response=TagOut, auth=auth)
def criar(request, payload: TagIn):
    return TagService.criar_tag(payload.model_dump())


@router.put("/{tag_id}", response=TagOut, auth=auth)
def atualizar(request, tag_id: int, payload: TagUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    return TagService.atualizar_tag(tag_id, dados)


@router.delete("/{tag_id}", response={204: None}, auth=auth)
def deletar(request, tag_id: int):
    TagService.deletar_tag(tag_id)
    return 204, None
