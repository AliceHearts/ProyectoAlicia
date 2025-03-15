// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    var lightbox = window.lightbox || {};

    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'albumLabel': "Imagen %1 de %2"
    });
    
    // Filtrado de galería
    const botonesFiltradores = document.querySelectorAll('.filter-btn');
    const elementosGaleria = document.querySelectorAll('.gallery-item');
    
    // Añadir evento de clic a los botones de filtro
    botonesFiltradores.forEach(boton => {
        boton.addEventListener('click', function() {
            // Eliminar clase activa de todos los botones
            botonesFiltradores.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clicado
            this.classList.add('active');
            
            // Obtener valor del filtro
            const valorFiltro = this.getAttribute('data-filter');
            
            // Filtrar elementos de la galería
            elementosGaleria.forEach(elemento => {
                if (valorFiltro === 'all' || elemento.getAttribute('data-category') === valorFiltro) {
                    elemento.style.display = 'block';
                    // Añadir animación
                    elemento.classList.add('fade-in');
                    setTimeout(() => {
                        elemento.classList.remove('fade-in');
                    }, 500);
                } else {
                    elemento.style.display = 'none';
                }
            });
        });
    });
});
