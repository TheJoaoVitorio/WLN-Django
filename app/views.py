from django.http import HttpResponse , HttpResponseRedirect
from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.messages import constants
from django.contrib import messages

from django.contrib.auth import update_session_auth_hash
from django.core.mail import BadHeaderError,send_mail

# Create your views here.
@login_required(login_url='/usuarios/login/')
def home(request):
    if request.method == 'GET':
        return render (request,'principal.html')


@login_required(login_url='/usuarios/login/')
def MinhaConta(request):
    return render(request,'user.html')


@login_required(login_url='/usuarios/login/')
def GerenciarConta(request):
    if request.method == 'POST':
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password1')
        confirmed_new_password = request.POST.get('new_password2')

        if old_password and new_password and confirmed_new_password:
            if request.user.is_authenticated:
                user = User.objects.get(username = request.user.username)
                if not user.check_password(old_password):
                    messages.add_message(request,constants.ERROR,'Senha atual está incorreta!')
                    return redirect ('/app/gerenciarconta/')
                    #return HttpResponse('senha atual não esta correta') #passou
                else:
                    if new_password != confirmed_new_password:
                        messages.add_message(request,constants.ERROR,'Nova senha e confirmar não conferem!')
                        return redirect ('/app/gerenciarconta/')
                        #return HttpResponse('nova senha e confirmar senha não conferem')#passou
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
        return render (request, 'info_usuarios.html')
    

@login_required(login_url='/usuarios/login/')
def ContateNos(request):
    if request.method == 'POST':
        assunto = request.POST.get('assunto-contate-nos')
        mensagem = request.POST.get('mensagem-contate-nos')
        #from_email = request.POST.get('email-wlnutrion')

        UserEmail = request.user.email

        if assunto and mensagem:
            try:
                send_mail(assunto,mensagem,UserEmail,[UserEmail])
                messages.add_message(request,constants.SUCCESS,'Email enviado com sucesso!')
                return redirect('/app/home/')
            except BadHeaderError:
                messages.add_message(request,constants.ERROR,'Email não enviado!')
                return redirect ('/app/gerenciarconta/')
        else:
            messages.add_message(request, constants.ERROR, 'Verifique os campos!')
            return ('/app/gerenciarconta/')
    
    else:
        return render (request, 'contate-nos.html')