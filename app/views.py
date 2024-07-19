import json
from django.core import serializers
from django.http import HttpResponse , HttpResponseRedirect , JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.messages import constants
from django.contrib import messages

from django.contrib.auth import update_session_auth_hash
from django.core.mail import BadHeaderError,send_mail
from django.core.paginator import Paginator

from .models import Ingrediente
from .models import Alergenico


# Create your views here.
@login_required(login_url='/usuarios/login/')
def home(request):
    if request.method == 'GET':
        meusIngredientes = Ingrediente.objects.all().filter(id_user=request.user.id)
        baseIngredientes = Ingrediente.objects.filter(id_user=None)
      
        return render (request,'principal.html', {'MeusIngredientes' : meusIngredientes, 'BaseIngredientes':baseIngredientes})
    

@login_required(login_url='/usuarios/login/')
def Receitas(request):
    if request.method == 'GET':
        return render (request, 'receitas.html')
    

@login_required(login_url='/usuarios/login/')
def CriandoReceita(request):
    if request.method == 'POST':
        TituloDaReceita     = request.POST.get('TituloDaReceita')
        MedidaReceita       = request.POST.get('medidaReceita')
        GlutenReceita       = request.POST.get('glutenReceita')
        LactoseReceita      = request.POST.get('lactoseReceita')
        TipoDePorcaoReceita = request.POST.get('tipoDePorcaoReceita')
        PorcoesEmbReceita   = request.POST.get('porcoesEmbaladas')
        PesoFinalReceita    = request.POST.get('pesoFinal')
        PorcaoReceita       = request.POST.get('porcao')    
        MedidaCaseira       = request.POST.get('medidaCaseira') 

        data = json.loads(request.body)
        ingredientes = data.get('ingredientes')

        # Agora você pode iterar sobre os ingredientes e fazer o que precisar com eles
        for ingrediente in ingredientes:
            nome = ingrediente.get('nome')
            quantidade = ingrediente.get('quantidade')
            # Aqui você pode criar objetos no banco de dados ou outra lógica necessária

        return JsonResponse({'success': True})
    else:
        return render (request, 'criando-receita.html')


def getValoresIngredientes(request,nome):
    try:
        ingrediente = Ingrediente.objects.get(nomeIngrediente__icontains=nome)
    except Ingrediente.MultipleObjectsReturned:
        ingredientes = Ingrediente.objects.filter(nomeIngrediente=nome)
        ingrediente = ingredientes.first()
    except Ingrediente.DoesNotExist:
        ingrediente = None
    
    valores = {
        'id' : ingrediente.id,
        'Ingrediente' : ingrediente.nomeIngrediente,
        'Carboidratos': ingrediente.carboidratos,
        'AcucaresTotais': ingrediente.acuTotais,
        'AcucaresAdicionais' : ingrediente.acuAdicionais,
        'Proteinas': ingrediente.proteinas,
        'GordurasTotais': ingrediente.gordTotais,
        'GordurasSaturadas': ingrediente.gordSaturadas,
        'GordurasTrans': ingrediente.gordTrans,
        'Fibra': ingrediente.fibra,
        'Sodio': ingrediente.sodio
    }
    
    return JsonResponse(valores)



