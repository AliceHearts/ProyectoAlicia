// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar noticias desde archivo JSON
    cargarNoticias();
    
    // Resaltar enlace de navegación activo
    resaltarEnlaceNavegacionActivo();
});

// Función para cargar noticias desde archivo JSON
function cargarNoticias() {
    const contenedorNoticias = document.getElementById('news-container');
    
    // Si no estamos en la página de inicio, retornar
    if (!contenedorNoticias) return;
    
    // Crear un nuevo objeto XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    // Configurarlo: solicitud GET para la URL
    xhr.open('GET', 'data/news.json', true);
    
    // Qué hacer cuando la respuesta esté lista
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Analizar la respuesta JSON
            const noticias = JSON.parse(xhr.responseText);
            
            // Generar HTML para cada elemento de noticias
            let noticiasHTML = '';
            noticias.forEach(item => {
                noticiasHTML += `
                    <div class="news-card">
                        <img src="${item.image}" alt="${item.title}" class="news-image">
                        <div class="news-content">
                            <div class="news-date">${item.date}</div>
                            <h3 class="news-title">${item.title}</h3>
                            <p class="news-excerpt">${item.excerpt}</p>
                            <a href="${item.link}" class="news-link">Leer más</a>
                        </div>
                    </div>
                `;
            });
            
            // Insertar el HTML en el contenedor de noticias
            contenedorNoticias.innerHTML = noticiasHTML;
        } else {
            console.error('Error cargando noticias:', xhr.statusText);
            contenedorNoticias.innerHTML = '<p>Error al cargar las noticias. Por favor, inténtelo de nuevo más tarde.</p>';
        }
    };
    
    // Manejar errores de red
    xhr.onerror = function() {
        console.error('Error de red al cargar noticias');
        contenedorNoticias.innerHTML = '<p>Error de red al cargar las noticias. Por favor, compruebe su conexión.</p>';
    };
    
    // Enviar la solicitud
    xhr.send();
}

// Función para resaltar el enlace de navegación activo
function resaltarEnlaceNavegacionActivo() {
    // Obtener el nombre de archivo de la página actual
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    
    // Obtener todos los enlaces de navegación
    const enlacesNavegacion = document.querySelectorAll('nav ul li a');
    
    // Recorrer los enlaces y añadir la clase activa a la página actual
    enlacesNavegacion.forEach(enlace => {
        const enlaceHref = enlace.getAttribute('href');
        if (enlaceHref === paginaActual) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
}
