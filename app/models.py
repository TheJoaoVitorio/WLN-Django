from django.db import models
#from usuarios.models import Perfil
from django.contrib.auth.models import User

# Create your models here.
class Ingrediente(models.Model):
    id_user = models.ForeignKey(User, on_delete=models.PROTECT)
    
    nomeIngrediente = models.CharField(max_length=40)
    valorEnergetico = models.DecimalField(max_digits=10, decimal_places=2)
    carboidratos = models.DecimalField(max_digits=10, decimal_places=2)
    acuTotais = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    acuAdicionais = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    proteinas = models.DecimalField(max_digits=10, decimal_places=2)
    gordTotais = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    gordSaturadas =  models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    gordTrans = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    fibra = models.DecimalField(max_digits=10, decimal_places=2 , null=True)
    sodio = models.DecimalField(max_digits=10, decimal_places=2 , null=True)

    def __str__(self):
        return self.nomeIngrediente
    

class Receita(models.Model):
    #CHOICES
    MEDIDAS = [('g','gramas'),
                ('ml','mililitros') ]
    
    GLUTENS = [('zero gluten','Não Contém Glúten'),
               ('com gluten','Contém Glúten') ]
    
    LACTOSES = [('zerolactose','Zero Lactose'),
                ('baixa lactose','Baixo Teor de Lactose'),
                ('contemlactose','Contém Lactose') ]
    
    TIPODEPORCAO = [('inteira','Porção Inteira'),
                    ('quebrada','Porção Quebrada'),
                    ('SemPorcao','Sem Porção') ]

    nomeReceita = models.CharField(max_length = 40)
    medida = models.CharField(max_length=11, choices=MEDIDAS)
    gluten = models.CharField(max_length=17, choices=GLUTENS)
    lactose = models.CharField(max_length=22, choices=LACTOSES)
    tipoDePorcao = models.CharField(max_length=20, choices=TIPODEPORCAO)
    porcaoEmb = models.IntegerField()
    pesoFinal = models.DecimalField(max_digits=10, decimal_places=2)
    porcao = models.DecimalField(max_digits=10, decimal_places=2)
    medidaCaseira = models.CharField(max_length=40)

    user = models.ForeignKey(User, on_delete=models.PROTECT)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nomeReceita

class IngredientesReceita(models.Model):
    id_receita = models.ForeignKey(Receita, on_delete=models.CASCADE)
    id_ingrediente = models.ForeignKey(Ingrediente, on_delete=models.CASCADE, related_name='receitas_ingredientes')



class Alergenico(models.Model):
    nomeAlergenico = models.CharField(max_length=100)

    def __str__(self):
        return self.nomeAlergenico


class AlergenicoReceita(models.Model):
    id_receita = models.ForeignKey(Receita, on_delete=models.PROTECT)
    id_alergenico = models.ForeignKey(Alergenico, on_delete=models.PROTECT)

