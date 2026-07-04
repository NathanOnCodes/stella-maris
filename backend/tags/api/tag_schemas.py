from ninja import Schema


class TagIn(Schema):
    nome: str
    slug: str | None = None


class TagUpdate(Schema):
    nome: str | None = None
    slug: str | None = None


class TagOut(Schema):
    id: int
    nome: str
    slug: str