@login_required(login_url='/usuarios/login/')
def userIngredientes(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        
        if search:
            meusIngredientes = Ingrediente.objects.filter(nomeIngrediente__icontains=search)
        else:
            meusIngredientesList = Ingrediente.objects.all().filter(id_user=request.user.id)
            paginator = Paginator(meusIngredientesList , 3)
            page = request.GET.get('page')

            meusIngredientes = paginator.get_page(page)
        return render (request, 'ingredientes.html' , {'MeusIngredientes' : meusIngredientes})


@login_required(login_url='/usuarios/login/')
def CriarIngrediente(request):
    if request.method == 'POST':
        try:
            NomeIngrediente = request.POST.get('nome-ingrediente')
            ValorEnergetico = request.POST.get('valor-energetico').replace(',' , '.')
            Carboidratos = request.POST.get('carboidratos').replace(',' , '.')
            AcuTotais = request.POST.get('acucarTotal').replace(',' , '.')
            AcuAdicionais = request.POST.get('acucarAdicionado').replace(',' , '.')
            Proteinas = request.POST.get('proteinas').replace(',' , '.')
            GordTotais = request.POST.get('gordTotais').replace(',' , '.')
            GordSaturadas = request.POST.get('gordSaturadas').replace(',' , '.')
            GordTrans = request.POST.get('gordTrans').replace(',' , '.')
            Fibra = request.POST.get('fibraAlimentar').replace(',' , '.')
            Sodio = request.POST.get('sodio').replace(',' , '.')
            user = request.user
            
            CriandoIngrediente = Ingrediente(
                #fields da class | fields da request
                nomeIngrediente = NomeIngrediente,
                valorEnergetico = ValorEnergetico,
                carboidratos = Carboidratos,
                acuTotais = AcuTotais,
                acuAdicionais = AcuAdicionais,
                proteinas = Proteinas,
                gordTotais = GordTotais,
                gordSaturadas = GordSaturadas,
                gordTrans = GordTrans,
                fibra = Fibra,
                sodio = Sodio,

                id_user = user
            )
            CriandoIngrediente.save()
            messages.add_message(request, constants.SUCCESS, 'Ingrediente criado !')
            return redirect('/app/meusingredientes/')
        except ValueError:
            messages.add_message(request, constants.WARNING, 'Por favor, insira valores numéricos válidos para os campos!')
            return redirect ('/app/criaringrediente/')
        
        except Exception as e:
            messages.add_message(request, constants.ERROR, 'Não foi possivel criar o ingrediente! ')
            return redirect('/app/meusingredientes/')
        
    else:
        return render (request,'criando-ingredientes.html')


@login_required(login_url='/usuarios/login/')
def GetMeusIngredientes(request):
    if request.user.is_authenticated: 
        filtraIngredientesUsuario = Ingrediente.objects.all().filter(id_user=request.user.id)
        meus_ingredientes = list(filtraIngredientesUsuario.values('id','nomeIngrediente'))
        
        return JsonResponse({'MeusIngredientesList':meus_ingredientes})
    else:
        return JsonResponse({'Error' : 'User not authenticated'}, status=401)


@login_required(login_url='/usuarios/login/')
def getBaseIngredientes(request):
    if request.user.is_authenticated:
        filtraBaseIngredientes = Ingrediente.objects.all().filter(id_user=None)
        baseIngredientes = list(filtraBaseIngredientes.values('id','nomeIngrediente'))
        
        return JsonResponse({'baseIngredientesList' : baseIngredientes})
    else:
        return JsonResponse({'Error': 'User not authenticated'}, status=401 )


@login_required(login_url='/usuarios/login')
def GetAlergenicos(request):
    if request.method == 'GET':
        searchAlergenico = request.GET.get('searchAlergenico')
        if searchAlergenico:
            
            alergenicos = Alergenico.objects.filter(nomeAlergenico__icontains=searchAlergenico)
            
        
        alergenicos = Alergenico.objects.all().values("id", "nomeAlergenico")
        return JsonResponse({'ListaAlergenicos': list(alergenicos)})


@login_required(login_url='/usuarios/login/')
def MinhaConta(request):
    return render(request,'user.html')


@login_required(login_url='/usuarios/login/')
def ContateNos(request):
    if request.method == 'POST':
        assunto = request.POST.get('assunto-contate-nos')
        mensagem = request.POST.get('mensagem-contate-nos')
        #from_email = request.POST.get('email-wlnutrion')

        UserEmail = request.user.email

        if assunto and mensagem:
            try:
                            #assunto , mensagem , remetente e [ destinatario ]
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
    
    
def CriarAlergenico(request):
    if request.method == 'POST':
        try:
            NomeAlergenico = request.POST.get('nomeAlergenico')

            CriandoAlergenico = Alergenico(
                nomeAlergenico = NomeAlergenico

            )
            CriandoAlergenico.save()
            
        except ValueError:
            return

        return