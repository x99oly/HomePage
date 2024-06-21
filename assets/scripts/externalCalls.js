// solveds
const objects = [];
let vat = '0%';
// TOKEN GIT HUB X99OLY --- Var de ambiente
// novos
const apiGitHub = "https://api.github.com/users/";
const apiGitHubMe = "https://api.github.com/users/x99oly";

// Garantir que só tenha linguagens usadas por mim e não por alguma parte do programa usado
const mainTech = ["html5", "css3", "csharp", "nodejs", "javascript"]
const usedLanguages = {}; //linguagens que usei nos projetos
const languages = {}; // Links dos repostorios/languages
const repoDetails = [];

let gitAvatar = "";


//STARD CARDS
// Constroi, printa, anima os cards

function buildCards(obj) {

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }
    let name = obj.name;
    fillRepoDetails(obj)

    let truncatedTitle = truncateText(obj.name, 20);
    let truncatedDescription = truncateText(obj.description || '', 120);

    let cardHTML = `
        <div style="display: flex; justify-content: center; margin: 0 5px; background-color: transparent;">
        <a class="absolute-a" style="position: relative;" href="#" onclick="changePosition(event, '${obj.name}', '${obj.description}')">
                <div class="card pointer">
                    <div class="card-children pointer" style="top: -100%;">
                        <img src="assets/images/rosequartz.jpg" class="card-img" alt="">
                        <div class="card-info">
                    <ul class="card-icons" style="justify-content: flex-start !important; gap: 5px;">
                        ${generateLanguageIcons(obj)}
                    </ul>

                    <h4 name="${name}">${truncatedTitle}</h4>
                    <p class="card-description">
                        ${truncatedDescription}
                    </p>
                    <ul class="card-collaborators" style="display: flex; flex-direction: column;">
                        <li style="gap: 0px !important;">
                            <h6 style="color: var(--main);">Colaboradores</h6>
                        </li>
                        <li>
                            <img src="${gitAvatar}" class="owner-img"
                                style="width: 15%; height: auto; border-radius: 50%; margin-top: -5%;"
                                alt="">
                        </li>
                    </ul>

                    <div style="display: flex; flex-direction: row; align-items: center; gap: 20px">
                        <p>
                            <img class="logo"
                                style="max-width: 20px; background-color: var(--neutro-1); border-radius: 50%;"
                                src="assets/images/logos/repositorio-logo.png" alt="">
                            ${obj.forks_count}
                        </p>
                        <p>
                            <img class="logo"
                                style="max-width: 20px; background-color: var(--neutro-1); border-radius: 50%;"
                                src="assets/images/logos/hollywood-star.png" alt="">
                            ${obj.stargazers_count}
                        </p>
                    </div>

                    <p><strong>Data de Criação:</strong> ${new Date(obj.created_at).toLocaleDateString()}</p>

                    <p style="position: absolute; bottom: -100%; right: 70%;" class="hover">
                        <span class="btn-d" onclick="goToPage(event, 'assets/html/repositorio.html')"
                            style="width: 1000% !important; font-weight: 400;">
                            Saiba mais
                        </span>
                    </p>
                    <p style="position: absolute; bottom: -100%; right: 25%;" class="hover">
                        <span class="btn-d" onclick="goToPage(event, '${obj.html_url}')"
                            style="width: 1000% !important; font-weight: 400;">
                            On Github
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </a>
</div>

    `;
    objects.push(cardHTML);
}

function printCards() {
    const container = document.getElementById('right');
    container.innerHTML = '';

    objects.forEach((cardHTML) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML.trim();
        const cardElement = tempDiv.firstChild;

        // Adiciona a classe de fade-in
        cardElement.classList.add('fade-in');

        const cardChildren = cardElement.querySelector('.card-children');
        if (vat === '0%') {
            cardChildren.style.top = vat;
            vat = '-100%';
        } else {
            cardChildren.style.top = vat;
            vat = '0%';
        }

        container.appendChild(cardElement);

        setTimeout(() => {
            cardElement.classList.add('visible');
        }, 10);
    });
}

function moveLeft() {
    const lastCard = objects.pop();
    objects.unshift(lastCard);
    printCards();
}

function moveRight() {
    const firstCard = objects.shift();
    objects.push(firstCard);
    printCards();
}

function changePosition(event, nome, descricao) {
    event.preventDefault();
    const cardChildren = event.currentTarget.querySelector('.card-children');
    cardChildren.style.top = cardChildren.style.top === '0%' ? '-100%' : '0%';
    cardChildren.classList.add('blockChangePosition');

    setAboutProject(event, nome, descricao);
    console.log("setAboutProject()s foi chamada no final de chagePosition()")
}
//END CARDS

// Atribui a var dinâmicas do html valores
function setExternalLinks(db) {
    let gitLinks = document.querySelectorAll('.link-github');
    let avatarImages = document.querySelectorAll('.avatar-img');

    let gitMain = document.querySelector('.git-about-me');
    gitMain.innerHTML = `
        <span class="git-name">Olá, me chamo ${db.name},</span>
            ${db.bio} <br>
            <strong>Localização: </strong><span>${db.location}</span> <br>                  
<strong>site: </strong><a class="git-site hover" href="${db.blog}" target="_blank">${db.blog}</a>
            <span class="git-followers" href="#" > <br><br>
             <img class="logo" style="background-color: var(--neutro-1);" src="assets/images/logos/pessoas.png" alt="">
                            00
             </span>
    `;

    gitLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            goToPage(db.html_url);
        });
    });


    avatarImages.forEach(o => {
        o.src = gitAvatar;
    })
}
// Evento: seta os valores para a página repositório

