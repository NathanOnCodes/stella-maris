from django.contrib.auth.models import User
from django.db.models import Q
from django.utils.text import slugify
from django.utils.timezone import now

from categorias.services.categoria_service import CategoriaService
from core.exceptions import PermissaoNegada, RegistroNaoEncontrado
from publicacoes.models.publicacao_model import (
    ARQUIVADO,
    PUBLICADO,
    RASCUNHO,
    Publicacao,
)
from tags.services.tag_service import TagService


def listar_publicacoes_publicas():
    return (
        Publicacao.objects.select_related("autor", "categoria")
        .prefetch_related("tags")
        .filter(
            status=PUBLICADO,
        )
        .filter(Q(data_publicacao__lte=now()) | Q(data_publicacao__isnull=True))
        .order_by("-data_publicacao")
    )


def buscar_publicacao_por_slug(slug: str) -> Publicacao:
    publicacao = (
        Publicacao.objects.select_related("autor", "categoria")
        .prefetch_related("tags")
        .filter(
            slug=slug,
            status=PUBLICADO,
        )
        .filter(Q(data_publicacao__lte=now()) | Q(data_publicacao__isnull=True))
        .first()
    )
    if publicacao is None:
        raise RegistroNaoEncontrado("Publicação não encontrada.")
    return publicacao


def listar_publicacoes_admin(solicitante: User):
    queryset = Publicacao.objects.select_related("autor", "categoria").prefetch_related(
        "tags"
    )
    if not solicitante.perfil.eh_administrador:
        queryset = queryset.filter(autor=solicitante)
    return queryset.order_by("-criado_em")


def buscar_publicacao_por_id(publicacao_id: int) -> Publicacao:
    try:
        return (
            Publicacao.objects.select_related("autor", "categoria")
            .prefetch_related("tags")
            .get(id=publicacao_id)
        )
    except Publicacao.DoesNotExist:
        raise RegistroNaoEncontrado("Publicação não encontrada.")


def criar_publicacao(autor: User, dados: dict) -> Publicacao:
    slug = dados.get("slug") or slugify(dados["titulo"])
    categoria = None
    if dados.get("categoria_id"):
        categoria = CategoriaService.buscar_categoria_por_id(dados["categoria_id"])
    tag_ids = dados.get("tag_ids", [])
    publicacao = Publicacao.objects.create(
        titulo=dados["titulo"],
        subtitulo=dados.get("subtitulo", ""),
        slug=slug,
        conteudo=dados.get("conteudo", ""),
        status=dados.get("status", RASCUNHO),
        data_publicacao=dados.get("data_publicacao"),
        autor=autor,
        categoria=categoria,
    )
    for tag_id in tag_ids:
        tag = TagService.buscar_tag_por_id(tag_id)
        publicacao.tags.add(tag)
    return publicacao


def atualizar_publicacao(
    solicitante: User, publicacao_id: int, dados: dict
) -> Publicacao:
    publicacao = buscar_publicacao_por_id(publicacao_id)
    _validar_propriedade(solicitante, publicacao)
    if "titulo" in dados and dados["titulo"] is not None:
        publicacao.titulo = dados["titulo"]
    if "subtitulo" in dados and dados["subtitulo"] is not None:
        publicacao.subtitulo = dados["subtitulo"]
    if "slug" in dados and dados["slug"] is not None:
        publicacao.slug = slugify(dados["slug"])
    elif "slug" in dados and dados["slug"] is None and "titulo" in dados:
        publicacao.slug = slugify(dados["titulo"])
    if "conteudo" in dados and dados["conteudo"] is not None:
        publicacao.conteudo = dados["conteudo"]
    if "status" in dados and dados["status"] is not None:
        publicacao.status = dados["status"]
    if "data_publicacao" in dados:
        publicacao.data_publicacao = dados.get("data_publicacao")
    if "categoria_id" in dados and dados["categoria_id"] is not None:
        publicacao.categoria = CategoriaService.buscar_categoria_por_id(dados["categoria_id"])
    if "tag_ids" in dados and dados["tag_ids"] is not None:
        publicacao.tags.clear()
        for tag_id in dados["tag_ids"]:
            tag = TagService.buscar_tag_por_id(tag_id)
            publicacao.tags.add(tag)
    publicacao.save()
    return publicacao


def deletar_publicacao(solicitante: User, publicacao_id: int) -> None:
    publicacao = buscar_publicacao_por_id(publicacao_id)
    _validar_propriedade(solicitante, publicacao)
    publicacao.delete()


def _validar_propriedade(solicitante: User, publicacao: Publicacao) -> None:
    if solicitante.perfil.eh_administrador:
        return
    if publicacao.autor_id != solicitante.id:
        raise PermissaoNegada(
            "Você não tem permissão para alterar publicações de outros autores."
        )


def _publicacao_para_dict(publicacao: Publicacao) -> dict:
    return {
        "id": publicacao.id,
        "titulo": publicacao.titulo,
        "subtitulo": publicacao.subtitulo,
        "slug": publicacao.slug,
        "conteudo": publicacao.conteudo,
        "imagem_capa": (publicacao.imagem_capa.url if publicacao.imagem_capa else None),
        "status": publicacao.status,
        "data_publicacao": publicacao.data_publicacao,
        "criado_em": publicacao.criado_em,
        "atualizado_em": publicacao.atualizado_em,
        "autor_id": publicacao.autor_id,
        "autor_nome": publicacao.autor.username,
        "categoria_id": publicacao.categoria_id,
        "categoria_nome": (publicacao.categoria.nome if publicacao.categoria else None),
        "tags": [
            {"id": t.id, "nome": t.nome, "slug": t.slug} for t in publicacao.tags.all()
        ],
    }


def _publicacao_resumo_para_dict(publicacao: Publicacao) -> dict:
    dados = _publicacao_para_dict(publicacao)
    dados.pop("conteudo")
    return dados
