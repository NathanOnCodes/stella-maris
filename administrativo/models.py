from django.contrib.auth.models import AbstractUser
from django.db import models

import uuid


def caminho_imagem_capa(instance, filename):
    return f'capas/{instance.id}/{filename}'

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    avatar = models.ImageField(upload_to=caminho_imagem_capa, blank=True, null=True)

    @property
    def nome_completo(self):
        return f'{self.first_name} {self.last_name}'
    
    @property
    def path_avatar(self):
        return self.avatar.url if self.avatar else None
    