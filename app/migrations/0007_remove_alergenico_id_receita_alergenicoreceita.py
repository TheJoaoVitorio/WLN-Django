# Generated by Django 5.0.6 on 2024-07-11 21:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_remove_receita_alegenicos_remove_receita_ingrediente_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='alergenico',
            name='id_receita',
        ),
        migrations.CreateModel(
            name='AlergenicoReceita',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_alergenico', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.alergenico')),
            ],
        ),
    ]
