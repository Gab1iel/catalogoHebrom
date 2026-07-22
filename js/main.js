const API_URL = "http://localhost:3000";


const productsGrid = document.getElementById(
    "productsGrid"
);

const searchInput = document.querySelector(".search-box input");

let todosProdutos = [];

let categoriaSelecionada = "Todos";

const botoesCategoria = document.querySelectorAll(".categorias button");

async function carregarProdutos() {

    try {

        const resposta = await fetch(`${API_URL}/produtos`);

        const produtos = await resposta.json();

        todosProdutos = produtos;

        renderizarProdutos(todosProdutos);

    } catch (erro) {

        console.error(
            "Erro ao buscar produtos:",
            erro
        );

    }

}

function pesquisarProdutos() {

    const texto = searchInput.value.toLowerCase().trim();

    const produtosFiltrados = todosProdutos.filter(produto => {

        const nome = produto.nome.toLowerCase();
        const descricao = (produto.descricao || "").toLowerCase();

        const correspondeBusca =
            nome.includes(texto) ||
            descricao.includes(texto);

        const correspondeCategoria =
            categoriaSelecionada === "Todos" ||
            produto.categoria === categoriaSelecionada;

        return correspondeBusca && correspondeCategoria;

    });

    renderizarProdutos(produtosFiltrados);

}



function renderizarProdutos(produtos) {


    productsGrid.innerHTML = "";


    produtos.forEach(produto => {


        const card = document.createElement(
            "article"
        );


        card.classList.add(
            "products-card"
        );



        card.innerHTML = `

            <div class="product-imagem">

                ${
                    produto.imagem

                    ?

                    `
                    <img 
                    src="${API_URL}/uploads/${produto.imagem}"
                    alt="${produto.nome}"
                    >
                    `

                    :

                    `
                    <p>
                    Sem imagem
                    </p>
                    `

                }

            </div>



            <div class="product-info">


                <h2>
                    ${produto.nome}
                </h2>



                <p>
                    ${produto.descricao ?? ""}
                </p>



                <strong>
                    R$ ${Number(produto.preco).toFixed(2)}
                </strong>



                <button>
                    Adicionar
                </button>


            </div>

        `;



        productsGrid.appendChild(card);


    });


}

   botoesCategoria.forEach(botao => {

    botao.addEventListener("click", () => {

        categoriaSelecionada = botao.textContent.trim();

        botoesCategoria.forEach(b => {
            b.classList.remove("active");
        });

        botao.classList.add("active");

        pesquisarProdutos();

    });

});

searchInput.addEventListener(
    "input",
    pesquisarProdutos
);

document.addEventListener(
    "DOMContentLoaded",
    carregarProdutos
);