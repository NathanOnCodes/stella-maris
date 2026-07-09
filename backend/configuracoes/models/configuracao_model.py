from django.db import models


class ConfiguracaoSite(models.Model):
    nome_site = models.CharField(max_length=200, default="Vox Regina Caeli")
    descricao = models.TextField(
        blank=True, default="Revista digital católica independente"
    )
    logo = models.ImageField(upload_to="logo/", blank=True, null=True)
    email_contato = models.EmailField(blank=True, default="")
    instagram = models.URLField(blank=True, default="")
    youtube = models.URLField(blank=True, default="")
    facebook = models.URLField(blank=True, default="")
    twitter_x = models.URLField(blank=True, default="")

    class Meta:
        verbose_name = "Configuração do Site"
        verbose_name_plural = "Configurações do Site"

    def __str__(self):
        return self.nome_site
