import json
from django.core import serializers
from django.http import HttpResponse , HttpResponseRedirect , JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import render , redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.messages import constants
from django.contrib import messages
from django.http import HttpResponseForbidden

from django.contrib.auth import update_session_auth_hash
from django.core.mail import BadHeaderError,send_mail
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Ingrediente
from .models import Alergenico
from .models import Receita
from .models import IngredientesReceita
from .models import AlergenicoReceita

from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.urls import reverse 

 

# Create your views here.
@login_required(login_url='/usuarios/login/')
def home(request):
    if request.method == 'GET':
        meusIngredientes = Ingrediente.objects.all().filter(id_user=request.user.id)
        baseIngredientes = Ingrediente.objects.filter(id_user=None)
        receitas = Receita.objects.all().filter(user=request.user.id)
        ultimasReceitas = Receita.objects.all().filter(user=request.user.id).order_by('-created_at')[:5]
        return render (request,'principal.html', {'MeusIngredientes' : meusIngredientes, 'BaseIngredientes':baseIngredientes,'UltimasReceitas':ultimasReceitas , 'Receitas':receitas})
    

@login_required(login_url='/usuarios/login')
def verIngredientesSistema(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        if search:
            BaseIngredientes = Ingrediente.objects.filter(id_user=None,nomeIngrediente__icontains=search)
        else:
            listBaseIngredientes = Ingrediente.objects.all().filter(id_user=None)
            paginator = Paginator(listBaseIngredientes,4)
            page = request.GET.get('page')
            try:
                BaseIngredientes = paginator.get_page(page)
            except PageNotAnInteger:
                BaseIngredientes = paginator.get_page(1)
            except EmptyPage:
                BaseIngredientes = paginator.page(paginator.num_pages)
            
        return render (request,'baseIngredientes.html',{'baseIngredientes':BaseIngredientes})


@login_required(login_url='/usuarios/login/')
def receitas(request):
    if request.method == 'GET':
        search = request.GET.get('search')
        if search:
            minhasReceitas = Receita.objects.filter(nomeReceita__icontains=search, user=request.user.id)
        else:
            receitas = Receita.objects.all().filter(user=request.user.id)

            paginator = Paginator(receitas,4)
            page = request.GET.get('page')
            try:
                minhasReceitas = paginator.get_page(page)
            except PageNotAnInteger:
                minhasReceitas = paginator.get_page(1)
            except EmptyPage:
                minhasReceitas = paginator.page(paginator.num_pages)

        return render (request, 'receitas.html', {'Receitas':minhasReceitas})


@login_required(login_url='/usuarios/login')
def excluirReceita(request,Receita_id):
    if request.method == 'GET':
        try:
            receita = get_object_or_404(Receita, id=Receita_id)
            if receita.user != request.user:
                return HttpResponseForbidden("Você não tem permissão para excluir esta receita.")
        
            receita.delete()
            messages.add_message(request, constants.SUCCESS, 'Receita deletada com sucesso!')
            return redirect('/app/home/')
        except Exception as Error:
            messages.add_message(request, constants.ERROR, f'Error:{Error}')
            return redirect('/app/receitas')

@login_required(login_url='/usuarios/login/')
def criandoReceita(request):
    if request.method == "GET":
        return render (request, 'criando-receita.html')


@login_required(login_url='/usuarios/login/')
def cadastraReceita(request):
    if request.method == "POST":
        try:
            TituloDaReceita     = request.POST.get('TituloDaReceita')
            MedidaReceita       = request.POST.get('medidaReceita')
            GlutenReceita       = request.POST.get('glutenReceita')
            LactoseReceita      = request.POST.get('lactoseReceita')
            TipoDePorcaoReceita = request.POST.get('tipoDePorcaoReceita')
            PorcoesEmbReceita   = request.POST.get('porcoesEmbaladas')
            PesoFinalReceita    = request.POST.get('pesoFinal')
            PorcaoReceita       = request.POST.get('porcao')    
            MedidaCaseira       = request.POST.get('medidaCaseira') 

            usuario = request.user
            
            CriandoReceita = Receita(
                nomeReceita = TituloDaReceita,
                medida = MedidaReceita,
                gluten = GlutenReceita,
                lactose = LactoseReceita,

                tipoDePorcao = TipoDePorcaoReceita,
                porcaoEmb = PorcoesEmbReceita,
                pesoFinal = PesoFinalReceita,
                porcao = PorcaoReceita,
                medidaCaseira = MedidaCaseira,
                
                user = usuario
            )
            
            CriandoReceita.save()
            messages.add_message(request, constants.SUCCESS, 'Receita Criada com sucesso!')
            return JsonResponse({'message': 'Receita criada com sucesso!'}, status=200)
        
        except ValueError:
            messages.add_message(request, constants.ERROR, 'Erro ao criar a receita!')
            return redirect('/app/home/')
        
        except Exception as e:
            messages.add_message(request, constants.ERROR, f"Erro inesperado: {e}")
            return redirect('/app/home/')


@login_required(login_url='/usuarios/login/')
def cadastraIngredientesReceita(request):
    try:
        ultimaReceita = Receita.objects.filter(user=request.user).latest('id')

        data = json.loads(request.body)
        ingredientes = data.get('ingredientes', [])

        for ingrediente_data in ingredientes:
            ingrediente_id = ingrediente_data.get('Id') 
            ingrediente_qtd = ingrediente_data.get('Quantidade').replace(',' , '.')
            try:
                ID_ingrediente = Ingrediente.objects.get(id=ingrediente_id)
                IngredientesReceita.objects.create(
                    #fields class | field da request
                    id_receita = ultimaReceita,
                    id_ingrediente = ID_ingrediente,
                    qtdIngrediente = ingrediente_qtd
                )
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
            
            except Ingrediente.DoesNotExist:
                return JsonResponse({'error': f'Ingrediente com ID {ingrediente_id} não encontrado'}, status=400)
            
        return JsonResponse({'message': 'Ingredientes cadastrados com sucesso!'}, status=201)

    
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Receita.DoesNotExist:
        return JsonResponse({'error': 'Nenhuma receita encontrada para o usuário'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required(login_url='/usuarios/login/')
def cadastraAlergenicosReceita(request):
    if request.method == 'POST':
        try:
            ultimaReceita = Receita.objects.filter(user=request.user).latest('id')
        
            data = json.loads(request.body)
            alergenicos = data.get('alergenicos', [])
            
            for alergenico_data in alergenicos:
                alergenico_id = alergenico_data.get('idAlergenico')
                try:
                    ID_ALERGENICO = Alergenico.objects.get(id=alergenico_id)
                    AlergenicoReceita.objects.create(
                        id_receita = ultimaReceita,
                        id_alergenico = ID_ALERGENICO
                    )
                    
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=500)

                except Alergenico.DoesNotExist:
                    return JsonResponse({'error': 'Nenhum Alergenico encontrado'},status=404)
                
            return JsonResponse({'message': 'Ingredientes cadastrados com sucesso!'}, status=201)
        
            
        except Receita.DoesNotExist:
            return JsonResponse({'error': 'Nenhuma Receita encontrada'},status=404)


@login_required(login_url='/usuarios/login/')
def getTabelaNutricional(request,modeloTabela):
    if request.method == 'GET':
        totais = {
               'ValorEnergetico'       : 0,
                'Carboidratos'         : 0,
                'AcucaresTotais'       : 0,
                'AcucaresAdicionais'   : 0,
                'Proteinas'            : 0,
                'GordurasTotais'       : 0,
                'GordurasSaturadas'    : 0,
                'GordurasTrans'        : 0,
                'Fibra'                : 0,
                'Sodio'                : 0
        }

        totaisPorPorcao = {
                'ValorEnergetico'      : 0,
                'Carboidratos'         : 0,
                'AcucaresTotais'       : 0,
                'AcucaresAdicionais'   : 0,
                'Proteinas'            : 0,
                'GordurasTotais'       : 0,
                'GordurasSaturadas'    : 0,
                'GordurasTrans'        : 0,
                'Fibra'                : 0,
                'Sodio'                : 0
        }

        VD = {
                'ValorEnergetico'   : 2000,
                'Carboidratos'      : 300,
                'AcucaresAdicionais': 50,
                'Proteinas'         : 75,
                'GordurasTotais'    : 55,
                'GordurasSaturadas' : 22,
                'Fibra'             : 25,
                'Sodio'             : 2400
        }

        valoresDiarios = {
                'ValorEnergetico'   : 0,
                'Carboidratos'      : 0,
                'AcucaresAdicionais': 0,
                'Proteinas'         : 0,
                'GordurasTotais'    : 0,
                'GordurasSaturadas' : 0,
                'Fibra'             : 0,
                'Sodio'             : 0
        }
        
    
        ultimaReceita = Receita.objects.filter(user=request.user).latest('id')

        nomeReceita = ultimaReceita.nomeReceita
        porcaoEmbalada = ultimaReceita.porcaoEmb
        porcaoReceita = ultimaReceita.porcao
        medidaCaseiraReceita = ultimaReceita.medidaCaseira
        ingredientesReceita = IngredientesReceita.objects.filter(id_receita_id=ultimaReceita.id)
        alergenicosReceita = AlergenicoReceita.objects.filter(id_receita=ultimaReceita.id)

        listaIngredientes = []
        listaAlergenicos = []

        info = {
            'NomeReceita': nomeReceita,
            'PorcaoEmb' :porcaoEmbalada,
            'Porcao': porcaoReceita,
            'MedidaCaseira': medidaCaseiraReceita
        }
        for item in alergenicosReceita:
            listaAlergenicos.append({'NomeAlergenico': item.id_alergenico.nomeAlergenico})
        

        for item in ingredientesReceita:
            quantidade = Decimal(item.qtdIngrediente) or Decimal('0')
        
            listaIngredientes.append({'NomeIngrediente': item.id_ingrediente.nomeIngrediente})
        
            totais["ValorEnergetico"]    += (item.id_ingrediente.valorEnergetico * quantidade) / Decimal('100')
            totais["Carboidratos"]       += (item.id_ingrediente.carboidratos * quantidade) / Decimal('100')
            totais["AcucaresTotais"]     += (item.id_ingrediente.acuTotais * quantidade) / Decimal('100')
            totais["AcucaresAdicionais"] += (item.id_ingrediente.acuAdicionais * quantidade) / Decimal('100')
            totais["Proteinas"]          += (item.id_ingrediente.proteinas * quantidade) / Decimal('100')
            totais["GordurasTotais"]     += (item.id_ingrediente.gordTotais * quantidade) / Decimal('100')
            totais["GordurasSaturadas"]  += (item.id_ingrediente.gordSaturadas * quantidade) / Decimal('100')
            totais["GordurasTrans"]      += (item.id_ingrediente.gordTrans * quantidade) / Decimal('100')
            totais["Fibra"]              += (item.id_ingrediente.fibra * quantidade) / Decimal('100')
            totais["Sodio"]              += (item.id_ingrediente.sodio * quantidade) / Decimal('100')

        for item in ingredientesReceita:
            totaisPorPorcao["ValorEnergetico"]    += (item.id_ingrediente.valorEnergetico * porcaoReceita) / 100
            totaisPorPorcao["Carboidratos"]       += (item.id_ingrediente.carboidratos * porcaoReceita) / 100
            totaisPorPorcao["AcucaresTotais"]     += (item.id_ingrediente.acuTotais * porcaoReceita) / 100
            totaisPorPorcao["AcucaresAdicionais"] += (item.id_ingrediente.acuAdicionais * porcaoReceita) / 100
            totaisPorPorcao["Proteinas"]          += (item.id_ingrediente.proteinas * porcaoReceita) / 100
            totaisPorPorcao["GordurasTotais"]     += (item.id_ingrediente.gordTotais * porcaoReceita) / 100
            totaisPorPorcao["GordurasSaturadas"]  += (item.id_ingrediente.gordSaturadas * porcaoReceita) / 100
            totaisPorPorcao["GordurasTrans"]      += (item.id_ingrediente.gordTrans * porcaoReceita) / 100
            totaisPorPorcao["Fibra"]              += (item.id_ingrediente.fibra * porcaoReceita) / 100
            totaisPorPorcao["Sodio"]              += (item.id_ingrediente.sodio * porcaoReceita) / 100
        
        for item in totais:
            if item in VD:
                valoresDiarios[item] = (totais[item] / VD[item]) * 100
                
        conteudo = {
            'info'             : info,
            'totais'           : totais,
            'totaisPorPorcao'  : totaisPorPorcao,
            'VD'               : valoresDiarios,
            'listaIngredientes': listaIngredientes,
            'listaAlergenicos' : listaAlergenicos
        }

        if modeloTabela == 'ModeloVertical':
            return render (request,'tabelaVert.html', {'Valores':conteudo})
        elif modeloTabela == 'ModeloHorizontal':
            return render (request,'tabelaHorriz.html', {'Valores':conteudo})
        elif modeloTabela == 'ModeloLinear':
            return render (request,'tabelaLinear.html', {'Valores':conteudo})   


@login_required(login_url='/usuarios/login/')
def getValoresIngredientes(request,id):
    try:
        ingrediente = Ingrediente.objects.get(id__icontains=id)
    
    except Ingrediente.MultipleObjectsReturned:
        ingredientes = Ingrediente.objects.filter(id=id)
        ingrediente = ingredientes.first()
    
    except Ingrediente.DoesNotExist:
        if ingrediente is None:
            return JsonResponse({'error': 'Ingrediente não encontrado'}, status=404)
    
    valores = {
        'id' : ingrediente.id,
        'Ingrediente' : ingrediente.nomeIngrediente,
        'ValorEnergetico':ingrediente.valorEnergetico,
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
            try:
                meusIngredientes = paginator.get_page(page)
            except PageNotAnInteger:
                meusIngredientes = paginator.get_page(1)
            except EmptyPage:
                meusIngredientes = paginator.page(paginator.num_pages)

        return render (request, 'ingredientes.html' , {'MeusIngredientes' : meusIngredientes})


@login_required(login_url='/usuarios/login/')
def criarIngrediente(request):
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
def editar_ingrediente(request, Ingrediente_id):
    try:
        obj_ingrediente = get_object_or_404(Ingrediente, id=Ingrediente_id)

        if request.method == 'GET':
            if Ingrediente_id:
                obj_ingrediente = get_object_or_404(Ingrediente, id=Ingrediente_id)
                url = reverse('editar-ingrediente', kwargs={'Ingrediente_id': Ingrediente_id})
                return render(request,'editar-ingrediente.html',{'ingrediente':obj_ingrediente})
            else:
                obj_ingrediente = None
        else :
            obj_ingrediente.nomeIngrediente = request.POST.get('nome-ingrediente').replace(',' , '.')
            obj_ingrediente.valorEnergetico = request.POST.get('valor-energetico').replace(',' , '.')
            obj_ingrediente.carboidratos = request.POST.get('carboidratos').replace(',' , '.')
            obj_ingrediente.acuTotais = request.POST.get('acucarTotal').replace(',' , '.')
            obj_ingrediente.acuAdicionais = request.POST.get('gordSaturadas').replace(',' , '.')
            obj_ingrediente.proteinas = request.POST.get('proteinas').replace(',' , '.')
            obj_ingrediente.gordTotais = request.POST.get('gordTotais').replace(',' , '.')               
            obj_ingrediente.gordSaturadas =request.POST.get('gordSaturadas').replace(',' , '.')                      
            obj_ingrediente.gordTrans = request.POST.get('gordTrans').replace(',' , '.')                           
            obj_ingrediente.fibra = request.POST.get('fibraAlimentar').replace(',' , '.')
            obj_ingrediente.sodio =request.POST.get('sodio').replace(',' , '.')

            obj_ingrediente.save()
            messages.add_message(request,constants.SUCCESS,"ingrediente editado com sucesso")

            url = reverse('editar-ingrediente', kwargs={'Ingrediente_id': Ingrediente_id})
            
            return redirect('/app/meusingredientes/')
        
    except Ingrediente.DoesNotExist:
        messages.add_message(request, constants.ERROR, f"Ingrediente não existe!")
        return redirect('/app/meusingredientes/')

    except Exception as e:
        messages.add_message(request, constants.ERROR, f"Erro inesperado: {e}")
        return redirect('/app/meusingredientes/')



@login_required(login_url='/usuarios/login/')
def visualizar_receita(request, receita_id):
    if request.method == "GET":
        try:
            # verReceita = get_object_or_404(Receita, id= receita_id)
            verReceita = get_object_or_404(Receita, id=receita_id, user=request.user)
        
            nomeReceita = verReceita.nomeReceita
            porcaoEmbalada = verReceita.porcaoEmb
            porcaoReceita = verReceita.porcao
            medidaCaseiraReceita = verReceita.medidaCaseira
            
            # Recupera os ingredientes e alérgenos associados à receita
            ingredientesReceita = IngredientesReceita.objects.filter(id_receita=verReceita.id)
            alergenicosReceita = AlergenicoReceita.objects.filter(id_receita=verReceita.id)
        

            totais = {
               'ValorEnergetico'       : 0,
                'Carboidratos'         : 0,
                'AcucaresTotais'       : 0,
                'AcucaresAdicionais'   : 0,
                'Proteinas'            : 0,
                'GordurasTotais'       : 0,
                'GordurasSaturadas'    : 0,
                'GordurasTrans'        : 0,
                'Fibra'                : 0,
                'Sodio'                : 0
            }

            totaisPorPorcao = {
                    'ValorEnergetico'      : 0,
                    'Carboidratos'         : 0,
                    'AcucaresTotais'       : 0,
                    'AcucaresAdicionais'   : 0,
                    'Proteinas'            : 0,
                    'GordurasTotais'       : 0,
                    'GordurasSaturadas'    : 0,
                    'GordurasTrans'        : 0,
                    'Fibra'                : 0,
                    'Sodio'                : 0
            }

            VD = {
                    'ValorEnergetico'   : 2000,
                    'Carboidratos'      : 300,
                    'AcucaresAdicionais': 50,
                    'Proteinas'         : 75,
                    'GordurasTotais'    : 55,
                    'GordurasSaturadas' : 22,
                    'Fibra'             : 25,
                    'Sodio'             : 2400
            }

            valoresDiarios = {
                    'ValorEnergetico'   : 0,
                    'Carboidratos'      : 0,
                    'AcucaresAdicionais': 0,
                    'Proteinas'         : 0,
                    'GordurasTotais'    : 0,
                    'GordurasSaturadas' : 0,
                    'Fibra'             : 0,
                    'Sodio'             : 0
            }

            listaIngredientes = []
            listaAlergenicos = []

            info = {
                'NomeReceita': nomeReceita,
                'PorcaoEmb' :porcaoEmbalada,
                'Porcao': porcaoReceita,
                'MedidaCaseira': medidaCaseiraReceita
            }
            for item in alergenicosReceita:
                listaAlergenicos.append({'NomeAlergenico': item.id_alergenico.nomeAlergenico})
            

            for item in ingredientesReceita:
                quantidade = Decimal(item.qtdIngrediente) or Decimal('0')
            
                listaIngredientes.append({'NomeIngrediente': item.id_ingrediente.nomeIngrediente})
            
                totais["ValorEnergetico"]    += (item.id_ingrediente.valorEnergetico * quantidade) / Decimal('100')
                totais["Carboidratos"]       += (item.id_ingrediente.carboidratos * quantidade) / Decimal('100')
                totais["AcucaresTotais"]     += (item.id_ingrediente.acuTotais * quantidade) / Decimal('100')
                totais["AcucaresAdicionais"] += (item.id_ingrediente.acuAdicionais * quantidade) / Decimal('100')
                totais["Proteinas"]          += (item.id_ingrediente.proteinas * quantidade) / Decimal('100')
                totais["GordurasTotais"]     += (item.id_ingrediente.gordTotais * quantidade) / Decimal('100')
                totais["GordurasSaturadas"]  += (item.id_ingrediente.gordSaturadas * quantidade) / Decimal('100')
                totais["GordurasTrans"]      += (item.id_ingrediente.gordTrans * quantidade) / Decimal('100')
                totais["Fibra"]              += (item.id_ingrediente.fibra * quantidade) / Decimal('100')
                totais["Sodio"]              += (item.id_ingrediente.sodio * quantidade) / Decimal('100')

            for item in ingredientesReceita:
                totaisPorPorcao["ValorEnergetico"]    += (item.id_ingrediente.valorEnergetico * porcaoReceita) / 100
                totaisPorPorcao["Carboidratos"]       += (item.id_ingrediente.carboidratos * porcaoReceita) / 100
                totaisPorPorcao["AcucaresTotais"]     += (item.id_ingrediente.acuTotais * porcaoReceita) / 100
                totaisPorPorcao["AcucaresAdicionais"] += (item.id_ingrediente.acuAdicionais * porcaoReceita) / 100
                totaisPorPorcao["Proteinas"]          += (item.id_ingrediente.proteinas * porcaoReceita) / 100
                totaisPorPorcao["GordurasTotais"]     += (item.id_ingrediente.gordTotais * porcaoReceita) / 100
                totaisPorPorcao["GordurasSaturadas"]  += (item.id_ingrediente.gordSaturadas * porcaoReceita) / 100
                totaisPorPorcao["GordurasTrans"]      += (item.id_ingrediente.gordTrans * porcaoReceita) / 100
                totaisPorPorcao["Fibra"]              += (item.id_ingrediente.fibra * porcaoReceita) / 100
                totaisPorPorcao["Sodio"]              += (item.id_ingrediente.sodio * porcaoReceita) / 100
            
            for item in totais:
                if item in VD:
                    valoresDiarios[item] = (totais[item] / VD[item]) * 100
                    
            conteudo = {
                'info'             : info,
                'totais'           : totais,
                'totaisPorPorcao'  : totaisPorPorcao,
                'VD'               : valoresDiarios,
                'listaIngredientes': listaIngredientes,
                'listaAlergenicos' : listaAlergenicos
            }


        except Receita.DoesNotExist:
            messages.add_message(request, constants.ERROR, f"Receita não existe! ")
            return redirect('/app/receitas')
        except Exception as error:
            messages.add_message(request, constants.ERROR, f"Erro inesperado: {error} ")
            return redirect('/app/receitas')
        
        return render(request, 'tabelaPreView.html', {'Valores': conteudo}) 


@login_required(login_url='/usuarios/login/')
def getMeusIngredientes(request):
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
def getAlergenicos(request):
    if request.method == 'GET':
        searchAlergenico = request.GET.get('searchAlergenico')
        if searchAlergenico:
            alergenicos = Alergenico.objects.filter(nomeAlergenico__icontains=searchAlergenico)
            
        alergenicos = Alergenico.objects.all().values("id", "nomeAlergenico")
        return JsonResponse({'ListaAlergenicos': list(alergenicos)})


@login_required(login_url='/usuarios/login/')
def minhaConta(request):
    return render(request,'user.html')


@login_required(login_url='/usuarios/login/')
def contateNos(request):
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
    
    
def criarAlergenico(request):
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
    
def ver_receita(request):
    return render( request, 'tabelaPreView.html')

