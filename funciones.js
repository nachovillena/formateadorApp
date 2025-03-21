document.addEventListener("DOMContentLoaded", () => {
    const tabTexto = document.getElementById("tab-texto");
    const tabDocumento = document.getElementById("tab-documento");
    const contentTexto = document.getElementById("content-texto");
    const contentDocumento = document.getElementById("content-documento");
    const fileInput = document.getElementById("file-input");
    const btnSubir = document.getElementById("btn-subir");
    const btnQuitar = document.getElementById("btn-quitar");
    const btnBorrar = document.getElementById("btn-borrar");
    const btnCopiar = document.getElementById("btn-copiar");
    const fileName = document.getElementById("file-name");
    const textArea = document.getElementById("text-area");
    const btnEnviar = document.getElementById("btn-enviar");
    const errorMessage = document.getElementById("error-message");
    const resultado = document.getElementById("resultado");
    const output = document.getElementById("output");
    
    let activeTab = "texto";

    const switchTab = (tab) => {
        if (tab === "texto") {
            tabTexto.classList.add("is-active");
            tabDocumento.classList.remove("is-active");
            contentTexto.style.display = "block";
            contentDocumento.style.display = "none";
            activeTab = "texto";
        } else {
            tabDocumento.classList.add("is-active");
            tabTexto.classList.remove("is-active");
            contentTexto.style.display = "none";
            contentDocumento.style.display = "block";
            activeTab = "documento";
        }
    };

    tabTexto.addEventListener("click", () => switchTab("texto"));
    tabDocumento.addEventListener("click", () => switchTab("documento"));
    
    btnSubir.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            fileName.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
            errorMessage.style.display = "none";
            btnQuitar.style.display = "inline-block";
        }
    });

    btnQuitar.addEventListener("click", () => {
        fileInput.value = "";
        fileName.textContent = "";
        btnQuitar.style.display = "none";
    });

    btnBorrar.addEventListener("click", () => {
        btnBorrar.style.display = "none";
        output.textContent = "";
        resultado.style.display = "none";
    });

    btnCopiar.addEventListener("click", () => {
        navigator.clipboard.writeText(output.textContent).then(function() {
            alert('¡Contenido copiado al portapapeles!');
          }).catch(function(error) {
            alert('Error al copiar: ' + error);
          });
    });

    const procesarTexto = (texto) => {
        const lineas = texto.split("\n").slice(3); // Omitir cabecera
        let resultados = [];
        let plancha = "";
        let resultadoLinea = "";
        let cont = 0;
        let hayPlanchas = false;
        for (let linea of lineas) {
            let matchULD = linea.match(/ULD\/(\w+)/);
            
            if (matchULD) {
                cont = cont + 1
                if (resultadoLinea != ""){
                    if(plancha != ""){
                        hayPlanchas = true;
                        resultados.push(cont + "- "+ resultadoLinea);
                    }else{
                        resultados.push("BULK: "+ resultadoLinea);
                    }
                }
                resultadoLinea="";
                plancha = matchULD[1];
                resultadoLinea = plancha + ": "
            }
            
            if (/^\d{3}-\d{8,}/.test(linea)) {
                const partesLinea = linea.split("/");
                let idAir = partesLinea[0].substring(0, 12);
                let piezas = partesLinea[1].slice(1).match(/^\d+/); // Tomamos desde el segundo carácter y extraemos los números hasta una letra
                if(plancha != ""){
                    resultadoLinea = resultadoLinea + piezas + " piezas " +idAir+", ";
                }else{
                    resultadoLinea = resultadoLinea + piezas + " piezas " +idAir+", "; 
                }
                

                
            }

            

            
        }

        if (resultadoLinea != ""){
            resultados.push(cont + "- "+ resultadoLinea);
        }
        
        btnBorrar.style.display = "block";
        return resultados.join("\n");
    };

    btnEnviar.addEventListener("click", () => {
        if (activeTab === "texto" && textArea.value.trim() === "") {
            alert("Debe ingresar texto o cambiar a 'Subir Documento'");
        } else if (activeTab === "documento" && fileInput.files.length === 0) {
            errorMessage.style.display = "block";
        } else {
            resultado.style.display = "block";
            if (activeTab === "texto") {
                output.textContent = procesarTexto(textArea.value);
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    output.textContent = procesarTexto(event.target.result);
                    resultado.scrollIntoView({ behavior: "smooth" });
                };
                reader.readAsText(fileInput.files[0]);
            }
            resultado.scrollIntoView({ behavior: "smooth" });
        }
    });
});