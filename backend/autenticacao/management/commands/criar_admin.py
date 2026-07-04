from django.core.management.base import BaseCommand

from autenticacao.services.perfil_service import criar_admin


class Command(BaseCommand):
    help = "Cria o primeiro usuário administrador do sistema."

    def handle(self, *args, **opcoes):
        self.stdout.write("=== Criação do Administrador Vox Regina Caeli ===")
        username = input("Nome de usuário: ").strip()
        if not username:
            self.stderr.write("Nome de usuário é obrigatório.")
            return
        email = input("E-mail: ").strip()
        password = input("Senha: ").strip()
        if not password:
            self.stderr.write("Senha é obrigatória.")
            return
        try:
            usuario = criar_admin(username=username, password=password, email=email)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Administrador '{usuario.username}' criado com sucesso."
                )
            )
        except Exception as exc:
            self.stderr.write(f"Erro ao criar administrador: {exc}")
