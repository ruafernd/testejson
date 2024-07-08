const unidades = unidadesEmails.map(item => item.unidade);
let unidadeSelecionada = "";

function obterDominioEmail(unidade) {
    const unidadeEncontrada = unidadesEmails.find(item => item.unidade === unidade);
    return unidadeEncontrada ? unidadeEncontrada.email : "";
}

document.getElementById("unidadeInput").addEventListener("focus", function () {
    // Exibe as sugestões de unidade (defina a exibição das sugestões de acordo com sua estrutura HTML)
    document.getElementById("sugestoes").style.display = "block";
});

document.getElementById("usuario").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const usuario = document.getElementById("usuario").value.trim();
        const prefixo = document.getElementById("prefixo").value;
        const unidadeInput = document.getElementById("unidadeInput").value.trim();

        if (usuario && (prefixo || prefixo === "Nenhum") && unidadeSelecionada) {
            adicionarLogin();
        } else {
            alert("Preencha todos os campos antes de adicionar um login.");
        }
    }
});

document.body.addEventListener("click", function (event) {
    const sugestoes = document.getElementById("sugestoes");
    if (sugestoes.style.display === "block" && event.target !== unidadeInput) {
        sugestoes.style.display = "none";
    }
});

const unidadeInput = document.getElementById("unidadeInput");
unidadeInput.addEventListener("input", function () {
    const sugestoes = document.getElementById("sugestoes");
    sugestoes.innerHTML = ""; // Limpa as sugestões anteriores
    
    const textoInput = unidadeInput.value.toLowerCase().trim(); // Captura o texto digitado pelo usuário, removendo espaços em branco extras

    unidadesEmails.forEach(item => {
        const unidadeMinuscula = item.unidade.toLowerCase();
        const emailMinusculo = item.email.toLowerCase();
        const cnpjFormatado = item.cnpj ? item.cnpj.replace(/[./]/g, "") : ""; // Remove apenas os caracteres . e / do CNPJ para comparação
        const cnpj2Formatado = item.cnpj2 ? item.cnpj2.replace(/[./]/g, "") : "";

        // Verifica se o texto digitado está contido no nome da unidade, no email ou no CNPJ
        if (unidadeMinuscula.includes(textoInput) || emailMinusculo.includes(textoInput) || cnpjFormatado.includes(textoInput.replace(/[./]/g, "")) || cnpj2Formatado.includes(textoInput.replace(/[./]/g, "")) ) {
            const sugestao = document.createElement("div");
            sugestao.classList.add("sugestao");
            sugestao.textContent = `${item.unidade}`; // Define o texto da sugestão para incluir unidade, email e cnpj
            sugestao.addEventListener("click", function () {
                unidadeInput.value = item.unidade; // Preenche o campo de entrada com o nome da unidade
                sugestoes.innerHTML = ""; // Limpa as sugestões após a seleção
                selecionarUnidade(item.unidade); // Chama a função para selecionar a unidade
                limparListaUsuarios(); // Limpa a lista de usuários
            });
            sugestoes.appendChild(sugestao);
        }
    });

    sugestoes.style.display = sugestoes.childNodes.length > 0 ? "block" : "none"; // Exibe ou oculta as sugestões conforme necessário
});

const loginsDoutores = [];

function selecionarUnidade(unidade) {
    unidadeSelecionada = unidade;
    const emailInput = document.getElementById("email");
    const dominio = obterDominioEmail(unidadeSelecionada);
    emailInput.value = dominio;
    limparListaUsuarios();
    atualizarListaLogins();
}

function limparListaUsuarios() {
    loginsDoutores.length = 0;
    atualizarListaLogins();
}

