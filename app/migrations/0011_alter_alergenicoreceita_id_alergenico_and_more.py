# Generated by Django 5.0.7 on 2024-08-09 16:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_alergenicoreceita_id_receita'),
    ]

    operations = [
        migrations.AlterField(
            model_name='alergenicoreceita',
            name='id_alergenico',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.alergenico'),
        ),
        migrations.AlterField(
            model_name='alergenicoreceita',
            name='id_receita',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='app.receita'),
        ),
    ]
