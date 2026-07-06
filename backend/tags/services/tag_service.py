from django.utils.text import slugify

from core.exceptions import RegistroNaoEncontrado
from tags.models.tag_model import Tag


class TagService:
    @staticmethod
    def listar_tags():
        return Tag.objects.all()

    @staticmethod
    def buscar_tag_por_id(tag_id: int) -> Tag:
        try:
            return Tag.objects.get(id=tag_id)
        except Tag.DoesNotExist:
            raise RegistroNaoEncontrado("Tag não encontrada.")

    @staticmethod
    def criar_tag(dados: dict) -> Tag:
        slug = dados.get("slug") or slugify(dados["nome"])
        return Tag.objects.create(nome=dados["nome"], slug=slug)

    @staticmethod
    def atualizar_tag(tag_id: int, dados: dict) -> Tag:
        tag = TagService.buscar_tag_por_id(tag_id)
        if "nome" in dados and dados["nome"] is not None:
            tag.nome = dados["nome"]
        if "slug" in dados and dados["slug"] is not None:
            tag.slug = slugify(dados["slug"])
        elif "slug" in dados and dados["slug"] is None and "nome" in dados:
            tag.slug = slugify(dados["nome"])
        tag.save()
        return tag

    @staticmethod
    def deletar_tag(tag_id: int) -> None:
        tag = TagService.buscar_tag_por_id(tag_id)
        tag.delete()
