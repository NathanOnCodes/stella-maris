import uuid
from django.db import models
from django.utils.text import slugify



def caminho_imagem_capa(instance, filename):
    autor = instance.autor
    post_id = instance.id

    return f"capas/{autor}/{post_id}/{filename}"

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    autor = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    titulo = models.CharField(max_length=125)
    conteudo = models.TextField()
    slug = models.SlugField(unique=True, blank=True, max_length=255)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    imagem = models.ImageField(upload_to=caminho_imagem_capa)
    publicado = models.BooleanField(default=False) 

    
    class Meta:
        db_table = 'postagens'
        verbose_name = 'Postagem'
        verbose_name_plural = 'Postagens'
        ordering = ['-criado_em']

    def save(self, *args, **kwargs):
        self.slug = slugify(self.titulo)
        super().save(*args, **kwargs)

    