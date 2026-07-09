import hashlib

from django.db import models


class VisualizacaoPublicacao(models.Model):
    publicacao = models.ForeignKey(
        "publicacoes.Publicacao",
        on_delete=models.CASCADE,
        related_name="visualizacoes",
    )
    data = models.DateTimeField(auto_now_add=True)
    visitante_hash = models.CharField(max_length=64, blank=True, default="")
    referrer = models.URLField(blank=True, default="")

    class Meta:
        verbose_name = "Visualização"
        verbose_name_plural = "Visualizações"
        ordering = ["-data"]

    def __str__(self):
        return f"View {self.publicacao_id} em {self.data}"

    @staticmethod
    def gerar_hash(ip: str, user_agent: str) -> str:
        raw = f"{ip}|{user_agent}"
        return hashlib.sha256(raw.encode()).hexdigest()
