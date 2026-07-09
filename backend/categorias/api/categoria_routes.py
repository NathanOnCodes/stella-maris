from ninja import Router
from ninja_jwt.authentication import JWTAuth

from categorias.api.categoria_schemas import (
    CategoriaIn,
    CategoriaOut,
    CategoriaUpdate,
)
from categorias.services.categoria_service import CategoriaService

router = Router(tags=["Categorias"])
auth = JWTAuth()


@router.get("/", response=list[CategoriaOut])
def listar(request):
    return CategoriaService.listar_categorias()


@router.get("/{categoria_id}", response=CategoriaOut)
def obter(request, categoria_id: int):
    return CategoriaService.buscar_categoria_por_id(categoria_id)


@router.post("/", response=CategoriaOut, auth=auth)
def criar(request, payload: CategoriaIn):
    return CategoriaService.criar_categoria(request.auth, payload.model_dump())


@router.put("/{categoria_id}", response=CategoriaOut, auth=auth)
def atualizar(request, categoria_id: int, payload: CategoriaUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    return CategoriaService.atualizar_categoria(request.auth, categoria_id, dados)


@router.delete("/{categoria_id}", response={204: None}, auth=auth)
def deletar(request, categoria_id: int):
    CategoriaService.deletar_categoria(request.auth, categoria_id)
    return 204, None
