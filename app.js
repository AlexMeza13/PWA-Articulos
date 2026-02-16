// Registro del Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// Configuración de IndexedDB
let db;
const request = indexedDB.open("EditorialDB", 1);
request.onupgradeneeded = (e) => {
    e.target.result.createObjectStore("evaluaciones", { keyPath: "id", autoIncrement: true });
};
request.onsuccess = (e) => db = e.target.result;

// Manejo de Formulario y Red
const evalForm = document.getElementById('evalForm');

evalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        calificacion: document.getElementById('calificacion').value,
        decision: document.getElementById('decision').value,
        comentarios: document.getElementById('comentarios').value,
        status: navigator.onLine ? 'enviado' : 'pendiente'
    };

    const tx = db.transaction("evaluaciones", "readwrite");
    tx.objectStore("evaluaciones").add(data);
    tx.oncomplete = () => {
        document.getElementById('logSystem').innerText = "Guardado en IndexedDB correctamente.";
        evalForm.reset();
    };
});

// Detectar cambios de conexión para sincronizar [cite: 154, 233]
window.addEventListener('online', () => {
    document.getElementById('net-indicator').className = 'indicator online';
    document.getElementById('net-text').innerText = "Conectado - Sincronizando...";
    // Aquí se activaría la lógica de Background Sync post-MVP
});
window.addEventListener('offline', () => {
    document.getElementById('net-indicator').className = 'indicator offline';
    document.getElementById('net-text').innerText = "Modo Offline Activo";
});