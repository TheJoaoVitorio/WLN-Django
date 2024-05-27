const nextButton = document.querySelector('.btn-proximo');
const prevButton = document.querySelector('.btn-voltar');
const steps      = document.querySelectorAll('.step');
const formSteps  = document.querySelectorAll('.form-step');

let active = 1;

nextButton.addEventListener('click', ()=>{
    active++;
    if (active > steps.length){
        active = steps.length;
    }
    updateProgress();
})

prevButton.addEventListener('click', ()=>{
    active--;
    if (active < 1){
        active = 1;
    }
    updateProgress();
})

const updateProgress = ()=>{
    console.log('steps.length =>' + steps.length);
    console.log('active =>'+ active);

    steps.forEach((step,i) => {
        if (i == (active-1)){
            step.classList.add('iconStepActive');
            formSteps[i].classList.add('ativo');
            console.log('i => '+i);
        }else{
            step.classList.remove('iconStepActive');
            formSteps[i].classList.remove('ativo');
        }
    });

    if (active === 1){
        prevButton.disabled = true;
    }else if (active === steps.length){
        nextButton.disabled = true;
    }else{
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
}



function dropDownReceita(){
    //form two
    const dropReceita = document.querySelector('.content-dropReceita');
    const selectBtn = document.querySelector('.select-btn');
    const rotationIcon = selectBtn.querySelector('i');

    selectBtn.addEventListener('click', () => {
        dropReceita.classList.toggle('activeDrop');
        rotationIcon.classList.toggle('rotation-icon');
    });

    //form three
    const dropReceitaAle = document.querySelector('.contentAle');
    const selectBtn3 = document.querySelector('.select-btn-frm3');
    const rotationIcon3 = selectBtn3.querySelector('i');

    selectBtn3.addEventListener('click', ()=>{
        dropReceitaAle.classList.toggle('activeDrop');
        rotationIcon3.classList.toggle('rotation-icon');
    });

}

    document.addEventListener('DOMContentLoaded' , () =>{
        dropDownReceita();
    });

// CHECKBOX - GET MEUS INGREDIENTES