// Função para adicionar logins a lista
function adicionarLogin() {
    const usuario = document.getElementById("usuario").value.trim(); 
    const prefixo = document.getElementById("prefixo").value;

    if (!usuario || (!prefixo && prefixo !== "Nenhum") || !unidadeSelecionada) {
        alert("Preencha todos os campos antes de adicionar um login.");
        return;
    }

    let nomeFormatado = "";

    if (prefixo !== "Nenhum") {
        nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(prefixo)} ${formatarNomePrimeiraLetraMaiuscula(usuario)}`;
    } else {
        nomeFormatado = `${formatarNomePrimeiraLetraMaiuscula(usuario)}`;
    }

    let partesNome = usuario.split(' ');
    let primeiroNome = partesNome[0].toLowerCase();
    let primeiraLetraSegundoNome = partesNome[partesNome.length - 1].toLowerCase().charAt(0);

    let emailDominio = obterDominioEmail(unidadeSelecionada);

    let emailFinal = "";

    if (prefixo !== "Nenhum") {
        emailFinal = `${prefixo.toLowerCase().replace('.', '')}${removerAcentos(primeiroNome)}${removerAcentos(primeiraLetraSegundoNome)}@${removerAcentos(emailDominio)}`;
    } else {
        emailFinal = `${removerAcentos(primeiroNome)}${removerAcentos(primeiraLetraSegundoNome)}@${removerAcentos(emailDominio)}`;
    }

    let senha = `${prefixo !== "Nenhum" ? prefixo.toLowerCase().replace('.', '') : ""}${removerAcentos(primeiroNome)}${removerAcentos(primeiraLetraSegundoNome)}`.toLowerCase();

    loginsDoutores.push({"Usuário": nomeFormatado, "Senha": senha, "Email": emailFinal});

    atualizarListaLogins();

    document.getElementById("usuario").value = "";
    document.getElementById("sugestoes").innerHTML = "";
}

// Função para excluir o último usuário cadastrado
function excluirUltimoLogin() {
    if (loginsDoutores.length === 0) {
        alert("Nenhum login para excluir.");
        return;
    }
    loginsDoutores.pop();
    atualizarListaLogins();
}

// Função para copiar lista e saída 
function copiarLista() {
    if (loginsDoutores.length === 0) {
        alert("Nenhum login foi adicionado ainda.");
        return;
    }

    let lista = "*---------------*\n";
    for (let login of loginsDoutores) {
        lista += `*Usuário: ${login['Usuário']}*\nEmail: ${login['Email']}\nSenha: ${login['Senha']}\n*---------------*\n`;
    }

    // Remover os últimos 25 caracteres (linhas de separação e um caractere extra)
    lista = lista.slice(0, -18);
    copyToClipboard(lista);
}

function copyToClipboard(text, iconElement) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    // Mudar ícone para "check"
    iconElement.textContent = "check";
    iconElement.classList.add("check-icon");
    
    // Voltar ao ícone original após 2 segundos
    setTimeout(() => {
        iconElement.textContent = "content_copy";
        iconElement.classList.remove("check-icon");
    }, 2000);
}

// Adicione as variáveis para o modal e seus elementos
const modal = document.getElementById("editModal");
const span = document.getElementsByClassName("close")[0];
const saveEditButton = document.getElementById("saveEdit");
let editIndex = -1;

// Função para abrir o modal e preencher os campos com os dados existentes
function editarLogin(index) {
    editIndex = index;
    const login = loginsDoutores[index];

    document.getElementById("editUsuario").value = login['Usuário'];
    document.getElementById("editEmail").value = login['Email'];
    document.getElementById("editSenha").value = login['Senha'];

    modal.style.display = "block";
}

// Quando o usuário clicar em (x), fecha o modal
span.onclick = function() {
    modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, fecha o modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Salvar alterações e atualizar a lista
saveEditButton.addEventListener("click", function() {
    if (editIndex !== -1) {
        const usuario = document.getElementById("editUsuario").value.trim();
        const email = document.getElementById("editEmail").value.trim();
        const senha = document.getElementById("editSenha").value.trim();

        loginsDoutores[editIndex]['Usuário'] = usuario;
        loginsDoutores[editIndex]['Email'] = email;
        loginsDoutores[editIndex]['Senha'] = senha;

        atualizarListaLogins();
        modal.style.display = "none";
    }
});

document.addEventListener("click", function(event) {
    const modal = document.getElementById("editModal");
    const modalContent = document.getElementById("modalContent");

    // Verifica se o clique foi fora do modal e não foi dentro do modalContent
    if (event.target !== modal && !modalContent.contains(event.target)) {
        modal.style.display = "none";
    }
});

// Quando o usuário clicar fora do modal, fecha o modal
window.onclick = function(event) {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        // Verifica se há seleção de texto ativa
        const selection = window.getSelection().toString().trim();
        if (!selection) {
            modal.style.display = "none";
        }
    }
}

function atualizarListaLogins() {
    const listaLogins = document.getElementById("listaLogins");
    listaLogins.innerHTML = "";

    for (let i = 0; i < loginsDoutores.length; i++) {
        let login = loginsDoutores[i];
        let loginItem = document.createElement("div");
        loginItem.classList.add("login-item");

        let usuarioInfo = document.createElement("div");
        usuarioInfo.textContent = `Usuário: ${login['Usuário']}`;

        let copyUsuarioIcon = document.createElement("span");
        copyUsuarioIcon.classList.add("material-icons");
        copyUsuarioIcon.classList.add("copy-icon");
        copyUsuarioIcon.textContent = "content_copy";
        copyUsuarioIcon.addEventListener("click", function() {
            copyToClipboard(login['Usuário'], copyUsuarioIcon);
        });

        let emailInfo = document.createElement("div");
        emailInfo.textContent = `Email: ${login['Email']}`;

        let copyEmailIcon = document.createElement("span");
        copyEmailIcon.classList.add("material-icons");
        copyEmailIcon.classList.add("copy-icon");
        copyEmailIcon.textContent = "content_copy";
        copyEmailIcon.addEventListener("click", function() {
            copyToClipboard(login['Email'], copyEmailIcon);
        });

        let senhaInfo = document.createElement("div");
        senhaInfo.textContent = `Senha: ${login['Senha']}`;

        let copySenhaIcon = document.createElement("span");
        copySenhaIcon.classList.add("material-icons");
        copySenhaIcon.classList.add("copy-icon");
        copySenhaIcon.textContent = "content_copy";
        copySenhaIcon.addEventListener("click", function() {
            copyToClipboard(login['Senha'], copySenhaIcon);
        });

        let actionsContainer = document.createElement("div");
        actionsContainer.classList.add("actions-container");

        let reloadIcon = document.createElement("span");
        reloadIcon.classList.add("material-icons");
        reloadIcon.classList.add("reload-icon");
        reloadIcon.textContent = "refresh";
        reloadIcon.addEventListener("click", function() {
            randomizeFirstLetterOfSurname(i);
        });

        let deleteButton = document.createElement("span");
        deleteButton.classList.add("material-icons");
        deleteButton.classList.add("delete-icon");
        deleteButton.textContent = "delete";
        deleteButton.style.color = "red";
        deleteButton.style.fontSize = "16px";
        deleteButton.addEventListener("click", function() {
            excluirLogin(i);
        });

        let editButton = document.createElement("span");
        editButton.classList.add("material-icons");
        editButton.classList.add("edit-icon");
        editButton.textContent = "edit";
        editButton.style.color = "blue";
        editButton.style.fontSize = "16px";
        editButton.addEventListener("click", function() {
            editarLogin(i);
        });

        
        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);
        actionsContainer.appendChild(reloadIcon);

        let userInfoContainer = document.createElement("div");
        userInfoContainer.classList.add("user-info-container");
        userInfoContainer.appendChild(usuarioInfo);
        userInfoContainer.appendChild(copyUsuarioIcon);

        let emailInfoContainer = document.createElement("div");
        emailInfoContainer.classList.add("user-info-container");
        emailInfoContainer.appendChild(emailInfo);
        emailInfoContainer.appendChild(copyEmailIcon);

        let senhaInfoContainer = document.createElement("div");
        senhaInfoContainer.classList.add("user-info-container");
        senhaInfoContainer.appendChild(senhaInfo);
        senhaInfoContainer.appendChild(copySenhaIcon);

        loginItem.appendChild(userInfoContainer);
        loginItem.appendChild(emailInfoContainer);
        loginItem.appendChild(senhaInfoContainer);
        loginItem.appendChild(actionsContainer);

        let linhaSeparacao = document.createElement("hr");
        listaLogins.appendChild(linhaSeparacao);

        listaLogins.appendChild(loginItem);
    }
}

function randomizeFirstLetterOfSurname(index) {
    let login = loginsDoutores[index];
    let email = login['Email'];
    let senha = login['Senha'];

    function randomizeChar(char) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        let randomChar;
        do {
            randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (randomChar === char);
        return randomChar;
    }

    function replaceFirstLetterOfSurname(email, senha) {
        let emailParts = email.split('@');
        let emailLocalPart = emailParts[0];
        let domain = emailParts[1];

        let randomChar = randomizeChar(emailLocalPart.slice(-1));
        
        let emailNew = emailLocalPart.slice(0, -1) + randomChar + '@' + domain;
        let senhaNew = senha.slice(0, -1) + randomChar;

        return { emailNew, senhaNew };
    }

    let newCredentials = replaceFirstLetterOfSurname(email, senha);

    login['Email'] = newCredentials.emailNew;
    login['Senha'] = newCredentials.senhaNew;

    atualizarListaLogins();
}

function randomizeFirstLetterOfSurname(index) {
    let login = loginsDoutores[index];
    let email = login['Email'];
    let senha = login['Senha'];

    function randomizeChar(char) {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        let randomChar;
        do {
            randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (randomChar === char);
        return randomChar;
    }

    function replaceFirstLetterOfSurname(email, senha) {
        let emailParts = email.split('@');
        let emailLocalPart = emailParts[0];
        let domain = emailParts[1];

        let randomChar = randomizeChar(emailLocalPart.slice(-1));
        
        let emailNew = emailLocalPart.slice(0, -1) + randomChar + '@' + domain;
        let senhaNew = senha.slice(0, -1) + randomChar;

        return { emailNew, senhaNew };
    }

    let newCredentials = replaceFirstLetterOfSurname(email, senha);

    login['Email'] = newCredentials.emailNew;
    login['Senha'] = newCredentials.senhaNew;

    atualizarListaLogins();
}


function excluirLogin(index) {
    loginsDoutores.splice(index, 1);
    atualizarListaLogins();
}



function excluirLogin(index) {
    loginsDoutores.splice(index, 1);
    atualizarListaLogins();
}

function formatarNomePrimeiraLetraMaiuscula(nome) {
    return nome.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function removerAcentos(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function limparUsuarios() {
    loginsDoutores.length = 0;
    atualizarListaLogins();
    unidadeSelecionada = "";
    document.getElementById("unidadeInput").value = "";
}


// Função para alternar entre modo noturno e diurno
function toggleNightMode() {
    document.body.classList.toggle('night-mode');
    const icon = document.getElementById('toggleMode');
    if (document.body.classList.contains('night-mode')) {
        icon.textContent = 'light_mode';
    } else {
        icon.textContent = 'dark_mode';
    }
}
