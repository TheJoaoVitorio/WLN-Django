from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('meusingredientes/', views.userIngredientes, name='meus-ingredientes'),
    path('criaringrediente/', views.CriarIngrediente , name='criar-ingrediente'),
    path('contatenos/', views.ContateNos, name='contate-nos'),
    path('minhaconta/', views.MinhaConta, name='minha-conta'),
    path('gerenciarconta/', views.GerenciarConta, name='gerenciar-conta'),
]