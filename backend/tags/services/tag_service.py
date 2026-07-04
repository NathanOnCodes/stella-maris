from django.utils.text import slugify

from core.exceptions import RegistroNaoEncontrado
from tags.models.tag_model import Tag


def listar_tags():
    return Tag.objects.all()


def buscar_tag_por_id(tag_id: int) -> Tag:
    try:
        return Tag.objects.get(id=tag_id)
    except Tag.DoesNotExist:
        raise RegistroNaoEncontrado("Tag não encontrada.")


def criar_tag(dados: dict) -> Tag:
    slug = dados.get("slug") or slugify(dados["nome"])
    return Tag.objects.create(nome=dados["nome"], slug=slug)


def atualizar_tag(tag_id: int, dados: dict) -> Tag:
    tag = buscar_tag_por_id(tag_id)
    if "nome" in dados and dados["nome"] is not None:
        tag.nome = dados["nome"]
    if "slug" in dados and dados["slug"] is not None:
        tag.slug = slugify(dados["slug"])
    elif "slug" in dados and dados["slug"] is None and "nome" in dados:
        tag.slug = slugify(dados["nome"])
    tag.save()
    return tag


def deletar_tag(tag_id: int) -> None:
    tag = buscar_tag_por_id(tag_id)
    tag.delete()
