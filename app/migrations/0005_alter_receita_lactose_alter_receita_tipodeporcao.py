# Generated by Django 5.0.6 on 2024-05-27 01:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_alergenico_receita_ingrediente_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='receita',
            name='lactose',
            field=models.CharField(choices=[('zerolactose', 'Zero Lactose'), ('baixa lactose', 'Baixo Teor de Lactose'), ('contemlactose', 'Contém Lactose')], max_length=22),
        ),
        migrations.AlterField(
            model_name='receita',
            name='tipoDePorcao',
            field=models.CharField(choices=[('inteira', 'Porção Inteira'), ('quebrada', 'Porção Quebrada'), ('SemPorcao', 'Sem Porção')], max_length=20),
        ),
    ]
