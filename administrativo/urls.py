from django.urls import path
from administrativo.views.autenticacao_views import (
    login_view,
    logout_usuario,
)

app_name = "administrativo"

urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", logout_usuario, name="logout"),
]
