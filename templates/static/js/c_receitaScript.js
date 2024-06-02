const nextButton = document.querySelector('.btn-proximo');
const prevButton = document.querySelector('.btn-voltar');
const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');
const lines = document.querySelectorAll('.line');

let active = 1;

nextButton.addEventListener('click', () => {
    active++;
    if (active > steps.length) {
        active = steps.length;
    }
    updateProgress();
});

prevButton.addEventListener('click', () => {
    active--;
    if (active < 1) {
        active = 1;
    }
    updateProgress();
});

const updateProgress = () => {
    console.log('steps.length =>' + steps.length);
    console.log('active =>' + active);

    steps.forEach((step, i) => {
        if (i < active) {
            step.classList.add('iconStepActive');
        } else {
            step.classList.remove('iconStepActive');
        }
    });

    formSteps.forEach((formStep, i) => {
        if (i === (active - 1)) {
            formStep.classList.add('ativo');
        } else {
            formStep.classList.remove('ativo');
        }
    });

    lines.forEach((line, i) => {
        if (i < (active - 1)) {
            line.classList.add('activeLine');
        } else {
            line.classList.remove('activeLine');
        }
    });

    if (active === 1) {
        prevButton.disabled = true;
    } else if (active === steps.length) {
        nextButton.disabled = true;
    } else {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
};

function dropDownReceita() {
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

    selectBtn3.addEventListener('click', () => {
        dropReceitaAle.classList.toggle('activeDrop');
        rotationIcon3.classList.toggle('rotation-icon');
    });

    //form four
    const dropReceitaTiposRotulos = document.querySelector('.contentTiposRotulos');
    const selectBtn4 = document.querySelector('.select-btn-frm4');
    const rotationIcon4 = selectBtn4.querySelector('i');

    selectBtn4.addEventListener('click', () => {
        dropReceitaTiposRotulos.classList.toggle('activeDrop');
        rotationIcon4.classList.toggle('rotation-icon');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    dropDownReceita();
    updateProgress();
});
