from http import HTTPStatus


class ErroBaseVoxRC(Exception):
    codigo_http: int = HTTPStatus.INTERNAL_SERVER_ERROR
    detalhe: str = "Erro interno do servidor."

    def __init__(self, detalhe: str | None = None):
        self.detalhe = detalhe or self.detalhe
        super().__init__(self.detalhe)


class RegistroNaoEncontrado(ErroBaseVoxRC):
    codigo_http: int = HTTPStatus.NOT_FOUND
    detalhe: str = "Registro não encontrado."


class PermissaoNegada(ErroBaseVoxRC):
    codigo_http: int = HTTPStatus.FORBIDDEN
    detalhe: str = "Permissão negada."