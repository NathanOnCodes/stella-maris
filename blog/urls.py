from django.urls import path
from blog.views.posts_views import (
    listar_postagens,
    postagem_detalhe,
    criar_postagem,
    processar_postagem,
)

app_name = "blog"

urlpatterns = [
    path("", listar_postagens, name="postagem-lista"),
    path("post/<slug:slug>/", postagem_detalhe, name="postagem-detalhe"),
    path("nova/", criar_postagem, name="postagem-nova"),
    path("criar/", processar_postagem, name="postagem-criar"),
]
