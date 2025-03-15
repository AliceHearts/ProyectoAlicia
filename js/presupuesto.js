// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del formulario
    const formularioPresupuesto = document.getElementById('budget-form');
    const inputNombre = document.getElementById('name');
    const inputApellidos = document.getElementById('lastname');
    const inputTelefono = document.getElementById('phone');
    const inputEmail = document.getElementById('email');
    const selectProducto = document.getElementById('product');
    const inputPlazo = document.getElementById('deadline');
    const casillasExtras = document.querySelectorAll('input[name="extras"]');
    const casillaTerminos = document.getElementById('terms');
    const totalPresupuesto = document.getElementById('budget-total');
    
    // Elementos de mensajes de error
    const errorNombre = document.getElementById('name-error');
    const errorApellidos = document.getElementById('lastname-error');
    const errorTelefono = document.getElementById('phone-error');
    const errorEmail = document.getElementById('email-error');
    
    // Expresiones para validación
    const regexNombre = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
    const regexTelefono = /^[0-9]{9}$/;
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // Eventos para validación en tiempo real
    inputNombre.addEventListener('input', validarNombre);
    inputApellidos.addEventListener('input', validarApellidos);
    inputTelefono.addEventListener('input', validarTelefono);
    inputEmail.addEventListener('input', validarEmail);
    
    // Eventos para cálculo de presupuesto
    selectProducto.addEventListener('change', calcularPresupuesto);
    inputPlazo.addEventListener('input', calcularPresupuesto);
    casillasExtras.forEach(casilla => {
        casilla.addEventListener('change', calcularPresupuesto);
    });
    
    // Envío del formulario
    formularioPresupuesto.addEventListener('submit', function(evento) {
        // Validar todos los campos antes del envío
        const esNombreValido = validarNombre();
        const sonApellidosValidos = validarApellidos();
        const esTelefonoValido = validarTelefono();
        const esEmailValido = validarEmail();
        
        // Si alguna validación falla, prevenir el envío del formulario
        if (!esNombreValido || !sonApellidosValidos || !esTelefonoValido || !esEmailValido || !casillaTerminos.checked) {
            evento.preventDefault();
            
            // Mostrar error para términos si no está marcado
            if (!casillaTerminos.checked) {
                alert('Debes aceptar los términos y condiciones para continuar.');
            }
        } else {
            // Si todas las validaciones pasan, mostrar mensaje de éxito
            alert('¡Gracias! Tu solicitud de presupuesto ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.');
        }
    });
    
    // Funciones de validación
    function validarNombre() {
        const valor = inputNombre.value.trim();
        const esValido = regexNombre.test(valor) && valor.length <= 15 && valor.length > 0;
        
        if (!esValido) {
            errorNombre.style.display = 'block';
            inputNombre.classList.add('invalid');
        } else {
            errorNombre.style.display = 'none';
            inputNombre.classList.remove('invalid');
        }
        
        return esValido;
    }
    
    function validarApellidos() {
        const valor = inputApellidos.value.trim();
        const esValido = regexNombre.test(valor) && valor.length <= 40 && valor.length > 0;
        
        if (!esValido) {
            errorApellidos.style.display = 'block';
            inputApellidos.classList.add('invalid');
        } else {
            errorApellidos.style.display = 'none';
            inputApellidos.classList.remove('invalid');
        }
        
        return esValido;
    }
    
    function validarTelefono() {
        const valor = inputTelefono.value.trim();
        const esValido = regexTelefono.test(valor);
        
        if (!esValido) {
            errorTelefono.style.display = 'block';
            inputTelefono.classList.add('invalid');
        } else {
            errorTelefono.style.display = 'none';
            inputTelefono.classList.remove('invalid');
        }
        
        return esValido;
    }
    
    function validarEmail() {
        const valor = inputEmail.value.trim();
        const esValido = regexEmail.test(valor);
        
        if (!esValido) {
            errorEmail.style.display = 'block';
            inputEmail.classList.add('invalid');
        } else {
            errorEmail.style.display = 'none';
            inputEmail.classList.remove('invalid');
        }
        
        return esValido;
    }
    
    // Función de cálculo de presupuesto
    function calcularPresupuesto() {
        let total = 0;
        
        // Obtener precio base del producto seleccionado
        const productoSeleccionado = selectProducto.options[selectProducto.selectedIndex];
        if (productoSeleccionado && productoSeleccionado.value) {
            total += parseInt(productoSeleccionado.dataset.price);
        }
        
        // Añadir extras
        casillasExtras.forEach(casilla => {
            if (casilla.checked) {
                total += parseInt(casilla.dataset.price);
            }
        });
        
        // Aplicar ajustes de plazo
        const plazo = parseInt(inputPlazo.value);
        if (plazo < 2) {
            // Recargo por urgencia: 20% extra para menos de 2 meses
            total *= 1.2;
        } else if (plazo > 6) {
            // Descuento: 10% de descuento para más de 6 meses
            total *= 0.9;
        }
        
        // Actualizar la visualización del presupuesto
        totalPresupuesto.textContent = `${Math.round(total)}€`;
    }
    
    // Inicializar cálculo de presupuesto
    calcularPresupuesto();
});