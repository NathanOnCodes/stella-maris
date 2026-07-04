from datetime import datetime

from ninja import Schema

from tags.api.tag_schemas import TagOut


class PublicacaoIn(Schema):
    titulo: str
    subtitulo: str = ""
    slug: str | None = None
    conteudo: str = ""
    status: str = "rascunho"
    data_publicacao: datetime | None = None
    categoria_id: int | None = None
    tag_ids: list[int] = []


class PublicacaoUpdate(Schema):
    titulo: str | None = None
    subtitulo: str | None = None
    slug: str | None = None
    conteudo: str | None = None
    status: str | None = None
    data_publicacao: datetime | None = None
    categoria_id: int | None = None
    tag_ids: list[int] | None = None


class PublicacaoOut(Schema):
    id: int
    titulo: str
    subtitulo: str
    slug: str
    conteudo: str
    imagem_capa: str | None = None
    status: str
    data_publicacao: datetime | None = None
    criado_em: datetime
    atualizado_em: datetime
    autor_id: int
    autor_nome: str
    categoria_id: int | None = None
    categoria_nome: str | None = None
    tags: list[TagOut] = []


class PublicacaoResumoOut(Schema):
    id: int
    titulo: str
    subtitulo: str
    slug: str
    imagem_capa: str | None = None
    status: str
    data_publicacao: datetime | None = None
    autor_nome: str
    categoria_nome: str | None = None
    tags: list[TagOut] = []
