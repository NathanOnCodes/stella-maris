import uuid
import time
from django.db import models
from django.utils.text import slugify
from django.conf import settings



def caminho_imagem_capa(instance, filename):
    autor = instance.autor
    post_id = instance.id

    return f"capas/{autor}/{post_id}/{filename}"


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    titulo = models.CharField(max_length=125)
    conteudo = models.TextField()
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    imagem = models.ImageField(upload_to=caminho_imagem_capa, blank=True, null=True)
    publicado = models.BooleanField(default=False)

    class Meta:
        db_table = "post"
        verbose_name = "Postagem"
        verbose_name_plural = "Postagens"
        ordering = ["-criado_em"]

    def __str__(self):
        return self.titulo

    def save(self, *args, **kwargs):
        # Gerar slug se não existir
        if not self.slug or self.slug.strip() == "":
            base_slug = slugify(self.titulo)

            # Se slug for vazio após slugify, usar timestamp
            if not base_slug:
                base_slug = f"post-{int(time.time()) % 10000}"

            slug = base_slug
            counter = 1

            # Verificar se slug já existe
            # Usar self.__class__ para evitar import circular
            while self.__class__.objects.filter(slug=slug).exists():
                # Se estamos atualizando um objeto existente, verificar se é o mesmo objeto
                if self.pk:
                    # Se existe um objeto com o mesmo slug mas ID diferente, é duplicado
                    if (
                        self.__class__.objects.filter(slug=slug)
                        .exclude(pk=self.pk)
                        .exists()
                    ):
                        slug = f"{base_slug}-{counter}"

                        counter += 1
                    else:
                        # É o mesmo objeto, slug está ok
                        break
                else:
                    # Criando novo objeto, slug duplicado precisa mudar
                    slug = f"{base_slug}-{counter}"
                    counter += 1

            self.slug = slug

        # Chamar save do pai
        super().save(*args, **kwargs)
