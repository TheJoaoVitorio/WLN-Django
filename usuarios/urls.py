from django.urls import path
from . import views

urlpatterns = [
    #path('gerenciarconta/', views.GerenciarConta, name='gerenciar-conta'),

    path('login/',views.Login , name='login'),
    path('logout/', views.logout , name='logout'),
    path('cadastro/' , views.cadastroLogin, name='cadastroLogin')
]