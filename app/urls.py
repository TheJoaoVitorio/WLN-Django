from django.urls import path
from . import views
from usuarios.views import GerenciarConta

urlpatterns = [
    path('home/', views.home, name='home'),
    path('receitas/', views.Receitas, name='receitas'),
    path('criandoreceita/', views.CriandoReceita, name='criando-receita'),

    path('criandoreceita/getValoresIngrediente/<str:nome>/', views.getValoresIngredientes, name='get-valores-ingrediente'),

    path('criandoreceita/getAlergenicos/', views.GetAlergenicos, name='get-alergenicos'),
    path('criandoreceita/getDadosIngredientes/', views.GetDadosIngredientes , name='get-dados-ingredientes'),
    path('criandoreceita/getMeusIngredientes/', views.GetMeusIngredientes, name='get-meus-ingredientes'),
    path('meusingredientes/', views.userIngredientes, name='meus-ingredientes'),
    path('criaringrediente/', views.CriarIngrediente , name='criar-ingrediente'),
    path('contatenos/', views.ContateNos, name='contate-nos'),
    path('minhaconta/', views.MinhaConta, name='minha-conta'),
    
    path('gerenciarconta/', GerenciarConta, name='gerenciar-conta'), #import do app usuarios

    path('admin/app/alergenico/add/', views.CriarAlergenico),
]