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
}ListaUsuarios();


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
    document.getElementById("unidadeInput").value = "";
    document.getElementById("sugestoes").innerHTML = "";
}

// Função para excluir o Último usuário cadastrado
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

    let lista = "---------------\n";
    for (let login of loginsDoutores) {
        lista += `Usuário: *${login['Usuário']}*\nEmail: ${login['Email']}\nSenha: ${login['Senha']}\n---------------\n`;
    }

    // Remover os últimos 25 caracteres (linhas de separação e um caractere extra)
    lista = lista.slice(0, -16);
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


function atualizarListaLogins() {
    const listaLogins = document.getElementById("listaLogins");
    listaLogins.innerHTML = "";

    for (let login of loginsDoutores) {
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

        // Adiciona a linha de separação
        let linhaSeparacao = document.createElement("hr");
        listaLogins.appendChild(linhaSeparacao);

        listaLogins.appendChild(loginItem);
    }
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