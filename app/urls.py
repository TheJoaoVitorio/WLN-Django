from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('minhaconta/', views.MinhaConta, name='minha-conta'),
    path('gerenciarconta/', views.GerenciarConta, name='gerenciar-conta'),
]