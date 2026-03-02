=================================================================
SISTEMA EDITORIAL PWA - ARQUITECTURA OFFLINE-FIRST 
=================================================================

Este proyecto es una Aplicacion Web Progresiva (PWA) disenada para gestionar evaluaciones de articulos editoriales. Utiliza una arquitectura Offline-First, lo que significa que los revisores pueden trabajar sin conexion a internet y el sistema sincronizara automaticamente los datos con el servidor central cuando la red se restablezca.

TECNOLOGIAS UTILIZADAS
- Frontend: HTML5, CSS3, JavaScript (Vanilla).
- Almacenamiento Local: IndexedDB y Cache Storage (Service Worker).
- Backend: Node.js con Express.
- Base de Datos: MySQL / MariaDB (mediante AppServ).

-----------------------------------------------------------------
COMO ENCENDER EL PROYECTO (Flujo de Trabajo)
-----------------------------------------------------------------
Para que el sistema funcione correctamente y pueda sincronizar datos, debes encender las piezas en el siguiente orden:

1. Encender la Base de Datos (AppServ)
   - Ve al menu de Inicio de Windows.
   - Busca la carpeta de AppServ y haz clic en "Start MySQL" (o Start All Services).
   - (Opcional) Puedes verificar que esta corriendo entrando a http://localhost/phpmyadmin en tu navegador.

2. Levantar el Servidor Backend (Node.js)
   - Abre Visual Studio Code.
   - Abre la carpeta de tu backend (backend-editorial).
   - Abre la terminal integrada (Ctrl + ñ).
   - Ejecuta el servidor con el comando: node server.js
   - Debes ver el mensaje de que el servidor esta corriendo en el puerto 3000. No cierres esta terminal.

3. Iniciar la PWA (Frontend)
   - En Visual Studio Code, abre la carpeta de tu frontend.
   - Haz clic en el boton "Go Live" en la esquina inferior derecha.
   - La aplicacion se abrira automaticamente en tu navegador web.

-----------------------------------------------------------------
COMO APAGAR EL PROYECTO DE FORMA SEGURA
-----------------------------------------------------------------
Cuando termines de trabajar, sigue estos pasos para liberar la memoria de tu equipo:

1. Detener el Backend
   - Ve a la terminal de Visual Studio Code donde esta corriendo el servidor.
   - Presiona Ctrl + C.
   - (Si te pregunta "Desea terminar el trabajo por lotes", escribe S y presiona Enter, o presiona Ctrl + C nuevamente).

2. Detener el Frontend
   - En Visual Studio Code, ve a la esquina inferior derecha.
   - Haz clic sobre el puerto que esta transmitiendo (ej. Port: 5500) para detener Live Server.

3. Apagar la Base de Datos
   - Ve al menu de Inicio de Windows.
   - Busca la carpeta de AppServ y haz clic en "Stop MySQL" (o Stop All Services).

-----------------------------------------------------------------
COMO PROBAR EL MODO OFFLINE
-----------------------------------------------------------------
1. Con la app corriendo, abre las Herramientas de Desarrollador en tu navegador (F12).
2. Ve a la pestana Network (Red) y cambia la conexion a "Offline".
3. Envia una evaluacion. Veras que se guarda en IndexedDB y el estado marca "Pendiente".
4. Regresa la conexion a "No throttling" (Online). La app detectara la red y sincronizara el registro automaticamente con MySQL.
