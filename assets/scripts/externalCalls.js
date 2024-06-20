// solveds
const objects = [];
let vat = '0%';
// TOKEN GIT HUB X99OLY --- Var de ambiente
let token = "";
// novos
const apiGitHub = "https://api.github.com/users/";
const apiGitHubMe = "https://api.github.com/users/x99oly";

// Garantir que só tenha linguagens usadas por mim e não por alguma parte do programa usado
const mainTech = ["html5", "css3", "csharp", "nodejs", "javascript"]
const usedLanguages = {}; //linguagens que usei nos projetos
const languages = {}; // Links dos repostorios/languages


function buildCards(obj) {
    let cardHTML = `
        <div style="display: flex; justify-content: center;">
            <a class="absolute-a" style="position: relative;" href="#" onclick="changePosition(event)">
                <div class="card pointer">
                    <div class="card-children pointer" style="top: -100%;">
                        <img src="assets/images/rosequartz.jpg" class="card-img" alt="">
                        <div class="card-info">
                            <ul class="card-icons" style="justify-content: flex-start !important; gap: 5px;">
                                ${generateLanguageIcons(obj)}
                            </ul>
                            <h4>${obj.name}</h4>
                            <p class="card-description">
                                ${obj.description || ''}
                            </p>
                            <ul class="card-collaborators" style="display: flex; flex-direction: column;">
                                <li>
                                    <h6 style="color: var(--main);">Colaboradores</h6>
                                </li>
                                <li><img src="assets/images/me-perfil.jpg" class="collaborator-img"
                                        style="width: 15%; height: auto; border-radius: 50%;" alt=""></li>
                            </ul>
                            <p style="position: absolute; bottom: -100%; right: 40%;" class="hover">
                                <span class="btn-d" onclick="goToPage('/dbsitorio.html')" style="width: 1000% !important; font-weight: 400;">
                                    Saiba mais
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
        }, 70);
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

function setExternalLinks(db) {
    let gitLinks = document.querySelectorAll('.link-github');
    let avatarImages = document.querySelectorAll('.avatar-img')

    gitLinks.forEach(o => {
        o.href = db.html_url
    })

    avatarImages.forEach(o => {
        o.src = db.avatar_url;
    })
}
function printMainTechs() {
    const mainTech = ["html5", "css3", "csharp", "nodejs"]

    const ulContainer = document.getElementById('mainTech');
    const avatarImage = document.getElementById('')

    mainTech.forEach(o => {
        let logo = document.createElement('i');
        logo.innerHTML = `
            <i class="devicon-${o.toLowerCase()}-plain colored"></i>

        `
        ulContainer.appendChild(logo);
    });

}

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

// APIs

// Funções assíncronas retornam promessas de dado, 'await' funciona como um 'if(dado){prossiga} / espera o retorno pra atribuir o dado

async function fetchToken() {
    try {
        const response = await fetch('config.json');
        const data = await response.json();
        return data.gitToken;
    } catch (error){
        console.log('Não foi possível acessar i.json', error);
    }
}

async function callApi(address) {
    try {
        const response = await fetch(address, {
            headers: {
                'Authorization': `token ${token}`,
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}


// CHAMADAS DE MÉTODOS AO CARREGAR A PÁGINA

document.addEventListener("DOMContentLoaded", async function () {
    token = await fetchToken();
    const gitData = await callApi(apiGitHubMe);
    const gitDataRepos = await callApi(`${apiGitHubMe}/repos`);

    if (gitData) {
        setExternalLinks(gitData);
    }
    if (gitDataRepos) {
        // Utilizando for...of para poder usar await dentro do loop
        for (let o of gitDataRepos) {
            fillLanguagesLinks(o);
            await populateLanguages(o);
            buildCards(o);
        }

        printCards();
    }
});


// CHAMADAS DE MÉTODOS AO REDIMENSIONAR A JANELA

window.addEventListener("resize", function () {
});