function goToPage(event, address) {
    event.preventDefault();
    console.log('Address:', address);

    let card = event.currentTarget.closest('.card');
    let child = card.querySelector('h4');
    let childName = child.getAttribute('name');

    if (child) {
        repoDetails.forEach( o =>{
            if (o.repoName === childName){

                setRepositorio(o);
            }
        })

    } else {
        console.log('Child with tag h4 not found');
    }

    window.open(address, '_blank');
}

function setRepositorio(object) {
    let info = JSON.stringify(object);
    removeFromLS('repo');
    saveLS('repo', info); // Salva o objeto serializado no localStorage
    console.log(`Objeto convertido para string com sucesso: ${info}`);
}

// Local Storage (LS)

function openLS(name){
    return localStorage.getItem(name || []);
    console.log('LS: Lista atribuída com sucesso!') 
}

function removeFromLS(key){
    localStorage.removeItem(key);
    console.log('LS: item removido com sucesso!')
}

function saveLS(key, value){
    localStorage.setItem(key, value);
    console.log('LS: item salvo com sucesso!')
}

//Linguagem de prog no formato aceito devicons
function handleLanguageFormat(languageCode) {
    const languages = {
        "c#": "csharp",
        "c++": "cplusplus",
        "f#": "fsharp",
        "vb": "visualbasic",
        "Html": "html5",
        "Css": "css3",
        "": ""
    };

    if (languages.hasOwnProperty(languageCode)) {
        return languages[languageCode];
    } else {
        return languageCode;
    }
}
//Gera os ícones de linguagens devicons no card
function generateLanguageIcons(obj) {
    const languages = usedLanguages[obj.name.toLowerCase()];
    if (!languages) return '';

    return Object.keys(languages).map(language => {
        let l = handleLanguageFormat(language.toLowerCase());

        if (!mainTech.includes(l)) {
            l = ""
        }
        return `<li>
                    <i class="devicon-${l}-plain colored" style="font-size: 20px;"></i>
                </li>`;
    }).join('');
}
//Gera os ícones de linguagens devicons na aba contato
function printMainTechs() {

    let ulContainer = document.getElementById('mainTech');

    mainTech.forEach(o => {
        let logo = document.createElement('i');
        logo.innerHTML = `
            <i class="devicon-${o.toLowerCase()}-plain colored"></i>

        `
        ulContainer.appendChild(logo);
    });

}
//preenche o objeto lenguages com links para aba linguagens de cada repositório
function fillLanguagesLinks(obj) {
    languages[obj.name.toLowerCase()] = `https://api.github.com/repos/x99oly/${obj.name.toLowerCase()}/languages`
}

async function populateLanguages(obj) {
    fillLanguagesLinks(obj);
    const url = languages[obj.name.toLowerCase()];
    try {
        const response = await callApi(url); // Faz a chamada real à API do GitHub para obter as linguagens do repositório
        const formattedLanguages = {};

        Object.keys(response).forEach(language => {
            const formattedLanguage = handleLanguageFormat(language);
            formattedLanguages[formattedLanguage] = response[language];
        });

        usedLanguages[obj.name.toLowerCase()] = formattedLanguages;
    } catch (error) {
        console.error(`Erro ao buscar linguagens para ${obj.name}:`, error);
    }
}

// OUTRAS

function fillRepoDetails(data) {
    let repo = {
        repoName: data.name,
        repoDescription: data.description,
        repoData: data.updated_at,
        repoLanguage: data.language,
        repoLink: data.html_url,
        repoTopic: data.topics,
        repoFork: data.forks_count,
        repoStar: data.stargazers_count,
        repoImage: ""  // tratar isso depois
    };
    repoDetails.push(repo)


    console.log(repo);
}
function setAboutProject(event, nome, descricao) {
    event.preventDefault();

    let titulo = document.querySelector('.git-description h4');
    let description = document.querySelector('.git-description p');

    titulo.textContent = nome;
    description.textContent = descricao || '';
}

// APIs

// Funções assíncronas retornam promessas de dado, 'await' funciona como um 'if(dado){prossiga} / espera o retorno pra atribuir o dado

async function callApi(address) {
    try {
        const response = await fetch(address);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}


// CHAMADAS DE MÉTODOS AO CARREGAR A PÁGINA

document.addEventListener("DOMContentLoaded", async function () {
    const gitData = await callApi(apiGitHubMe);
    const gitDataRepos = await callApi(`${apiGitHubMe}/repos`);


    gitAvatar = gitData.avatar_url

    printMainTechs()

    if (gitData) {
        setExternalLinks(gitData);
    }
    if (gitDataRepos) {
        // Utilizando for...of para poder usar await dentro do loop
        for (let o of gitDataRepos) {
            fillLanguagesLinks(o);
            await populateLanguages(o);
            buildCards(o, gitData);
        }

        printCards();
    }
});


// CHAMADAS DE MÉTODOS AO REDIMENSIONAR A JANELA

window.addEventListener("resize", function () {
});


