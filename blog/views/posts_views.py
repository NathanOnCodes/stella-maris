from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from blog.models import Post
from blog.forms import PostagemForm


def listar_postagens(request):
    """Lista postagens publicadas, ordenadas pela mais recente"""
    posts = Post.objects.filter(publicado=True).order_by("-criado_em")
    context = {"posts": posts}
    return render(request, "blog/post_list.html", context)


def postagem_detalhe(request, slug):
    """Detalhes de postagem específica pelo slug"""
    post = get_object_or_404(Post, slug=slug, publicado=True)
    context = {"post": post}
    return render(request, "blog/post_detail.html", context)


@login_required
@permission_required("blog.add_post", raise_exception=True)
def criar_postagem(request):
    """Exibe formulário vazio para nova postagem"""
    form = PostagemForm()
    context = {"form": form, "titulo_pagina": "Nova Postagem"}
    return render(request, "blog/post_form.html", context)


@login_required
@permission_required("blog.add_post", raise_exception=True)
def processar_postagem(request):
    """Processa envio do formulário"""
    if request.method == "POST":
        form = PostagemForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.autor = request.user
            post.save()
            messages.success(request, "Postagem criada com sucesso!")
            return redirect("blog:postagem-detalhe", slug=post.slug)
        else:
            messages.error(request, "Corrija os erros no formulário.")
    else:
        form = PostagemForm()

    context = {"form": form, "titulo_pagina": "Nova Postagem"}
    return render(request, "blog/post_form.html", context)
