const imgsRepos = {
    "Excecos_Contabancaria": "../images/banco.jpg",
    "Chess": "../images/chess.jpg",
    "icei-pucminas-psg-si-n-tiaw-2024-1-grupo-1-reserva-de-lanches": "../images/lanche.jpg",
    "Ludo": "../images/ludo.jpg",
    "HomePage": "../images/portifolio.jpg",
    "MyHomePage": "../images/portifolio.jpg",
    "server": "../images/server.jpg",
    "JSONServer": "../images/server.jpg"
}

// Variáveis globais
const intervalDuration = 5000;
// CHAMADAS DE MÉTODOS AO CARREGAR A PÁGINA

document.addEventListener("DOMContentLoaded", function () {
    if (!page1MobileGridLayout()) {
        console.log('index out')
        getJSOn()
    }
    returnPagesID();
});

// CHAMADAS DE MÉTODOS AO REDIMENSIONAR A JANELA

window.addEventListener("resize", function () {
    if (!page1MobileGridLayout()) {
        console.log('index out')
    };
});
//repositorios
function getLS(key) {
    if (item = localStorage.getItem(key)) {
        ls = JSON.parse(item);
        console.log(ls)
    } else {
        console.log('falhou')
    }
}

function goToPage(event, address) {
    event.preventDefault();
    window.open(address, '_blank');
}

function buildPage(link) {
    const formattedDate = new Date(ls.repoData).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    let imgSrc = imgsRepos[ls.repoName]
    const content = `
        <header class="notON">
        <button class="btn" onclick="goToPage(event, '../../index.html' )">
            Inicio
        </button>
        <button class="btn" onclick="goToPage(event, '${ls.repoLink}')">
            Ver no github
        </button>
    </header>
    <main>

        <div class="container notON">

            <div id="c0" class="content">
                <img src="${imgsRepos[ls.repoName]}" alt="">
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
};

// Função assíncrona para buscar dados JSON
async function getJSOn() {
    try {
        const response = await fetch('http://localhost:3000/repos');

        if (!response.ok) {
            throw new Error('Erro ao buscar dados: ' + response.statusText);
        }
        const data = await response.json();

        let ls = []
        if(getLS('repo')){

            console.log('ls')
        }

        const repos = data;
        const repoValues = Object.values(repos).map(repo=>{
        }) 
        buildPage('/assets/images/portfolio.webp')



        } catch (error) {
            console.error(`Falha na requisição: ${error}`);
        }
    }

function imgJSON(link) {
        return `<img src="${link}" class="owner-img" style="width: 15%; height: auto; border-radius: 50%; margin-top: -5%;" alt="">`;
    }


    //index

    function returnPagesID() {
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
        if (content = document.getElementById('content-page1')) {
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
