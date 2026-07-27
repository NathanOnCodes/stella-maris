from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("publicacoes", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="publicacao",
            name="tipo_editorial",
            field=models.CharField(
                choices=[
                    ("artigo", "Artigo"),
                    ("entrevista", "Entrevista"),
                    ("coluna", "Coluna"),
                ],
                default="artigo",
                max_length=20,
            ),
        ),
    ]
