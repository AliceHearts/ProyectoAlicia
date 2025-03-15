// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Coordenadas de Madrid (ubicación predeterminada)
    const coordenadasMadrid = [40.4168, -3.7038];
    
    const mapa = L.map('map').setView(coordenadasMadrid, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // Marcador para la ubicación de la oficina
    const marcadorOficina = L.marker(coordenadasMadrid).addTo(mapa);
    marcadorOficina.bindPopup("<b>DevMasters</b><br>Calle Ejemplo 123, Madrid").openPopup();
    
    // Ruta
    const inputUbicacionInicio = document.getElementById('start-location');
    const botonEncontrarRuta = document.getElementById('find-route');
    
    // Almacenar la capa de ruta
    let capaRuta = null;
    
    // Boton
    botonEncontrarRuta.addEventListener('click', function() {
        const ubicacionInicio = inputUbicacionInicio.value.trim();
        
        if (ubicacionInicio) {
            // Mostrar estado de carga
            botonEncontrarRuta.textContent = 'Buscando...';
            botonEncontrarRuta.disabled = true;
            
            // Usar Nominatim para geocodificar la ubicación de inicio
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ubicacionInicio)}`)
                .then(respuesta => respuesta.json())
                .then(datos => {
                    if (datos.length > 0) {
                        const coordenadasInicio = [parseFloat(datos[0].lat), parseFloat(datos[0].lon)];
                        
                        // Añadir un marcador para la ubicación de inicio
                        const marcadorInicio = L.marker(coordenadasInicio).addTo(mapa);
                        marcadorInicio.bindPopup("<b>Tu ubicación</b><br>" + ubicacionInicio).openPopup();
                        
                        // Obtener ruta usando OSRM
                        obtenerRuta(coordenadasInicio, coordenadasMadrid);
                        
                        // Ajustar el mapa para mostrar ambos marcadores
                        const limites = L.latLngBounds([coordenadasInicio, coordenadasMadrid]);
                        mapa.fitBounds(limites, { padding: [50, 50] });
                    } else {
                        alert('No se pudo encontrar la ubicación. Por favor, intenta con otra dirección.');
                        reiniciarBotonRuta();
                    }
                })
                .catch(error => {
                    console.error('Error geocodificando dirección:', error);
                    alert('Hubo un error al buscar la dirección. Por favor, inténtalo de nuevo.');
                    reiniciarBotonRuta();
                });
        } else {
            alert('Por favor, introduce una dirección de inicio.');
        }
    });
    
    // Función para obtener la ruta entre dos puntos
    function obtenerRuta(inicio, fin) {
        // Convertir coordenadas al formato esperado por OSRM
        const inicioLng = inicio[1];
        const inicioLat = inicio[0];
        const finLng = fin[1];
        const finLat = fin[0];
        
        // URL de la API OSRM
        const url = `https://router.project-osrm.org/route/v1/driving/${inicioLng},${inicioLat};${finLng},${finLat}?overview=full&geometries=geojson`;
        
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => {
                if (datos.routes && datos.routes.length > 0) {
                    // Eliminar ruta anterior si existe
                    if (capaRuta) {
                        mapa.removeLayer(capaRuta);
                    }
                    
                    // Añadir la ruta al mapa
                    const ruta = datos.routes[0];
                    const geometriaRuta = ruta.geometry;
                    
                    capaRuta = L.geoJSON(geometriaRuta, {
                        style: {
                            color: '#3498db',
                            weight: 5,
                            opacity: 0.7
                        }
                    }).addTo(mapa);
                    
                    // Mostrar información de la ruta
                    const distancia = (ruta.distance / 1000).toFixed(2); // km
                    const duracion = Math.round(ruta.duration / 60); // minutos
                    
                    // Añadir un popup con información de la ruta
                    L.popup()
                        .setLatLng(coordenadasMadrid)
                        .setContent(`<b>Distancia:</b> ${distancia} km<br><b>Tiempo estimado:</b> ${duracion} minutos`)
                        .openOn(mapa);
                    
                    reiniciarBotonRuta();
                } else {
                    alert('No se pudo encontrar una ruta. Por favor, intenta con otra dirección.');
                    reiniciarBotonRuta();
                }
            })
            .catch(error => {
                console.error('Error obteniendo ruta:', error);
                alert('Hubo un error al calcular la ruta. Por favor, inténtalo de nuevo.');
                reiniciarBotonRuta();
            });
    }
    
    // Función para reiniciar el botón de ruta
    function reiniciarBotonRuta() {
        botonEncontrarRuta.textContent = 'Encontrar Ruta';
        botonEncontrarRuta.disabled = false;
    }
});