// =====================================================
// CONFIGURAÇÕES
// =====================================================

const API_URL = "http://localhost:3000";


// =====================================================
// AUTENTICAÇÃO
// =====================================================

const token = localStorage.getItem("token");

if (!token) {

    alert("Você precisa fazer login.");

    window.location.href = "/admin/login.html";

}


// =====================================================
// ELEMENTOS DA TELA
// =====================================================

const form = document.getElementById("productForm");

const productId = document.getElementById("productId");

const nameInput = document.getElementById("name");

const categoryInput = document.getElementById("category");

const priceInput = document.getElementById("price");

const descriptionInput = document.getElementById("description");

const imageInput = document.getElementById("image");

const saveButton = document.getElementById("saveButton");

const productsTable = document.getElementById("productsTable");


// =====================================================
// VARIÁVEIS
// =====================================================

let produtos = [];

let editando = false;


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarProdutos();

    form.addEventListener(
        "submit",
        salvarProduto
    );

});


// =====================================================
// CARREGAR PRODUTOS
// =====================================================

async function carregarProdutos() {

    try {

        const resposta = await fetch(
            `${API_URL}/produtos`
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar produtos."
            );

        }

        produtos = await resposta.json();

        renderizarProdutos();

    }

    catch (erro) {

        console.error(erro);

        alert(
            "Não foi possível carregar os produtos."
        );

    }

}


// =====================================================
// RENDERIZAR PRODUTOS
// =====================================================

function renderizarProdutos() {

    productsTable.innerHTML = "";

    produtos.forEach(produto => {

        const linha = document.createElement("tr");

        linha.innerHTML = `

            <td>

                ${
                    produto.imagem

                    ?

                    `<img
                        src="${API_URL}/uploads/${produto.imagem}"
                        width="70"
                    >`

                    :

                    "Sem imagem"

                }

            </td>

            <td>

                ${produto.nome}

            </td>

            <td>

                ${produto.categoria || ""}

            </td>

            <td>

                R$ ${Number(produto.preco).toFixed(2)}

            </td>

            <td>

                <button
                    onclick="editarProduto(${produto.id})"
                >

                    Editar

                </button>

                <button
                    onclick="excluirProduto(${produto.id})"
                >

                    Excluir

                </button>

            </td>

        `;

        productsTable.appendChild(linha);

    });

}
// =====================================================
// SALVAR PRODUTO
// =====================================================

async function salvarProduto(event) {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "nome",
        nameInput.value.trim()
    );

    formData.append(
        "categoria",
        categoryInput.value.trim()
    );

    formData.append(
        "preco",
        priceInput.value
    );

    formData.append(
        "descricao",
        descriptionInput.value.trim()
    );

    const imagem = imageInput.files[0];

    if (imagem) {

        formData.append(
            "imagem",
            imagem
        );

    }

    let url = `${API_URL}/produtos`;
    let metodo = "POST";

    if (editando) {

        metodo = "PUT";

        url = `${API_URL}/produtos/${productId.value}`;

        // Mantém a imagem antiga caso nenhuma nova seja enviada
        if (!imagem) {

            const produtoAtual = produtos.find(
                p => p.id == productId.value
            );

            if (produtoAtual) {

                formData.append(
                    "imagem",
                    produtoAtual.imagem || ""
                );

            }

        }

    }

    try {

   const resposta = verificarResposta(

    await fetch(url, {

        method: metodo,

        headers: {

            Authorization: `Bearer ${token}`

        },

        body: formData

    })

);

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.erro ||
                dados.mensagem ||
                "Erro ao salvar produto."
            );

        }

        alert(dados.mensagem);

        limparFormulario();

        await carregarProdutos();

    }

    catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}
// =====================================================
// EDITAR PRODUTO
// =====================================================

function editarProduto(id) {

    const produto = produtos.find(p => p.id == id);

    if (!produto) {

        alert("Produto não encontrado.");

        return;

    }

    editando = true;

    productId.value = produto.id;

    nameInput.value = produto.nome;

    categoryInput.value = produto.categoria || "";

    priceInput.value = produto.preco;

    descriptionInput.value = produto.descricao || "";

    // Limpa o input de arquivo.
    // O navegador não permite preencher
    // automaticamente um input file.

    imageInput.value = "";

    saveButton.textContent = "Atualizar Produto";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// EXCLUIR PRODUTO
// =====================================================

async function excluirProduto(id) {

    const confirmar = confirm(

        "Deseja realmente excluir este produto?"

    );

    if (!confirmar) {

        return;

    }

    try {

     const resposta = verificarResposta(

    await fetch(

        `${API_URL}/produtos/${id}`,

        {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

         )

    );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(

                dados.erro ||

                dados.mensagem ||

                "Erro ao excluir produto."

            );

        }

        alert(dados.mensagem);

        await carregarProdutos();

    }

    catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}

// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================

function limparFormulario() {

    form.reset();

    productId.value = "";

    imageInput.value = "";

    editando = false;

    saveButton.textContent = "Salvar Produto";

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    const sair = confirm("Deseja realmente sair?");

    if (!sair) {

        return;

    }

    localStorage.removeItem("token");

    window.location.href = "/admin/login.html";

}


// =====================================================
// VERIFICAR TOKEN
// =====================================================

async function verificarAutenticacao() {

    try {

     const resposta = verificarResposta(
    await fetch(
        `${API_URL}/produtos`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
);

        if (resposta.status === 401) {

            throw new Error("Token expirado");

        }

    }

    catch (erro) {

        alert("Sua sessão expirou.");

        localStorage.removeItem("token");

        window.location.href = "/admin/login.html";

    }

}

function verificarResposta(resposta) {

    if (resposta.status === 401) {

        alert("Sua sessão expirou.");

        localStorage.removeItem("token");

        window.location.href = "/admin/login.html";

        throw new Error("Token expirado");

    }

    return resposta;

}