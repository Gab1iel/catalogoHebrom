const API_URL = "http://localhost:3000";


const productsGrid = document.getElementById(
    "productsGrid"
);

const searchInput = document.querySelector(".search-box input");

let todosProdutos = [];

let categoriaSelecionada = "Todos";

const botoesCategoria = document.querySelectorAll(".categorias button");

const cartButton = document.querySelector(".cart-button");

const cartModal = document.getElementById("cartModal");

const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const cartCounter = document.querySelector(".cart span");

const checkoutButton = document.getElementById("checkoutButton");

const checkoutForm = document.getElementById("checkoutForm");

const confirmarPedido = document.getElementById("confirmarPedido");

const menuButton = document.getElementById("menuButton");

const sideMenu = document.getElementById("sideMenu");

const menuOverlay = document.getElementById("menuOverlay");

const closeMenu = document.getElementById("closeMenu");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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

             <button class="add-cart" data-id="${produto.id}">
                Adicionar
             </button>


            </div>

        `;



        productsGrid.appendChild(card);

        const botaoAdicionar = card.querySelector(".add-cart");

        botaoAdicionar.addEventListener("click", () => {

            adicionarAoCarrinho(produto);

     });


    });


}

        function adicionarAoCarrinho(produto) {

    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({

            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            imagem: produto.imagem,
            quantidade: 1

        });

    }

    salvarCarrinho();

    atualizarCarrinho();

}

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}

function aumentarQuantidade(id) {

    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    item.quantidade++;

    salvarCarrinho();

    atualizarCarrinho();

}

function diminuirQuantidade(id) {

    const item = carrinho.find(produto => produto.id === id);

    if (!item) return;

    item.quantidade--;

    if (item.quantidade <= 0) {

        carrinho = carrinho.filter(produto => produto.id !== id);

    }

    salvarCarrinho();

    atualizarCarrinho();

}

function atualizarCarrinho() {

    cartItems.innerHTML = "";

    if (carrinho.length === 0) {

    cartItems.innerHTML = `
        <div class="cart-empty">

            <div class="cart-empty-icon">
                🛒
            </div>

            <h3>Seu carrinho está vazio</h3>

            <p>Adicione alguns produtos para continuar.</p>

        </div>
    `;

    cartTotal.textContent = "R$ 0,00";

    cartCounter.textContent = 0;

    return;

}

    let total = 0;

    let quantidadeItens = 0;

    carrinho.forEach(item => {

        quantidadeItens += item.quantidade;

        total += item.preco * item.quantidade;

 cartItems.innerHTML += `

    <div class="cart-item">


        ${
            item.imagem

            ?

            `
            <img 
            src="${API_URL}/uploads/${item.imagem}"
            alt="${item.nome}"
            >
            `

            :

            `
            <div class="sem-imagem">
                Sem imagem
            </div>
            `

        }



        <div class="cart-info">

            <h3>
                ${item.nome}
            </h3>


           <p>
    ${item.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}
</p>


<div class="cart-controls">

    <button onclick="diminuirQuantidade(${item.id})">
        -
    </button>

    <span>
        ${item.quantidade}
    </span>

    <button onclick="aumentarQuantidade(${item.id})">
        +
    </button>

</div>

</div>


<strong>

    ${(item.preco * item.quantidade).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })}

</strong>


    </div>

`;

    });

   cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

    cartCounter.textContent =
        quantidadeItens;

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

cartButton.addEventListener("click", () => {

    cartModal.classList.add("active");

});

closeCart.addEventListener("click", () => {

    cartModal.classList.remove("active");

});
checkoutButton.addEventListener("click", () => {

    checkoutForm.classList.add("active");

    checkoutButton.style.display = "none";

});

confirmarPedido.addEventListener("click", async () => {

    confirmarPedido.disabled = true;
    confirmarPedido.textContent = "Enviando...";

    if(carrinho.length === 0){

        alert("Carrinho vazio");

        confirmarPedido.disabled = false;
        confirmarPedido.textContent = "Confirmar Pedido";

        return;

    }

    document.getElementById("endereco").value = "";

    const nome_cliente = document.getElementById("nomeCliente").value;

    const cpf_cnpj = document.getElementById("cpfCnpj").value;

    const telefone = document.getElementById("telefone").value;

    const endereco =
        document.getElementById("cep").value +
        " - " +
        document.getElementById("endereco").value;



    if(
    !nome_cliente ||
    !cpf_cnpj ||
    !telefone ||
    !endereco.value
){

    alert("⚠️ Preencha todos os campos antes de finalizar o pedido.");

    confirmarPedido.disabled = false;

    return;

}



    const total = carrinho.reduce(
        (soma,item)=> soma + (item.preco * item.quantidade),
        0
    );



    const pedido = {

        nome_cliente,

        cpf_cnpj,

        telefone,

        endereco,

        produtos: JSON.stringify(carrinho),

        valor_total: total

    };

    try {

        const resposta = await fetch(`${API_URL}/pedidos`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pedido)

        });


        const dados = await resposta.json();


        console.log("Resposta do servidor:", dados);

        alert("Pedido enviado com sucesso!");


        // limpar carrinho
        carrinho = [];

        salvarCarrinho();

        atualizarCarrinho();


        // fechar formulário
        checkoutForm.classList.remove("active");


        // fechar modal
        cartModal.classList.remove("active");


        // limpar campos
        document.getElementById("nomeCliente").value = "";
        document.getElementById("cpfCnpj").value = "";
        document.getElementById("telefone").value = "";
        document.getElementById("cep").value = "";
        document.getElementById("endereco").value = "";

        confirmarPedido.disabled = false;
        confirmarPedido.textContent = "Confirmar Pedido";

        checkoutButton.style.display = "block";


    } catch (erro) {

        console.error(
            "Erro ao enviar pedido:",
            erro
        );

          confirmarPedido.disabled = false;

          confirmarPedido.textContent = "Confirmar Pedido";

    }

});

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarProdutos();

        atualizarCarrinho();

    }
);

function abrirMenu(){

    sideMenu.classList.add("active");

    menuOverlay.classList.add("active");

    document.body.style.overflow = "hidden";

}


function fecharMenu(){

    sideMenu.classList.remove("active");

    menuOverlay.classList.remove("active");

    document.body.style.overflow = "";

}



menuButton.addEventListener(
    "click",
    abrirMenu
);



closeMenu.addEventListener(
    "click",
    fecharMenu
);



menuOverlay.addEventListener(
    "click",
    fecharMenu
);



document.addEventListener(
    "keydown",
    (e)=>{

        if(e.key === "Escape"){

            fecharMenu();

        }

    }
);

const menuLinks = document.querySelectorAll(
    ".side-menu a"
);


menuLinks.forEach(link => {

    link.addEventListener(
        "click",
        fecharMenu
    );

});