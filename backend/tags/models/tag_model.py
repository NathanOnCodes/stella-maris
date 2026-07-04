from django.db import models


class Tag(models.Model):
    nome = models.CharField(max_length=80)
    slug = models.SlugField(unique=True, max_length=100)

    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ["nome"]

    def __str__(self):
        return self.nome
