from django import forms
from blog.models import Post


class PostagemForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["titulo", "conteudo", "imagem", "publicado"]

        widgets = {
            "titulo": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Digite o título da postagem",
                }
            ),
            "conteudo": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "placeholder": "Digite o conteúdo da postagem",
                    "rows": 10,
                }
            ),
            "imagem": forms.FileInput(attrs={"class": "form-control"}),
            "publicado": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }

        labels = {
            "titulo": "Título",
            "conteudo": "Conteúdo",
            "imagem": "Imagem de capa",
            "publicado": "Publicar imediatamente",
        }

        help_texts = {
            "titulo": "Título da postagem (máximo 125 caracteres)",
            "conteudo": "Conteúdo principal da postagem",
            "imagem": "Imagem que aparecerá como capa da postagem",
            "publicado": "Marque para publicar a postagem imediatamente",
        }

    def clean_titulo(self):
        titulo = self.cleaned_data.get("titulo")
        if len(titulo) < 5:
            raise forms.ValidationError("O título deve ter pelo menos 5 caracteres")
        return titulo

    def clean_conteudo(self):
        conteudo = self.cleaned_data.get("conteudo")
        if len(conteudo) < 50:
            raise forms.ValidationError("O conteúdo deve ter pelo menos 50 caracteres")
        return conteudo
