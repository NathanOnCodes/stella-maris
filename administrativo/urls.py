from django.urls import path
from administrativo.views.autenticacao_views import (
    login,
    processar_login,
    logout_usuario,
)

app_name = "administrativo"

urlpatterns = [
    path("login/", login, name="login"),
    path("login/processar/", processar_login, name="processar_login"),
    path("logout/", logout_usuario, name="logout"),
]
