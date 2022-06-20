//Variables

const form = document.querySelector("#form-group");
const listGasto = document.querySelector("#gastos ul");

//Eventos

evenListeners();
function evenListeners(){

    document.addEventListener("DOMContentLoaded", consultarPresupuesto);
    form.addEventListener("submit", agregarGasto);
    listGasto.addEventListener('click', eliminar)
}

//Clases

class Presupuesto{
    constructor(presupuesto){

        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]; 
        this.calcularRestante();
    }

    eliminar(id){
        this.gastos = this.gastos.filter( gasto => gasto.id.toString() !== id );
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto ) => total  + gasto.cantidad, 0)
        this.restante = this.presupuesto - gastado;
    }

}

class UsuarioInter{

    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
    
    //Agregamos los valores al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    mensajeAlerta(mensaje, tipo){
        
        // Crea el div
            const div = document.createElement('div');
            div.classList.add('text-center', 'alert');
    
            if(tipo === 'error') {
                div.classList.add('alert-danger');
            } else {
                div.classList.add('alert-success');
            }
        // Mensaje de error
            div.textContent = mensaje;
    
        // Insertar en el DOM
            document.querySelector('.primario').insertBefore(div, form);
    
            
            setTimeout( () => {
                document.querySelector('.primario .alert').remove();
            }, 3000);
    }

    agregarGastoHtml(gastos){

        //Limpiamos HTML
        this.limpiarHTML();

        //interamos sobre los gastos\
        gastos.forEach(gasto =>{
            const{cantidad,nombreGasto,id} = gasto;

             // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

             // Insertar el gasto
            nuevoGasto.innerHTML = `
                ${nombreGasto}
                <span class="btn-cantidad">$ ${cantidad}</span>
            `;

             // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';

            nuevoGasto.appendChild(btnBorrar);

            // Insertar al HTML
            listGasto.appendChild(nuevoGasto);
        });
    }

    limpiarHTML(){

        while(listGasto.firstChild){
            listGasto.removeChild(listGasto.firstChild);
        }
    }
    actualizarRestante(restante){

        document.querySelector('#restante').textContent =restante;
    }
}

// Instanciar global para reutilizar
const ui = new UsuarioInter();
let presupuesto;


//Funciones

function consultarPresupuesto(){

    const presupuestoUsuario = parseFloat(prompt("Ingrese su presupuesto"));
    
    if (presupuestoUsuario ==="" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {

        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e){
    e.preventDefault();

    const nombreGasto = document.querySelector("#gasto").value
    const cantidad = Number(document.querySelector("#cantidad").value)

    if(nombreGasto === "" || cantidad === ""){
        ui.mensajeAlerta('Ambos campos son obligatorios', 'error');

        return;

    }else if(cantidad <= 0 || isNaN(cantidad) ){
        ui.mensajeAlerta("Cantidad no valida", "error");

        return;
    }

    //Creamos un objeto donde guardamos los gastos y la cantidad
    const gasto = {nombreGasto, cantidad, id: Date.now()}
    
    //Anadiendo nuevo gasto
    presupuesto.nuevoGasto(gasto);


    //Impreimir los gastos en el HTML

    const {gastos, restante} = presupuesto; //Extraemos solo los gastos del objeto
    ui.agregarGastoHtml(gastos);

    ui.actualizarRestante(restante);

    // resetear formulario
    form.reset();
}

//Funcion para eliminar
function eliminar(e) {
    
    if(e.target.classList.contains('borrar-gasto')){
        const {id } = e.target.parentElement.dataset;
        presupuesto.eliminar(id);
        
        // Pasar la cantidad restante para actualizar el DOM
        const { restante } = presupuesto;
        ui.actualizarRestante(restante);

        // Eliminar del DOM
        e.target.parentElement.remove();
    } 
}

