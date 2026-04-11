from django import forms


class LoginForm(forms.Form):
    """Formulário de autenticação para login de usuários"""

    usuario = forms.CharField(
        label="Usuário",
        max_length=150,
        widget=forms.TextInput(
            attrs={"class": "form-control", "placeholder": "Digite seu nome de usuário"}
        ),
    )

    senha = forms.CharField(
        label="Senha",
        widget=forms.PasswordInput(
            attrs={"class": "form-control", "placeholder": "Digite sua senha"}
        ),
    )
