from django.contrib import admin
from .models import Receita, Ingrediente , Alergenico, IngredientesReceita
# Register your models here.
admin.site.register(Receita)
admin.site.register(Alergenico)
admin.site.register(Ingrediente)
# admin.site.register(MeusIngredientes)
admin.site.register(IngredientesReceita)
