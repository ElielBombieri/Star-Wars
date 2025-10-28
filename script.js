async function excluirLog(id) {
    let url = `https://www.piway.com.br/unoesc/api/excluir/log/${id}/aluno/425181`
    let resposta = await fetch(url);    
}

async function consultarLogs() {
    let url = `https://www.piway.com.br/unoesc/api/logs/425181`
    let resposta = await fetch(url);
    let dadosLogs = await resposta.json();

    let tagID = document.getElementById("Logs");
    tagID.innerHTML = "";
    let childs = '';

    childs += "CONSULTA DE LOGS - Para excluir clique em cima de algum dos logs.";
    for (let logs in dadosLogs) {
        childs += `
        <li class="list-group-item list-group-item-action" onclick="excluirLog(${dadosLogs[logs]['id']})">
           Id: ${dadosLogs[logs]['id']} <br>
           Horário: ${dadosLogs[logs]['desclog']} <br>
           API: ${dadosLogs[logs]['descapi']} <br>
           Método: ${dadosLogs[logs]['descmetodo']} <br>
           Resultado: ${dadosLogs[logs]['descresultado']} <br>
        </li>`;
    }


    tagID.innerHTML = childs;
}


async function inserirLogs(metodo, resultado) {
    let url = `https://www.piway.com.br/unoesc/api/inserir/log/425181/swapi.dev/${metodo}/${resultado}`
    let resposta = await fetch(url);

}



async function buscarCategorias() {

    let url = "https://swapi.dev/api/";
    let resposta = await fetch(url);
    let dadosCategorias = await resposta.json();
    let tagID = document.getElementById("ulCategorias");
    let childs = '';
    
    for (let categoria in dadosCategorias) {
        inserirLogs("buscarCategorias", categoria);
        childs += `
        <li class="list-group-item list-group-item-action"
        onclick="buscarItens('${categoria}', '${dadosCategorias[categoria]}')">
        ${categoria.toUpperCase()}
        </li>
        `;
    }

    tagID.innerHTML = childs;
}

async function buscarItens(categoria, url) {

    let resposta = await fetch(url);
    let dados = await resposta.json();
    let divCards = document.getElementById("divCards");
    let cards = '';

    let lista = dados.results ? dados.results : [dados];

    for (let i = 0; i < lista.length; i++) {
        let item = lista[i];
        let nome = item.name || item.title || "Desconhecido";

        cards += `
            <div class="col-lg-4 col-md-6 mb-3">
                <div class="card h-100" onclick="abrirDetalhes('${categoria}', '${nome.replace(/'/g, "\\'")}', '${item.url}')">
                    <div class="card-body">
                        <h5 class="card-title">${nome}</h5>
                    </div>
                </div>
            </div>
        `;
        inserirLogs("buscarItens", nome);
    }

    divCards.innerHTML = cards;
}

async function abrirDetalhes(categoria, nome, url) {
    let resposta = await fetch(url);
    let dados = await resposta.json();

    let detalhes = '';
    for (let chave in dados) {
        if (typeof dados[chave] === 'string' && !dados[chave].includes("http")) {
            detalhes += `<p><strong>${chave}:</strong> ${dados[chave]}</p>`;
            inserirLogs("buscarItens", chave);
            inserirLogs("buscarItens", dados[chave]);
        }
    }

    document.getElementById("divCards").innerHTML = `
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <h4>${nome}</h4>
                    ${detalhes}
                    <button class="btn btn-secondary mt-3" onclick="buscarItens('${categoria}', 'https://swapi.dev/api/${categoria}/')">Voltar</button>
                </div>
            </div>
        </div>
    `;
    inserirLogs("buscarItens", nome);
    inserirLogs("buscarItens", categoria);
}
