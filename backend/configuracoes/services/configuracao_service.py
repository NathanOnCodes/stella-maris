from django.contrib.auth.models import User

from configuracoes.models.configuracao_model import ConfiguracaoSite
from core.decorators import requer_admin


class ConfiguracaoSiteService:
    ID_UNICO = 1

    @staticmethod
    def obter_configuracao() -> ConfiguracaoSite:
        config, _ = ConfiguracaoSite.objects.get_or_create(
            pk=ConfiguracaoSiteService.ID_UNICO
        )
        return config

    @staticmethod
    @requer_admin
    def atualizar_configuracao(
        solicitante: User, dados: dict
    ) -> ConfiguracaoSite:
        config = ConfiguracaoSiteService.obter_configuracao()
        for campo in ("nome_site", "descricao", "email_contato",
                      "instagram", "youtube", "facebook", "twitter_x"):
            if campo in dados and dados[campo] is not None:
                setattr(config, campo, dados[campo])
        config.save()
        return config
