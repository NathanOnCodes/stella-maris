from ninja import Schema


class CategoriaIn(Schema):
    nome: str
    slug: str | None = None
    descricao: str = ""


class CategoriaUpdate(Schema):
    nome: str | None = None
    slug: str | None = None
    descricao: str | None = None


class CategoriaOut(Schema):
    id: int
    nome: str
    slug: str
    descricao: str
