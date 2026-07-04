from ninja import Router
from ninja_jwt.authentication import JWTAuth

from autenticacao.api.perfil_schemas import (
    AlteraSenhaIn,
    ColunistaIn,
    ColunistaUpdate,
    PerfilOut,
)
from autenticacao.services.perfil_service import (
    alterar_senha,
    atualizar_colunista,
    criar_usuario_colunista,
    deletar_colunista,
    listar_colunistas,
    obter_perfil_do_usuario,
)

router = Router(tags=["Autenticação"])
auth = JWTAuth()


@router.get("/me", response=PerfilOut, auth=auth)
def me(request):
    return obter_perfil_do_usuario(request.auth)


@router.put("/me/alterar-senha", response={200: dict}, auth=auth)
def alterar_senha_endpoint(request, payload: AlteraSenhaIn):
    alterar_senha(request.auth, payload.senha_atual, payload.senha_nova)
    return 200, {"detail": "Senha alterada com sucesso."}


@router.get("/colunistas", response=list[PerfilOut], auth=auth)
def listar(request):
    return listar_colunistas(request.auth)


@router.post("/colunistas", response=PerfilOut, auth=auth)
def criar(request, payload: ColunistaIn):
    usuario = criar_usuario_colunista(
        request.auth, payload.username, payload.password, payload.email
    )
    return obter_perfil_do_usuario(usuario)


@router.put("/colunistas/{colunista_id}", response=PerfilOut, auth=auth)
def atualizar(request, colunista_id: int, payload: ColunistaUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    return atualizar_colunista(request.auth, colunista_id, dados)


@router.delete("/colunistas/{colunista_id}", response={204: None}, auth=auth)
def deletar(request, colunista_id: int):
    deletar_colunista(request.auth, colunista_id)
    return 204, None
