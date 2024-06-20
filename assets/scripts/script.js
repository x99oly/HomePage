

// Variáveis globais
const intervalDuration = 5000;




function returnPagesID(){
    const pagesID = [];

    let pages = document.querySelectorAll('.pages');

    pages.forEach(page => {
        let id = page.id;
        pagesID.push(id);
    })
    //alert(pagesID); main,projetos,contato,blog
}







function goToPage(adress) {
    window.location.href = adress;
}

function page1MobileGridLayout() {
    const content = document.getElementById('content-page1');
    content.style.gridTemplateColumns = returnTrueForMobileWidth() ? 'repeat(1, 100%)' : 'repeat(2, 50%)';
}

function returnTrueForMobileWidth() {
    return window.innerWidth <= 800;
}

function changePosition(event) {
    event.preventDefault();
    const cardChildren = event.currentTarget.querySelector('.card-children');
    cardChildren.style.top = cardChildren.style.top === '0%' ? '-100%' : '0%';
    cardChildren.classList.add('blockChangePosition');
}

// CHAMADAS DE MÉTODOS AO CARREGAR A PÁGINA

document.addEventListener("DOMContentLoaded", function () {
    page1MobileGridLayout();
    returnPagesID();
});

// CHAMADAS DE MÉTODOS AO REDIMENSIONAR A JANELA

window.addEventListener("resize", function () {
    page1MobileGridLayout();
});

// CHAMADAS DE MÉTODOS POR INTERVALO DE TEMPO

setInterval(() => {
    const cards = document.querySelectorAll('#right .card-children');
    cards.forEach(cardChildren => {
        cardChildren.classList.remove('blockChangePosition');
    });
}, intervalDuration * 3);

setInterval(() => {
    const cards = document.querySelectorAll('#right .card-children');
    cards.forEach(cardChildren => {
        if (!cardChildren.classList.contains('blockChangePosition')) {
            cardChildren.style.top = cardChildren.style.top === '0%' ? '-100%' : '0%';
        }
    });
}, intervalDuration);
