from django.utils.text import slugify

from categorias.models.categoria_model import Categoria
from core.exceptions import RegistroNaoEncontrado


class CategoriaService:
    @staticmethod
    def listar_categorias():
        return Categoria.objects.all()

    @staticmethod
    def buscar_categoria_por_id(categoria_id: int) -> Categoria:
        try:
            return Categoria.objects.get(id=categoria_id)
        except Categoria.DoesNotExist:
            raise RegistroNaoEncontrado("Categoria não encontrada.")

    @staticmethod
    def criar_categoria(dados: dict) -> Categoria:
        slug = dados.get("slug") or slugify(dados["nome"])
        return Categoria.objects.create(
            nome=dados["nome"],
            slug=slug,
            descricao=dados.get("descricao", ""),
        )

    @staticmethod
    def atualizar_categoria(categoria_id: int, dados: dict) -> Categoria:
        categoria = CategoriaService.buscar_categoria_por_id(categoria_id)
        if "nome" in dados and dados["nome"] is not None:
            categoria.nome = dados["nome"]
        if "slug" in dados and dados["slug"] is not None:
            categoria.slug = slugify(dados["slug"])
        elif "slug" in dados and dados["slug"] is None and "nome" in dados:
            categoria.slug = slugify(dados["nome"])
        if "descricao" in dados and dados["descricao"] is not None:
            categoria.descricao = dados.get("descricao", "")
        categoria.save()
        return categoria

    @staticmethod
    def deletar_categoria(categoria_id: int) -> None:
        categoria = CategoriaService.buscar_categoria_por_id(categoria_id)
        categoria.delete()
