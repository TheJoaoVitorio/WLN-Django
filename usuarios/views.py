from django.http import HttpResponse
from django.shortcuts import render,redirect
from django.contrib import auth
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.messages import constants
from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
def cadastroLogin(request):
    if request.method == 'POST':
        username = request.POST.get('nome-usuario')
        email = request.POST.get('email')
        password = request.POST.get('senha')

        try:
            user = User.objects.get(email=email)
            messages.add_message(request,constants.ERROR,'Já existe um usuário com esse email.')
            return redirect('/usuarios/cadastro')
        
        except ObjectDoesNotExist:
            user = User.objects.create_user(
                username = username,
                email = email ,
                password = password 
            )
        return redirect ('/usuarios/login/')
    else:
        return render (request,'criar-conta.html')


def Login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('senha')
        
        user_exists = User.objects.filter(email=email).exists()

        if user_exists:
            user = auth.authenticate(request , username=email , password=password)

            if user is not None:
                auth.login(request,user)
                return redirect ('/app/home/')
            else:
                messages.add_message(request,constants.WARNING,'Email ou senha não conferem!')
                return redirect('/usuarios/login')
        else:
            messages.add_message(request,constants.ERROR,'Realize um cadastro!')
            return redirect ('/usuarios/cadastro')
    else: 
        return render (request,'login.html')    
    
def logout(request):
    auth.logout(request)
    return redirect ('/usuarios/login/')