from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("metricas", "0001_initial")]

    operations = [
        migrations.AddIndex(
            model_name="visualizacaopublicacao",
            index=models.Index(
                fields=["publicacao", "visitante_hash", "data"],
                name="metricas_view_pub_visit_idx",
            ),
        ),
    ]
