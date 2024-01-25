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
    sugestoes.innerHTML = "";

    
    const textoInput = unidadeInput.value.toLowerCase();
    for (const unidade of unidades) {
        const unidadeMinuscula = unidade.toLowerCase();
        if (unidadeMinuscula.includes(textoInput)) {
            const sugestao = document.createElement("div");
            sugestao.classList.add("sugestao");
            sugestao.textContent = unidade;
            sugestao.addEventListener("click", function () {
                unidadeInput.value = unidade;
                sugestoes.innerHTML = "";
                selecionarUnidade(unidade);
                limparListaUsuarios();
            });
            sugestoes.appendChild(sugestao);
        }
    }
    sugestoes.style.display = sugestoes.childNodes.length > 0 ? "block" : "none";
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

function adicionarLogin() {
    const usuario = document.getElementById("usuario").value;
    const prefixo = document.getElementById("prefixo").value;

    if (!usuario || (!prefixo && prefixo !== "Nenhum") || !unidadeSelecionada) {
        alert("Preencha todos os campos antes de adicionar um login.");
        return;
    }

    let nomeFormatado = "";

    if (prefixo !== "Nenhum") {
        nomeFormatado = `*Usuário: ${formatarNomePrimeiraLetraMaiuscula(prefixo)} ${formatarNomePrimeiraLetraMaiuscula(usuario)}*`;
    } else {
        nomeFormatado = `*Usuário: ${formatarNomePrimeiraLetraMaiuscula(usuario)}*`;
    }

    let partesNome = usuario.split(' ');
    let primeiroNome = partesNome[0].toLowerCase();
    let primeiraLetraSegundoNome = partesNome[partesNome.length - 1].toLowerCase().charAt(0);

    let emailDominio = obterDominioEmail(unidadeSelecionada);

    let emailFinal = "";

    if (prefixo !== "Nenhum") {
        emailFinal = `${prefixo.toLowerCase().replace('.', '')}${removerAcentos(primeiroNome)}${primeiraLetraSegundoNome}@${removerAcentos(emailDominio)}`;
    } else {
        emailFinal = `${removerAcentos(primeiroNome)}${primeiraLetraSegundoNome}@${removerAcentos(emailDominio)}`;
    }

    let senha = `${prefixo !== "Nenhum" ? prefixo.toLowerCase().replace('.', '') : ""}${removerAcentos(primeiroNome)}${primeiraLetraSegundoNome}`.toLowerCase();

    loginsDoutores.push({"Usuário": nomeFormatado, "Senha": senha, "Email": emailFinal});

    atualizarListaLogins();

    document.getElementById("usuario").value = "";
    document.getElementById("unidadeInput").value = "";
    document.getElementById("sugestoes").innerHTML = "";
}

function excluirUltimoLogin() {
    if (loginsDoutores.length === 0) {
        alert("Nenhum login para excluir.");
        return;
    }
    loginsDoutores.pop();
    atualizarListaLogins();
}

function copiarLista() {
    if (loginsDoutores.length === 0) {
        alert("Nenhum login foi adicionado ainda.");
        return;
    }

    let lista = "";
    for (let login of loginsDoutores) {
        lista += `${login['Usuário']}\nEmail: ${login['Email']}\nSenha: ${login['Senha']}\n\n`;
    }

    lista = lista.slice(0, -2);
    copyToClipboard(lista);
}

function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Lista de logins copiada para a área de transferência.');
}

function criarBlocoNotas() {
    if (loginsDoutores.length === 0) {
        alert("Nenhum login foi adicionado ainda.");
        return;
    }

    let lista = "";
    for (let login of loginsDoutores) {
        lista += `${login['Usuário']}\nEmail: ${login['Email']}\nSenha: ${login['Senha']}\n\n`;
    }

    lista = lista.slice(0, -2);
    downloadFile("Logins.txt", lista);
}


function atualizarListaLogins() {
    const listaLogins = document.getElementById("listaLogins");
    listaLogins.innerHTML = "";

    for (let login of loginsDoutores) {
        let loginItem = document.createElement("div");
        loginItem.classList.add("login-item");
        loginItem.innerHTML = `${login['Usuário']}<br>Email: ${login['Email']}<br>Senha: ${login['Senha']}<br>`;
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