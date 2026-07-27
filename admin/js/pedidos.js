const API_URL = "https://catalogohebrom-production.up.railway.app";


const pedidosContainer = document.getElementById("pedidosContainer");

async function carregarPedidos(){

    try{

        const token = localStorage.getItem("token");


        const resposta = await fetch(`${API_URL}/pedidos`, {

            headers:{
                "Authorization": `Bearer ${token}`
            }

        });


        const pedidos = await resposta.json();

        
        console.log("Pedidos recebidos:", pedidos);


        renderizarPedidos(pedidos);


    }catch(erro){

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );

    }

}


function renderizarPedidos(pedidos){

    pedidosContainer.innerHTML = "";


    pedidos.forEach(pedido => {


      let produtos = [];

try {

    produtos = JSON.parse(pedido.produtos);

} catch {

    produtos = [
        {
            nome: pedido.produtos,
            quantidade: 1,
            preco: pedido.valor_total
        }
    ];

}


        let listaProdutos = "";


        produtos.forEach(item => {


            const subtotal = item.preco * item.quantidade;


            listaProdutos += `

                <div class="produto-pedido">

                    <strong>
                        ${item.nome}
                    </strong>

                    <p>
                        Quantidade:
                        ${item.quantidade}
                    </p>

                   <p>
    Valor unitário:
    ${Number(item.preco).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    })}
</p>

<p>
    Subtotal:
    ${Number(subtotal).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    })}
</p>

                </div>

            `;


        });



        pedidosContainer.innerHTML += `


        <div class="pedido">


            <div class="pedido-header">

                <h2>
                    Pedido #${pedido.id}
                </h2>


                <span class="status ${pedido.status.toLowerCase()}">
                    ${pedido.status}
                </span>


            </div>



            <p>
                <strong>Cliente:</strong>
                ${pedido.nome_cliente}
            </p>


            <p>
                <strong>Telefone:</strong>
                ${pedido.telefone}
            </p>


            <p>
                <strong>Endereço:</strong>
                ${pedido.endereco}
            </p>


            <p>
                <strong>CPF/CNPJ:</strong>
                ${pedido.cpf_cnpj || "Não informado"}
            </p>


            <h3>
                Produtos
            </h3>

            <div class="lista-produtos">

                ${listaProdutos}

            </div>



            <h3>
                Total do pedido:
            </h3>


            <strong>

                ${Number(pedido.valor_total).toLocaleString("pt-BR",{
                    style:"currency",
                    currency:"BRL"
                })}

            </strong>



            <div class="alterar-status">


                <label>
                    Alterar status:
                </label>


                <select 
                    onchange="alterarStatus(${pedido.id}, this.value)"
                >

                    <option ${pedido.status === "Novo" ? "selected" : ""}>
                        Novo
                    </option>

                    <option ${pedido.status === "Em análise" ? "selected" : ""}>
                        Em análise
                    </option>

                    <option ${pedido.status === "Enviado" ? "selected" : ""}>
                        Enviado
                    </option>

                    <option ${pedido.status === "Finalizado" ? "selected" : ""}>
                        Finalizado
                    </option>

                </select>


            </div>

            
                <div class="acoes-pedido">

                        <button
                        class="btn-imprimir"
                        onclick="imprimirPedido(${pedido.id})"
                        >
                            🖨 Imprimir Nota
                        </button>

                  </div>



        </div>


        `;


    });


}

async function alterarStatus(id, status){

    try{

        const token = localStorage.getItem("token");


        const resposta = await fetch(
            `${API_URL}/pedidos/${id}`,
            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },


                body: JSON.stringify({

                    status: status

                })

            }
        );


        const dados = await resposta.json();


        console.log(
            dados
        );


        carregarPedidos();


    }catch(erro){

        console.error(
            "Erro ao atualizar status:",
            erro
        );

    }

}

function imprimirPedido(id){

    window.open(
        `/admin/notas.html?id=${id}`,
        "_blank"
    );

}


document.addEventListener(
    "DOMContentLoaded",
    carregarPedidos
);