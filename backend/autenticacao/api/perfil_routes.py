from ninja import Router
from ninja_jwt.authentication import JWTAuth

from autenticacao.api.perfil_schemas import (
    AlteraSenhaIn,
    ColunistaIn,
    ColunistaUpdate,
    PerfilOut,
)
from autenticacao.services.perfil_service import AutenticacaoService

router = Router(tags=["Autenticação"])
auth = JWTAuth()


@router.get("/me", response=PerfilOut, auth=auth)
def me(request):
    return AutenticacaoService.obter_perfil_do_usuario(request.auth)


@router.put("/me/alterar-senha", response={200: dict}, auth=auth)
def alterar_senha_endpoint(request, payload: AlteraSenhaIn):
    AutenticacaoService.alterar_senha(
        request.auth, payload.senha_atual, payload.senha_nova
    )
    return 200, {"detail": "Senha alterada com sucesso."}


@router.get("/colunistas", response=list[PerfilOut], auth=auth)
def listar(request):
    return AutenticacaoService.listar_colunistas(request.auth)


@router.post("/colunistas", response=PerfilOut, auth=auth)
def criar(request, payload: ColunistaIn):
    usuario = AutenticacaoService.criar_usuario_colunista(
        request.auth, payload.username, payload.password, payload.email
    )
    return AutenticacaoService.obter_perfil_do_usuario(usuario)


@router.put("/colunistas/{colunista_id}", response=PerfilOut, auth=auth)
def atualizar(request, colunista_id: int, payload: ColunistaUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    return AutenticacaoService.atualizar_colunista(
        request.auth, colunista_id, dados
    )


@router.delete("/colunistas/{colunista_id}", response={204: None}, auth=auth)
def deletar(request, colunista_id: int):
    AutenticacaoService.deletar_colunista(request.auth, colunista_id)
    return 204, None
