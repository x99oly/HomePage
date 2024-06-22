const objects = [];
let vat = '0%';
const mainTech = ["html5", "css3", "csharp", "nodejs", "javascript"];
const usedLanguages = {};
const languages = {};
const repoDetails = [];
const avatarURL = [];

const token = ""; // APAGA ANTES DO PUSH
const headers = "";

// Initialize the application
document.addEventListener("DOMContentLoaded", async function () {
    try {
        await fetchGitHubData();
        await fetchRepos();
        await fetchJSONServerData();
        printMainTechs();
    } catch (error) {
        console.error(`Initialization failed: ${error}`);
    }
});

// Fetch data from GitHub API
async function fetchGitHubData() {
    const apiGitHubMe = "https://api.github.com/users/x99oly";

    try {
        const response = await fetch(apiGitHubMe, { headers });
        if (!response.ok) throw new Error(`Failed to fetch GitHub data. Error: ${response.statusText}`);

        const data = await response.json();
        setExternalLinks(data);
        gitAvatar = data.avatar_url;

    } catch (error) {
        console.error(`fetchGitHubData failed: ${error}`);
    }
}

// Fetch repositories from GitHub API
async function fetchRepos() {
    const apiGitHubMe = "https://api.github.com/users/x99oly";

    try {
        const response = await fetch(`${apiGitHubMe}/repos`, { headers });
        if (!response.ok) throw new Error(`Failed to fetch repositories. Error: ${response.statusText}`);

        const data = await response.json();
        for (let repo of data) {
            await populateLanguages(repo);
            fillRepoDetails(repo);

            // Obtém os dados dos colaboradores
            const { repoName, contributors } = await fetchReposContributors(repo.name);

            // Constrói o card passando os dados do repositório e dos colaboradores
            buildCards(repo, contributors);
        }

        printCards(); // Após construir todos os cards, imprime na interface
    } catch (error) {
        console.error(`fetchRepos failed: ${error}`);
    }
}

// Fetch contributors of repositories from GitHub API
async function fetchReposContributors(repoName) {
    const address = `https://api.github.com/repos/x99oly/${repoName}/collaborators`;

    try {
        const response = await fetch(address, { headers });
        if (!response.ok) throw new Error(`Failed to fetch contributors. Error: ${response.statusText}`);

        const data = await response.json();

        // Retorna um objeto contendo o nome do repositório e os dados dos colaboradores
        return { repoName, contributors: data };
    } catch (error) {
        console.error(`fetchReposContributors failed: ${error}`);
        return { repoName, contributors: [] }; // Retorna array vazio em caso de erro
    }
}

// Fetch data from JSON Server
async function fetchJSONServerData() {
    try {
        const response = await fetch('http://localhost:3000/coworkers/');
        if (!response.ok) throw new Error(`Failed to fetch JSON Server data. Error: ${response.statusText}`);

        const data = await response.json();
        avatarURL.push(...data.map(item => item.url));
    } catch (error) {
        console.error(`fetchJSONServerData failed: ${error}`);
    }
}

// Build cards for repositories 

