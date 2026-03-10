// --- ENCENDER EL SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('⚙️ [SW] Service Worker Registrado con éxito'))
        .catch(err => console.error('❌ [SW] Error al registrar:', err));
}

const evalForm = document.getElementById('evalForm');
const logSystem = document.getElementById('logSystem');
const selectArticulo = document.getElementById('articulo_id');
const netIndicator = document.getElementById('net-indicator');
const netText = document.getElementById('net-text');

// --- 1. PREPARAR LA BASE DE DATOS LOCAL (IndexedDB) ---
let dbOffline;
const requestDB = indexedDB.open('EditorialOfflineDB', 1);

requestDB.onupgradeneeded = (e) => {
    dbOffline = e.target.result;
    dbOffline.createObjectStore('pendientes', { autoIncrement: true });
};

requestDB.onsuccess = (e) => {
    dbOffline = e.target.result;
    if (navigator.onLine) sincronizarPendientes();
};

// --- 2. CARGAR LISTA DE ARTÍCULOS ---
document.addEventListener('DOMContentLoaded', cargarArticulosPendientes);

async function cargarArticulosPendientes() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/articulos/pendientes');
        const articulos = await respuesta.json();

        selectArticulo.innerHTML = '<option value="">Seleccione un artículo...</option>';
        if (articulos.length === 0) {
            selectArticulo.innerHTML = '<option value="">✅ No hay artículos pendientes</option>';
            return;
        }
        articulos.forEach(art => {
            selectArticulo.innerHTML += `<option value="${art.id}">#${art.id} - ${art.nombre_original}</option>`;
        });
    } catch (error) {
        selectArticulo.innerHTML = '<option value="">❌ Offline: Reconecta para ver la lista.</option>';
    }
}

// --- 3. EL ENVÍO DE LA EVALUACIÓN ---
evalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const evaluacion = {
        articulo_id: selectArticulo.value,
        calificacion: document.getElementById('calificacion').value,
        decision: document.getElementById('decision').value,
        comentarios: document.getElementById('comentarios').value
    };

    logSystem.innerText = "Procesando...";
    const btnSubmit = evalForm.querySelector('button');
    btnSubmit.disabled = true;

    if (navigator.onLine) {
        try {
            const respuesta = await fetch('http://localhost:3000/api/evaluaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(evaluacion)
            });
            if (respuesta.ok) {
                logSystem.innerText = "✅ Evaluación guardada en el servidor central.";
                evalForm.reset();
                cargarArticulosPendientes();
            } else {
                logSystem.innerText = "❌ Error en el servidor al guardar.";
            }
        } catch (error) {
            guardarOffline(evaluacion);
        }
    } else {
        guardarOffline(evaluacion);
    }

    btnSubmit.disabled = false;
});

// --- 4. LA MAGIA OFFLINE (Guardar y Sincronizar) ---
function guardarOffline(evaluacion) {
    const transaccion = dbOffline.transaction(['pendientes'], 'readwrite');
    const almacen = transaccion.objectStore('pendientes');
    almacen.add(evaluacion);

    transaccion.oncomplete = () => {
        logSystem.innerText = "💾 Sin internet. Evaluación guardada localmente. Se enviará automáticamente al reconectar.";
        evalForm.reset();
    };
}

function sincronizarPendientes() {
    if (!dbOffline) return;
    
    const transaccion = dbOffline.transaction(['pendientes'], 'readonly');
    const almacen = transaccion.objectStore('pendientes');
    const peticion = almacen.getAll();

    peticion.onsuccess = async () => {
        const evaluacionesGuardadas = peticion.result;
        
        if (evaluacionesGuardadas.length > 0) {
            logSystem.innerText = `🔄 Sincronizando ${evaluacionesGuardadas.length} evaluación(es) pendiente(s)...`;
            
            for (const evalOffline of evaluacionesGuardadas) {
                try {
                    await fetch('http://localhost:3000/api/evaluaciones', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(evalOffline)
                    });
                } catch (err) {
                    console.log("Falló la sincronización. Seguiremos esperando red.");
                    return; 
                }
            }
            
            const txBorrar = dbOffline.transaction(['pendientes'], 'readwrite');
            txBorrar.objectStore('pendientes').clear();
            
            logSystem.innerText = "✅ Sincronización completada con éxito.";
            cargarArticulosPendientes();
        }
    };
}

// --- 5. DETECTORES AUTOMÁTICOS DE RED ---
window.addEventListener('online', () => {
    if(netIndicator) netIndicator.classList.replace('offline', 'online');
    if(netText) netText.innerText = 'Conectado';
    sincronizarPendientes(); 
});

window.addEventListener('offline', () => {
    if(netIndicator) netIndicator.classList.replace('online', 'offline');
    if(netText) netText.innerText = 'Sin conexión';
    logSystem.innerText = '⚠️ Estás trabajando en modo Offline. Puedes seguir calificando.';
});