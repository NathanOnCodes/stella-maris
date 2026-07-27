from ninja import Schema


class ColunistaIn(Schema):
    username: str
    password: str
    email: str = ""


class ColunistaUpdate(Schema):
    username: str | None = None
    email: str | None = None
    password: str | None = None


class TipoUsuarioIn(Schema):
    tipo: str


class PerfilOut(Schema):
    id: int
    username: str
    email: str
    tipo: str
    eh_administrador: bool
    eh_master: bool


class AlteraSenhaIn(Schema):
    senha_atual: str
    senha_nova: str
