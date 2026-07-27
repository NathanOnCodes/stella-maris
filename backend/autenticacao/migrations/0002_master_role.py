from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("autenticacao", "0001_initial")]

    operations = [
        migrations.AlterField(
            model_name="perfil",
            name="tipo",
            field=models.CharField(
                choices=[
                    ("master", "Master"),
                    ("admin", "Administrador"),
                    ("colunista", "Colunista"),
                ],
                default="colunista",
                max_length=20,
            ),
        ),
    ]
