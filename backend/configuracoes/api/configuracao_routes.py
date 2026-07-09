from ninja import Router
from ninja_jwt.authentication import JWTAuth

from configuracoes.api.configuracao_schemas import (
    ConfiguracaoOut,
    ConfiguracaoUpdate,
)
from configuracoes.services.configuracao_service import ConfiguracaoSiteService

router = Router(tags=["Configurações"])
auth = JWTAuth()


@router.get("/", response=ConfiguracaoOut)
def obter(request):
    config = ConfiguracaoSiteService.obter_configuracao()
    return _config_para_dict(config)


@router.put("/", response=ConfiguracaoOut, auth=auth)
def atualizar(request, payload: ConfiguracaoUpdate):
    dados = {k: v for k, v in payload.model_dump().items() if v is not None}
    config = ConfiguracaoSiteService.atualizar_configuracao(
        request.auth, dados
    )
    return _config_para_dict(config)


def _config_para_dict(config) -> dict:
    return {
        "nome_site": config.nome_site,
        "descricao": config.descricao,
        "logo": config.logo.url if config.logo else None,
        "email_contato": config.email_contato,
        "instagram": config.instagram,
        "youtube": config.youtube,
        "facebook": config.facebook,
        "twitter_x": config.twitter_x,
    }
