from django.http import HttpResponse
from django.shortcuts import render,redirect
from django.contrib import auth
from django.contrib.auth import authenticate , login , logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.messages import constants
from django.contrib import messages
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import update_session_auth_hash
from django.urls import reverse

from .models import Perfil

# Create your views here.
@login_required(login_url='/usuarios/login')
def inserirFotoPerfil(request):
    if request.method == 'POST':
        foto = request.FILES.get('foto-perfil')

        if foto:
            try:
                # Tenta obter o perfil existente do usuário
                perfil, created = Perfil.objects.get_or_create(user=request.user)
                
                # Atualiza a foto se um perfil já existir
                perfil.fotoPerfil = foto
                perfil.save()

                messages.add_message(request, constants.SUCCESS, "Foto adicionada ou atualizada com sucesso!")
                return redirect('/app/minhaconta/')
            
            except Exception as error:
                messages.add_message(request, constants.ERROR, f"Erro inesperado: {error}")
                return redirect('/app/minhaconta/')
        else:
            messages.add_message(request, constants.WARNING, "Nenhuma foto foi selecionada!")
            return redirect('/app/minhaconta/')


@login_required(login_url='/usuarios/login/')
def gerenciarConta(request):
    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password1')
        confirmed_new_password = request.POST.get('new_password2')

        if new_password and confirmed_new_password == old_password:
            messages.add_message(request,constants.ERROR,'A Senha nova não pode ser igual a antiga!')
            return redirect ('/app/gerenciarconta/')

        if old_password and new_password and confirmed_new_password:
            if request.user.is_authenticated:
                user = User.objects.get(username = request.user.username)
                if not user.check_password(old_password):
                    messages.add_message(request,constants.ERROR,'Senha atual está incorreta!')
                    return redirect ('/app/gerenciarconta/')
                
                else:
                    if new_password != confirmed_new_password:
                        messages.add_message(request,constants.ERROR,'Nova senha e confirmar não conferem!')
                        return redirect ('/app/gerenciarconta/')
                    
                    if len(new_password) and len(confirmed_new_password) < 8:
                        messages.add_message(request, constants.ERROR, 'Insira uma senha maior que 8 caracteres!')
                        return redirect ('/app/gerenciarconta/')
                    
                    else:
                        user.set_password(new_password)
                        user.save()
                        update_session_auth_hash(request, user)
                        messages.add_message(request,constants.SUCCESS,'Senha trocada!')
                        return redirect ('/app/home/')
                    
        else:
            messages.add_message(request,constants.WARNING,'Campos inválidos!')
            return redirect('/app/gerenciarconta/')
        
    else:
        try:
            usuarioPerfil = Perfil.objects.get(user=request.user)
        except Perfil.DoesNotExist:
            usuarioPerfil = None
            
        return render (request, 'info_usuarios.html', {'perfil':usuarioPerfil})

def cadastroLogin(request):
    if request.method == 'POST':
        username = request.POST.get('nome-usuario')
        email = request.POST.get('email')
        password = request.POST.get('senha')

        if len(password) < 8:
            messages.add_message(request, constants.ERROR, 'Insira uma senha maior que 8 caracteres ')
            return redirect('/usuarios/cadastro')

        if User.objects.filter(username=username).exists():
            messages.add_message(request, constants.ERROR, 'Já existe um usuário com esse nome.')
            return redirect('/usuarios/cadastro')
        
        if User.objects.filter(email=email).exists():
            messages.add_message(request, constants.ERROR, 'Já existe um usuário com esse email.')
            return redirect('/usuarios/cadastro')
        
        # Criação do usuário
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        return redirect('/usuarios/login/')
    else:
        return render (request,'criar-conta.html')


def login(request):
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
    
        if request.user.is_authenticated:
            return redirect(reverse('home'))
            
        return render (request,'login.html')    
    

def logout(request):
    auth.logout(request)
    return redirect ('/usuarios/login/')