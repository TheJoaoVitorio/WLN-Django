from django.urls import path
from . import views
from usuarios.views import gerenciarConta
from django.urls import reverse

urlpatterns = [
    path('home/', views.home, name='home'),
    path('receitas/', views.receitas, name='receitas'),
    path('criandoreceita/', views.criandoReceita, name='criando-receita'),
    path('criandoreceita/getValoresIngrediente/<int:id>/', views.getValoresIngredientes, name='get-valores-ingrediente'),
    path('criandoreceita/getAlergenicos/', views.getAlergenicos, name='get-alergenicos'),  
    path('criandoreceita/getBaseIngredientes/', views.getBaseIngredientes, name='get-base-ingredientes'),
    path('criandoreceita/getMeusIngredientes/', views.getMeusIngredientes, name='get-meus-ingredientes'),

    path('meusingredientes/', views.userIngredientes, name='meus-ingredientes'),
    path('criaringrediente/', views.criarIngrediente , name='criar-ingrediente'),
    path('meusingredientes/editaringrediente/<int:Ingrediente_id>/', views.editar_ingrediente, name='editar-ingrediente'),
    
    path('contatenos/', views.contateNos, name='contate-nos'),
    path('minhaconta/', views.minhaConta, name='minha-conta'),
    path('gerenciarconta/', gerenciarConta, name='gerenciar-conta'), #import do app usuarios

    path('admin/app/alergenico/add/', views.criarAlergenico),
]