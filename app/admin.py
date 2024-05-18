from django.contrib import admin
from .models import Receita, Ingrediente , MeusIngredientes
# Register your models here.
admin.site.register(Ingrediente)
admin.site.register(MeusIngredientes)
