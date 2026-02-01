from django.contrib import admin
from django.utils.html import format_html
from blog.models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # Campos exibidos na lista
    list_display = (
        'titulo',
        'autor_nome',
        'slug',
        'publicado',
        'criado_em',
        'imagem_preview',
    )

    # Links para editar ao clicar no título
    list_display_links = ('titulo',)

    # Filtros laterais
    list_filter = (
        'publicado',
        'criado_em',
    )

    # Campo de busca
    search_fields = (
        'titulo',
        'conteudo',
        'autor__username', 
        'autor__first_name',
        'autor__last_name',
    )

    list_per_page = 20

    # Campos somente leitura
    readonly_fields = ('id', 'slug', 'criado_em', 'atualizado_em')

    # Layout no formulário
    fieldsets = (
        (None, {
            'fields': ('titulo', 'conteudo', 'publicado')
        }),
        ('Informações do Autor', {
            'fields': ('autor',)
        }),
        ('Imagem', {
            'fields': ('imagem',)
        }),
        ('Detalhes', {
            'classes': ('collapse',),
            'fields': ('id', 'slug', 'criado_em', 'atualizado_em'),
        }),
    )

    # Exibe miniatura da imagem no admin
    def imagem_preview(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" style="width: 100px; height: auto;" />', obj.imagem.url)
        return "Sem imagem"

    imagem_preview.short_description = 'Prévia da Imagem'

    # Exibe o nome completo ou username do autor na lista
    def autor_nome(self, obj):
        if obj.autor:
            full_name = obj.autor.get_full_name()
            return full_name if full_name else obj.autor.username
        return "Anônimo"

    autor_nome.short_description = 'Autor'