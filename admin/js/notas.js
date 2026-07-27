const API_URL = "https://catalogohebrom-production.up.railway.app";


// ============================
// PEGAR ID DA URL
// ============================

const urlParams = new URLSearchParams(
    window.location.search
);

const idPedido = urlParams.get("id");


// ============================
// FORMATAR MOEDA
// ============================

function formatarMoeda(valor){

    return Number(valor || 0).toLocaleString("pt-BR",{
        style:"currency",
        currency:"BRL"
    });

}



// ============================
// CARREGAR PEDIDO
// ============================

async function carregarPedido(){


    try{


        const resposta = await fetch(
            `${API_URL}/pedidos/${idPedido}`
        );


        const pedido = await resposta.json();



        console.log(
            "Pedido recebido:",
            pedido
        );



        // ============================
        // DADOS PRINCIPAIS
        // ============================


        document.getElementById("numeroPedido").textContent =
            pedido.id;



        document.getElementById("codigoPedido").textContent =
            pedido.id;



        document.getElementById("dataPedido").textContent =
            new Date(
                pedido.data || Date.now()
            ).toLocaleDateString("pt-BR");



        document.getElementById("horaPedido").textContent =
            new Date().toLocaleTimeString("pt-BR");





        // ============================
        // CLIENTE
        // ============================


        document.getElementById("nomeCliente").textContent =
            pedido.nome_cliente ||
            pedido.nomeCliente ||
            "";



        document.getElementById("cpfCliente").textContent =
            pedido.cpf_cnpj ||
            pedido.cpfCnpj ||
            "";



        document.getElementById("telefoneCliente").textContent =
            pedido.telefone ||
            "";



        document.getElementById("enderecoCliente").textContent =
            pedido.endereco ||
            "";



        document.getElementById("bairroCliente").textContent =
            pedido.bairro ||
            "";



        document.getElementById("cidadeCliente").textContent =
            pedido.cidade ||
            "";



        document.getElementById("cepCliente").textContent =
            pedido.cep ||
            "";





        // ============================
        // PRODUTOS
        // ============================


        const listaProdutos =
            document.getElementById(
                "listaProdutos"
            );


        listaProdutos.innerHTML = "";



        let produtos =
            typeof pedido.produtos === "string"
            ? JSON.parse(pedido.produtos)
            : pedido.produtos;



        let total = 0;



        let quantidadeItens = 0;



        produtos.forEach(
            (produto,index)=>{


                const subtotal =
                    Number(produto.quantidade) *
                    Number(produto.preco);



                total += subtotal;


                quantidadeItens +=
                    Number(produto.quantidade);



                listaProdutos.innerHTML += `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>


                        <td>
                            ${produto.codigo || "-"}
                        </td>


                        <td>
                            ${produto.nome}
                        </td>


                        <td>
                            UN
                        </td>


                        <td>
                            ${produto.quantidade}
                        </td>


                        <td>
                            ${formatarMoeda(produto.preco)}
                        </td>


                        <td>
                            ${formatarMoeda(subtotal)}
                        </td>


                    </tr>

                `;


            }
        );





        // ============================
        // VALORES
        // ============================


        document.getElementById("valorProdutos").textContent =
            formatarMoeda(total);



        document.getElementById("valorTotal").textContent =
            formatarMoeda(total);



        document.getElementById("totalProdutos").textContent =
            formatarMoeda(total);



        document.getElementById("valorFinal").textContent =
            formatarMoeda(total);



        document.getElementById("quantidadeItens").textContent =
            quantidadeItens;




        // ============================
        // FORMA PAGAMENTO
        // ============================


        document.getElementById("formaPagamento").textContent =
            pedido.pagamento ||
            pedido.formaPagamento ||
            "Não informado";



    }
    catch(error){


        console.error(
            "Erro ao carregar pedido:",
            error
        );


    }


}




// ============================
// INICIAR
// ============================


if(idPedido){

    carregarPedido();

}