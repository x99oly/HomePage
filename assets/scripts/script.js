// Variáveis globais
const intervalDuration = 5000;
let ls = []

// CHAMADAS DE MÉTODOS AO CARREGAR A PÁGINA

document.addEventListener("DOMContentLoaded", function () {
    if(!page1MobileGridLayout()){
        console.log('index out')
        getLS('repo')
        buildPage()
    }
    returnPagesID();
});

// CHAMADAS DE MÉTODOS AO REDIMENSIONAR A JANELA

window.addEventListener("resize", function () {
    if(!page1MobileGridLayout()){
        console.log('index out')
    };
});
//repositorios
function getLS(key){
    if(item = localStorage.getItem(key)){
        ls = JSON.parse(item);
        console.log(ls)
    }else{
        console.log('falhou')
    }
}

function goToPage(event, address) {
    event.preventDefault();
    window.open(address, '_blank');
}

function buildPage(){
    const formattedDate = new Date(ls.repoData).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const content = `
        <header>
        <button class="btn" onclick="goToPage(event, '../../index.html' )">
            Inicio
        </button>
        <button class="btn" onclick="goToPage(event, '${ls.repoLink}')">
            Ver no github
        </button>
    </header>
    <main>

        <div class="container">

            <div id="c0" class="content">
                <img src="https://fazcapital.com.br/wp-content/uploads/2024/01/Como-o-banco-ganha-dinheiro.webp" alt="">
            </div>

            <div id="c1" class="content">
                <h1>${ls.repoName}</h1>
                <p>${ls.repoDescription}.</p>

                <ul id="repoinfo" class="tecnologias">
                    <li> 
                        <p>Linguagem: ${ls.repoLanguage}</p>
                    </li>
                    <li> 
                        <p>Forks: ${ls.repoFork}</p>
                    </li>
                    <li> 
                        <p>Estrelas: ${ls.repoStar}</p>
                    </li>
                    
                </ul>
                <p>Crido em: ${formattedDate}</p>

            </div>
        </div>

    </main>
    `

    document.body.insertAdjacentHTML('beforeend', content)
    
}


//index

function returnPagesID(){
    const pagesID = [];

    let pages = document.querySelectorAll('.pages');

    pages.forEach(page => {
        let id = page.id;
        pagesID.push(id);
    })
    //alert(pagesID); main,projetos,contato,blog
}

function page1MobileGridLayout() {
    let content = ``;
    if(content = document.getElementById('content-page1')){
        content.style.gridTemplateColumns = returnTrueForMobileWidth() ? 'repeat(1, 100%)' : 'repeat(2, 50%)';
    }
}

function returnTrueForMobileWidth() {
    return window.innerWidth <= 800;
}

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
