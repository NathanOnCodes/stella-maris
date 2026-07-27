from django.contrib.auth.models import User

from autenticacao.models.perfil_model import ADMINISTRADOR, COLUNISTA, MASTER, Perfil, TIPOS_USUARIO
from core.exceptions import PermissaoNegada, RegistroNaoEncontrado


class AutenticacaoService:
    @staticmethod
    def criar_usuario_colunista(
        solicitante: User, username: str, password: str, email: str = ""
    ) -> User:
        AutenticacaoService._validar_eh_administrador(solicitante)
        return AutenticacaoService._criar_usuario(username, password, email)

    @staticmethod
    def listar_colunistas(solicitante: User) -> list[dict]:
        AutenticacaoService._validar_eh_administrador(solicitante)
        perfis = Perfil.objects.select_related("usuario").filter(tipo=COLUNISTA)
        return [AutenticacaoService._perfil_para_dict(p) for p in perfis]

    @staticmethod
    def listar_usuarios(solicitante: User) -> list[dict]:
        AutenticacaoService._validar_eh_administrador(solicitante)
        perfis = Perfil.objects.select_related("usuario").all()
        if not solicitante.perfil.eh_master:
            perfis = perfis.filter(tipo=COLUNISTA)
        return [AutenticacaoService._perfil_para_dict(p) for p in perfis]

    @staticmethod
    def obter_perfil_do_usuario(usuario: User) -> dict:
        perfil = AutenticacaoService._obter_perfil(usuario)
        return AutenticacaoService._perfil_para_dict(perfil)

    @staticmethod
    def atualizar_colunista(
        solicitante: User, colunista_id: int, dados: dict
    ) -> dict:
        AutenticacaoService._validar_eh_administrador(solicitante)
        usuario = AutenticacaoService._buscar_usuario_por_id(colunista_id)
        perfil = AutenticacaoService._obter_perfil(usuario)
        if perfil.tipo == ADMINISTRADOR:
            raise PermissaoNegada(
                "Não é permitido alterar administradores por esta rota."
            )
        return AutenticacaoService._aplicar_atualizacoes(usuario, perfil, dados)

    @staticmethod
    def deletar_colunista(solicitante: User, colunista_id: int) -> None:
        AutenticacaoService._validar_eh_administrador(solicitante)
        usuario = AutenticacaoService._buscar_usuario_por_id(colunista_id)
        perfil = AutenticacaoService._obter_perfil(usuario)
        if perfil.tipo == ADMINISTRADOR:
            raise PermissaoNegada(
                "Não é permitido excluir administradores por esta rota."
            )
        usuario.delete()

    @staticmethod
    def alterar_tipo_usuario(solicitante: User, usuario_id: int, tipo: str) -> dict:
        if not solicitante.perfil.eh_master:
            raise PermissaoNegada("Somente o master pode alterar permissões.")
        tipos_validos = {opcao for opcao, _ in TIPOS_USUARIO if opcao != MASTER}
        if tipo not in tipos_validos:
            raise PermissaoNegada("Tipo de usuário inválido.")
        usuario = AutenticacaoService._buscar_usuario_por_id(usuario_id)
        perfil = AutenticacaoService._obter_perfil(usuario)
        if perfil.eh_master:
            raise PermissaoNegada("O usuário master não pode ser rebaixado.")
        perfil.tipo = tipo
        perfil.save(update_fields=["tipo"])
        return AutenticacaoService._perfil_para_dict(perfil)

    @staticmethod
    def alterar_senha(
        usuario_autenticado: User, senha_atual: str, senha_nova: str
    ) -> None:
        if not usuario_autenticado.check_password(senha_atual):
            raise PermissaoNegada("Senha atual incorreta.")
        usuario_autenticado.set_password(senha_nova)
        usuario_autenticado.save()

    @staticmethod
    def criar_admin(username: str, password: str, email: str = "") -> User:
        usuario = AutenticacaoService._criar_usuario(username, password, email)
        usuario.perfil.tipo = MASTER
        usuario.perfil.save()
        return usuario

    @staticmethod
    def _criar_usuario(username: str, password: str, email: str) -> User:
        return User.objects.create_user(
            username=username, password=password, email=email
        )

    @staticmethod
    def _perfil_para_dict(perfil: Perfil) -> dict:
        return {
            "id": perfil.usuario_id,
            "username": perfil.usuario.username,
            "email": perfil.usuario.email,
            "tipo": perfil.tipo,
            "eh_administrador": perfil.eh_administrador,
            "eh_master": perfil.eh_master,
        }

    @staticmethod
    def _aplicar_atualizacoes(
        usuario: User, perfil: Perfil, dados: dict
    ) -> dict:
        if "username" in dados and dados["username"] is not None:
            usuario.username = dados["username"]
        if "email" in dados and dados["email"] is not None:
            usuario.email = dados["email"]
        if "password" in dados and dados["password"] is not None:
            usuario.set_password(dados["password"])
        usuario.save()
        perfil.save()
        return AutenticacaoService._perfil_para_dict(perfil)

    @staticmethod
    def _buscar_usuario_por_id(usuario_id: int) -> User:
        try:
            return User.objects.get(id=usuario_id)
        except User.DoesNotExist:
            raise RegistroNaoEncontrado("Usuário não encontrado.")

    @staticmethod
    def _obter_perfil(usuario: User) -> Perfil:
        try:
            return usuario.perfil
        except Perfil.DoesNotExist:
            raise RegistroNaoEncontrado(
                "Perfil não encontrado para este usuário."
            )

    @staticmethod
    def _validar_eh_administrador(usuario: User) -> None:
        perfil = AutenticacaoService._obter_perfil(usuario)
        if not perfil.eh_administrador:
            raise PermissaoNegada("Ação restrita a administradores.")
