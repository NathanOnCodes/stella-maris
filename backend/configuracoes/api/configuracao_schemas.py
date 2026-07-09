from ninja import Schema


class ConfiguracaoOut(Schema):
    nome_site: str
    descricao: str
    logo: str | None = None
    email_contato: str
    instagram: str
    youtube: str
    facebook: str
    twitter_x: str


class ConfiguracaoUpdate(Schema):
    nome_site: str | None = None
    descricao: str | None = None
    email_contato: str | None = None
    instagram: str | None = None
    youtube: str | None = None
    facebook: str | None = None
    twitter_x: str | None = None
