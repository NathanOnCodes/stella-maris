from django.contrib.auth.models import User
from django.utils.text import slugify

from categorias.models.categoria_model import Categoria
from core.decorators import requer_admin
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
    @requer_admin
    def criar_categoria(solicitante: User, dados: dict) -> Categoria:
        slug = dados.get("slug") or slugify(dados["nome"])
        return Categoria.objects.create(
            nome=dados["nome"],
            slug=slug,
            descricao=dados.get("descricao", ""),
        )

    @staticmethod
    @requer_admin
    def atualizar_categoria(solicitante: User, categoria_id: int, dados: dict) -> Categoria:
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
    @requer_admin
    def deletar_categoria(solicitante: User, categoria_id: int) -> None:
        categoria = CategoriaService.buscar_categoria_por_id(categoria_id)
        categoria.delete()
