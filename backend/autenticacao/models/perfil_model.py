from django.contrib.auth.models import User
from django.db import models

ADMINISTRADOR = "admin"
COLUNISTA = "colunista"
TIPOS_USUARIO = [(ADMINISTRADOR, "Administrador"), (COLUNISTA, "Colunista")]


class Perfil(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="perfil"
    )
    tipo = models.CharField(max_length=20, choices=TIPOS_USUARIO, default=COLUNISTA)

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"

    def __str__(self):
        return f"{self.usuario.username} ({self.get_tipo_display()})"

    @property
    def eh_administrador(self) -> bool:
        return self.tipo == ADMINISTRADOR

    @property
    def eh_colunista(self) -> bool:
        return self.tipo == COLUNISTA
