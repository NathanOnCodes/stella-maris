from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from administrativo.forms.autenticacao_forms import LoginForm


def login_view(requisicao):
    """
    View unificada para exibição e processamento do formulário de login.

    Se o usuário já estiver autenticado, redireciona para a home do blog.
    Se for requisição POST, processa o login.
    Caso contrário, exibe formulário vazio.
    """
    if requisicao.user.is_authenticated:
        return redirect("blog:postagem-lista")

    if requisicao.method == "POST":
        form = LoginForm(requisicao.POST)
        if form.is_valid():
            usuario = form.cleaned_data["usuario"]
            senha = form.cleaned_data["senha"]

            usuario_autenticado = authenticate(
                requisicao, username=usuario, password=senha
            )

            if usuario_autenticado is not None:
                auth_login(requisicao, usuario_autenticado)
                messages.success(requisicao, "Login realizado com sucesso!")
                return redirect("blog:postagem-lista")

            messages.error(requisicao, "Usuário ou senha incorretos. Tente novamente.")
    else:
        form = LoginForm()

    return render(requisicao, "administrativo/login.html", {"form": form})


def logout_usuario(requisicao):
    """
    Realiza logout do usuário e redireciona para a listagem de posts.
    """
    auth_logout(requisicao)
    return redirect("blog:postagem-lista")