function buildCards(repo, contributors) {
    const truncatedTitle = truncateText(repo.name, 20);
    const truncatedDescription = truncateText(repo.description || '', 120);

    // Monta o HTML do card
    const cardHTML = `
        <div style="display: flex; justify-content: center; margin: 0 5px; background-color: transparent;">
            <a class="absolute-a" style="position: relative;" href="#" onclick="changePosition(event, '${repo.name}', '${repo.description}')">
                <div class="card pointer">
                    <div class="card-children pointer" style="top: -100%;">
                        <img src="assets/images/rosequartz.jpg" class="card-img" alt="">
                        <div class="card-info">
                            <ul class="card-icons" style="justify-content: flex-start !important; gap: 5px;">
                                ${generateLanguageIcons(repo)}
                            </ul>
                            <h4 name="${repo.name}">${truncatedTitle}</h4>
                            <p class="card-description">${truncatedDescription}</p>
                            <ul class="card-collaborators" style="display: flex; flex-direction: column;">
                                <li style="gap: 0px !important;">
                                    <h6 style="color: var(--main);">Colaboradores</h6>
                                </li>
                                <li id="liID" class="git-coworkers">
                                    ${generateContributorImages(contributors)}
                                </li>
                            </ul>
                            <div style="display: flex; flex-direction: row; align-items: center; gap: 20px">
                                <p><img class="logo" style="max-width: 20px; background-color: var(--neutro-1); border-radius: 50%;" src="assets/images/logos/repositorio-logo.png" alt="">${repo.forks_count}</p>
                                <p><img class="logo" style="max-width: 20px; background-color: var(--neutro-1); border-radius: 50%;" src="assets/images/logos/hollywood-star.png" alt="">${repo.stargazers_count}</p>
                            </div>
                            <p><strong>Data de Criação:</strong> ${new Date(repo.created_at).toLocaleDateString()}</p>
                            <p style="position: absolute; bottom: -100%; right: 70%;" class="hover">
                                <span class="btn-d" onclick="goToPage(event, 'assets/html/repositorio.html')" style="width: 1000% !important; font-weight: 400;">Saiba mais</span>
                            </p>
                            <p style="position: absolute; bottom: -100%; right: 25%;" class="hover">
                                <span class="btn-d" onclick="goToPage(event, '${repo.html_url}')" style="width: 1000% !important; font-weight: 400;">On Github</span>
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;

    objects.push(cardHTML);
}

// Função para gerar as imagens dos colaboradores
function generateContributorImages(contributors) {
    if (!contributors || contributors.length === 0) return '';

    return contributors.map(contributor => `
        <img src="${contributor.avatar_url}" class="owner-img"
            style="width: 15%; height: auto; border-radius: 50%; margin-top: -5%;"
            alt="">
    `).join('');
}

// Print cards to the DOM 
function printCards() {
    const container = document.getElementById('right');
    container.innerHTML = '';

    objects.forEach(cardHTML => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML.trim();
        const cardElement = tempDiv.firstChild;
        cardElement.classList.add('fade-in');

        const cardChildren = cardElement.querySelector('.card-children');
        cardChildren.style.top = vat;
        vat = vat === '0%' ? '-100%' : '0%';

        container.appendChild(cardElement);
        setTimeout(() => cardElement.classList.add('visible'), 10);
    });
}

// Print img of contributors
function returnImgContributor(imgLink){
        let i = document.createElement('img')
        i.innerHTML = `
            <img src="${imgLink}" class="owner-img" style="width: 15%; height: auto; border-radius: 50%; margin-top: -5%;" alt="">
        `
        return i;
}

// Change position of card content
function changePosition(event, name, description) {
    event.preventDefault();
    const cardChildren = event.currentTarget.querySelector('.card-children');
    cardChildren.style.top = cardChildren.style.top === '0%' ? '-100%' : '0%';
    cardChildren.classList.add('blockChangePosition');

    setAboutProject(name, description);
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

// Set external links and user information
function setExternalLinks(data) {
    const gitMain = document.querySelector('.git-about-me');
    gitMain.innerHTML = `
        <span class="git-name">Olá, me chamo ${data.name},</span>
        ${data.bio} <br>
        <strong>Localização: </strong><span>${data.location}</span> <br>
        <strong>Site: </strong><a class="git-site hover" href="${data.blog}" target="_blank">${data.blog}</a>
        <span class="git-followers"><br><br>
            <img class="logo" style="background-color: var(--neutro-1);" src="assets/images/logos/pessoas.png" alt="">
            ${data.followers}
        </span>
    `;
    document.querySelectorAll('.link-github').forEach(link => {
        link.addEventListener('click', event => goToPage(event, data.html_url));
    });
    document.querySelectorAll('.avatar-img').forEach(img => {
        img.src = data.avatar_url;
    });
}

// Navigate to a specific page
function goToPage(event, address) {
    event.preventDefault();
    window.open(address, '_blank');

    const card = event.currentTarget.closest('.card');
    const child = card.querySelector('h4');
    const childName = child.getAttribute('name');

    repoDetails.forEach(repo => {
        if (repo.repoName === childName) setRepositorio(repo);
    });
}

// Set repository details in local storage
function setRepositorio(repo) {
    const info = JSON.stringify(repo);
    localStorage.setItem('repo', info);
    //console.log(`Objeto convertido para string com sucesso: ${info}`);
}

// fill repository details
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
    repoDetails.push(repo);

    // console.log(repo);
}

// Populate languages used in a repository
async function populateLanguages(repo) {
    const url = `https://api.github.com/repos/x99oly/${repo.name.toLowerCase()}/languages`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        if (!response.ok) throw new Error(`Failed to fetch languages for ${repo.name}. Error: ${response.statusText}`);

        const data = await response.json();
        const formattedLanguages = {};
        for (let [language, value] of Object.entries(data)) {
            const formattedLanguage = handleLanguageFormat(language);
            formattedLanguages[formattedLanguage] = value;
        }
        usedLanguages[repo.name.toLowerCase()] = formattedLanguages;
    } catch (error) {
        console.error(`populateLanguages failed for ${repo.name}: ${error}`);
    }
}

// Handle language format for DevIcons
function handleLanguageFormat(languageCode) {
    const languages = {
        "c#": "csharp",
        "c++": "cplusplus",
        "f#": "fsharp",
        "vb": "visualbasic",
        "html": "html5",
        "css": "css3",
        "": ""
    };
    return languages[languageCode.toLowerCase()] || languageCode;
}

// Generate language icons for cards
function generateLanguageIcons(repo) {
    const languages = usedLanguages[repo.name.toLowerCase()];
    if (!languages) return '';

    return Object.keys(languages).map(language => {
        const lang = handleLanguageFormat(language);
        return mainTech.includes(lang) ? `<li><i class="devicon-${lang}-plain colored" style="font-size: 20px;"></i></li>` : '';
    }).join('');
}

// Print main technologies
function printMainTechs() {
    const ulContainer = document.getElementById('mainTech');
    mainTech.forEach(tech => {
        const logo = document.createElement('i');
        logo.innerHTML = `<i class="devicon-${tech}-plain colored"></i>`;
        ulContainer.appendChild(logo);
    });
}

// Set project details in the "about project" section
function setAboutProject(name, description) {
    const title = document.querySelector('.git-description h4');
    const desc = document.querySelector('.git-description p');
    title.textContent = name;
    desc.textContent = description || '';
}

// Helper to truncate text
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

// Fetch JSON data
async function getJSOn(data) {
    if (data) {
        data.forEach(item => avatarURL.push(item.url));
        console.log(avatarURL);
    }
}

function imgJSON(link) {
    return `<img src="${link}" class="owner-img" style="width: 15%; height: auto; border-radius: 50%; margin-top: -5%;" alt="">`;
}
