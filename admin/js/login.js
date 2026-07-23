document.addEventListener("DOMContentLoaded",()=>{


    const form = document.getElementById("loginForm");


    form.addEventListener("submit", async(event)=>{


        event.preventDefault();

        const usuario =
        document.getElementById("usuario").value;



        const senha =
        document.getElementById("senha").value;



        const resposta = await fetch(
            "http://localhost:3000/admin/login",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    usuario,
                    senha

                })

            }
        );



        const dados = await resposta.json();



        console.log(dados);



        if(resposta.ok){


            localStorage.setItem(
                "token",
                dados.token
            );

            window.location.href="painel.html";

        }else{


            alert(dados.erro);

        }


    });


});