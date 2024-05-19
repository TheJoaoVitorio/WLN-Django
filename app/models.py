from django.db import models
from usuarios.models import Perfil
from django.contrib.auth.models import User

# Create your models here.
class Ingrediente(models.Model):
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
    

class MeusIngredientes(Ingrediente):

    user = models.ForeignKey(User, on_delete=models.PROTECT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Alergenico(models.Model):
    nomeAlergenico = models.CharField(max_length=100)


class Receita(models.Model):
    #CHOICES
    MEDIDAS = [('g','gramas'),
                ('ml','mililitros') ]
    
    GLUTENS = [('zero gluten','Não Contém Glúten'),
               ('com gluten','Contém Glúten') ]
    
    LACTOSES = [('zero lactose','Zero Lactose'),
                ('baixa lactose','Baixo Teor de Lactose'),
                ('contem lactose','Contém Lactose') ]
    
    TIPODEPORCAO = [('inteira','Porção Inteira'),
                    ('quebrada','Porção Quebrada'),
                    ('sem porcao','Sem Porção') ]

    nomeReceita = models.CharField(max_length = 40)
    medida = models.CharField(max_length=11, choices=MEDIDAS)
    gluten = models.CharField(max_length=17, choices=GLUTENS)
    lactose = models.CharField(max_length=22, choices=LACTOSES)
    tipoDePorcao = models.CharField(max_length=20, choices=TIPODEPORCAO)
    porcaoEmb = models.IntegerField()
    pesoFinal = models.DecimalField(max_digits=10, decimal_places=2)
    porcao = models.DecimalField(max_digits=10, decimal_places=2)
    medidaCaseira = models.CharField(max_length=40)

    user = models.ForeignKey(Perfil, on_delete=models.PROTECT)

    ingrediente = models.ManyToManyField(Ingrediente, related_name='receitas_com_ingrediente')
    meus_ingredientes = models.ManyToManyField(MeusIngredientes, related_name='receitas_com_meus_ingredientes' )
    alegenicos = models.ManyToManyField(Alergenico)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nomeReceita
    
