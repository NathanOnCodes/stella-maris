from django.contrib.auth.models import User
from django.db import models

from categorias.models.categoria_model import Categoria
from tags.models.tag_model import Tag

RASCUNHO = "rascunho"
PUBLICADO = "publicado"
ARQUIVADO = "arquivado"
ARTIGO = "artigo"
ENTREVISTA = "entrevista"
COLUNA = "coluna"
STATUS_PUBLICACAO = [
    (RASCUNHO, "Rascunho"),
    (PUBLICADO, "Publicado"),
    (ARQUIVADO, "Arquivado"),
]
TIPOS_EDITORIAIS = [
    (ARTIGO, "Artigo"),
    (ENTREVISTA, "Entrevista"),
    (COLUNA, "Coluna"),
]


class Publicacao(models.Model):
    titulo = models.CharField(max_length=200)
    subtitulo = models.CharField(max_length=300, blank=True, default="")
    slug = models.SlugField(unique=True, max_length=250)
    conteudo = models.TextField(blank=True, default="")
    imagem_capa = models.ImageField(upload_to="capas/", blank=True, null=True)
    status = models.CharField(
        max_length=20, choices=STATUS_PUBLICACAO, default=RASCUNHO
    )
    tipo_editorial = models.CharField(
        max_length=20, choices=TIPOS_EDITORIAIS, default=ARTIGO
    )
    data_publicacao = models.DateTimeField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    autor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="publicacoes"
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publicacoes",
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name="publicacoes")

    class Meta:
        verbose_name = "Publicação"
        verbose_name_plural = "Publicações"
        ordering = ["-data_publicacao", "-criado_em"]

    def __str__(self):
        return self.titulo

    @property
    def esta_publicada(self) -> bool:
        from django.utils.timezone import now

        return self.status == PUBLICADO and (
            self.data_publicacao is None or self.data_publicacao <= now()
        )
