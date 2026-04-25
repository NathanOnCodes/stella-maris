from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from administrativo.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'nome_completo', 'avatar_preview', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Avatar', {
            'fields': ('avatar',),
        }),
    )
    
    def nome_completo(self, obj):
        return obj.nome_completo or obj.username
    nome_completo.short_description = 'Nome'
    
    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="32" height="32" style="border-radius: 50%;" />', obj.avatar.url)
        return "📷"
    avatar_preview.short_description = 'Avatar'
    