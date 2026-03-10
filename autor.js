// --- ENCENDER EL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('⚙️ [SW] Service Worker Registrado con éxito'))
        .catch(err => console.error('❌ [SW] Error al registrar:', err));
}

const autorForm = document.getElementById('autorForm');
const logAutor = document.getElementById('logAutor');
const tablaAutor = document.getElementById('tablaAutor');

// 1. LÓGICA PARA SUBIR EL ARCHIVO
autorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const archivoInput = document.getElementById('archivo');
    const archivoFisico = archivoInput.files[0]; 

    if (archivoFisico) {
        const btnSubmit = autorForm.querySelector('button');
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Subiendo...";
        logAutor.innerText = `Enviando "${archivoFisico.name}" al servidor...`;

        const formData = new FormData();
        formData.append('archivo', archivoFisico);

        try {
            const respuesta = await fetch('http://localhost:3000/api/articulos', {
                method: 'POST',
                body: formData 
            });

            if (respuesta.ok) {
                logAutor.innerText = `✅ ¡Éxito! Artículo recibido por el comité.`;
                autorForm.reset();
                cargarHistorial(); 
            } else {
                logAutor.innerText = "❌ Hubo un error al procesar el archivo.";
            }
        } catch (error) {
            logAutor.innerText = "🔌 Sin conexión. No se pueden subir archivos pesados offline.";
        }

        btnSubmit.disabled = false;
        btnSubmit.innerText = "Subir Artículo";
    }
});

// 2. LÓGICA PARA CARGAR LA TABLA DE ENVÍOS
document.addEventListener('DOMContentLoaded', cargarHistorial);

async function cargarHistorial() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/articulos');
        const articulos = await respuesta.json();

        if (articulos.length > 0) {
            tablaAutor.innerHTML = ''; 
            
            articulos.forEach(art => {
                const comentarios = art.comentarios || 'En espera de revisión...';
                const fila = `
                    <tr>
                        <td><strong>${art.nombre_original}</strong></td>
                        <td>${art.estado}</td>
                        <td><small>${comentarios}</small></td>
                    </tr>
                `;
                tablaAutor.innerHTML += fila;
            });
        } else {
            tablaAutor.innerHTML = '<tr><td colspan="3" style="text-align: center;">Aún no has subido artículos.</td></tr>';
        }
    } catch (error) {
        tablaAutor.innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">❌ Offline: No se pudo cargar el historial.</td></tr>';
    }
}