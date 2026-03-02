// app.js
const BACKEND_URL = 'http://localhost:3000/api/evaluaciones';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

let db;
const request = indexedDB.open("EditorialDB", 1);
request.onupgradeneeded = (e) => {
    e.target.result.createObjectStore("evaluaciones", { keyPath: "id", autoIncrement: true });
};
request.onsuccess = (e) => {
    db = e.target.result;
    if (navigator.onLine) sincronizarPendientes(); 
};

const evalForm = document.getElementById('evalForm');
const logSystem = document.getElementById('logSystem');

evalForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        calificacion: document.getElementById('calificacion').value,
        decision: document.getElementById('decision').value,
        comentarios: document.getElementById('comentarios').value,
        status: 'pendiente'
    };

    const tx = db.transaction("evaluaciones", "readwrite");
    const store = tx.objectStore("evaluaciones");
    const addRequest = store.add(data);

    addRequest.onsuccess = async (event) => {
        data.id = event.target.result;
        logSystem.innerText = "Guardado localmente. ";
        evalForm.reset();

        // AQUÍ ESTÁ LA MAGIA QUE FALTABA: Intentar enviar al servidor
        if (navigator.onLine) {
            await enviarAlServidor(data);
        }
    };
});

async function enviarAlServidor(registro) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro)
        });

        if (response.ok) {
            const tx = db.transaction("evaluaciones", "readwrite");
            registro.status = 'enviado';
            tx.objectStore("evaluaciones").put(registro);
            logSystem.innerText = `Registro sincronizado con éxito en MariaDB.`;
        }
    } catch (error) {
        logSystem.innerText += " (Servidor inalcanzable, esperando red...)";
    }
}

function sincronizarPendientes() {
    logSystem.innerText = "Sincronizando pendientes...";
    const tx = db.transaction("evaluaciones", "readonly");
    const store = tx.objectStore("evaluaciones");
    const req = store.getAll();

    req.onsuccess = async () => {
        const registros = req.result;
        const pendientes = registros.filter(r => r.status === 'pendiente');
        
        if (pendientes.length === 0) {
            logSystem.innerText = "Todo está al día.";
            return;
        }
        for (let r of pendientes) {
            await enviarAlServidor(r);
        }
    };
}

// Detectar cambios de red
window.addEventListener('online', () => {
    document.getElementById('net-indicator').className = 'indicator online';
    document.getElementById('net-text').innerText = "Conectado";
    sincronizarPendientes();
});

window.addEventListener('offline', () => {
    document.getElementById('net-indicator').className = 'indicator offline';
    document.getElementById('net-text').innerText = "Modo Offline Activo";
});