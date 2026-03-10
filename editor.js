// --- ENCENDER EL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('⚙️ [SW] Service Worker Registrado con éxito'))
        .catch(err => console.error('❌ [SW] Error al registrar:', err));
}

document.addEventListener('DOMContentLoaded', async () => {
    const tablaEditor = document.getElementById('tablaEditor');

    try {
        const respuesta = await fetch('http://localhost:3000/api/articulos');
        const articulos = await respuesta.json();

        tablaEditor.innerHTML = '';

        if (articulos.length === 0) {
            tablaEditor.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay artículos registrados.</td></tr>';
            return;
        }

        articulos.forEach(art => {
            const fecha = new Date(art.fecha_subida).toLocaleString('es-MX');
            
            let claseEstado = 'badge-enviado';
            if(art.estado === 'Aprobado') claseEstado = 'badge-aprobado';
            if(art.estado === 'Rechazado') claseEstado = 'badge-rechazado';

            const nota = art.calificacion || '-';
            const comentarios = art.comentarios || 'Aún sin revisión.';

            const fila = `
                <tr>
                    <td>#${art.id}</td>
                    <td><strong>${art.nombre_original}</strong></td>
                    <td>${fecha}</td>
                    <td><span class="${claseEstado}">${art.estado}</span></td>
                    <td><strong>${nota}</strong></td>
                    <td><small>${comentarios}</small></td>
                </tr>
            `;
            tablaEditor.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error cargando artículos:", error);
        tablaEditor.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">❌ Error al conectar con el servidor. MODO OFFLINE.</td></tr>';
    }
});