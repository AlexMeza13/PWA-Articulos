# 📚 Sistema Editorial PWA (Offline-First)

Una Aplicación Web Progresiva (PWA) diseñada para gestionar el flujo de revisión de artículos científicos y editoriales. Construida con una arquitectura **Offline-First**, permite a los usuarios interactuar con el sistema, leer historiales y emitir evaluaciones incluso sin conexión a internet, sincronizando los datos automáticamente al recuperar la red.

---

## 🛠️ Tecnologías y Arquitectura

Este proyecto está construido bajo una arquitectura de cliente-servidor con capacidades de persistencia local en el navegador:

* **Frontend:** HTML5, CSS3 (Diseño responsivo y tema oscuro/morado) y Vanilla JavaScript.
* **Backend:** Node.js con Express.js.
* **Base de Datos Central:** MySQL.
* **Almacenamiento Local (PWA):**
    * **Cache Storage (App Shell):** Almacena la interfaz visual para cargas instantáneas.
    * **Cache Storage (Dinámico):** Intercepta peticiones `GET` (Network First) para permitir la lectura de historiales sin internet.
    * **IndexedDB:** Almacena peticiones `POST` (evaluaciones del Revisor) cuando no hay red, actuando como una cola de sincronización.
* **Gestión de Archivos:** Middleware `Multer` para la subida de documentos pesados (PDF, DOCX) mediante `FormData`.

---

## 👥 Componentes y Roles del Sistema

El sistema se divide en tres flujos de trabajo principales:

1.  **Portal del Autor:**
    * Permite subir documentos físicos pesados al servidor.
    * Muestra una tabla dinámica con el estado en tiempo real de sus envíos y los comentarios del comité.
    * *Capacidad Offline:* Puede consultar su historial de envíos sin conexión.
2.  **Portal del Revisor:**
    * Consume la lista de artículos con estado "Enviado".
    * Permite asignar una calificación (1-10), un veredicto y comentarios detallados.
    * *Capacidad Offline:* **Resiliencia total.** Puede ver los artículos pendientes, evaluarlos y guardar su decisión localmente sin internet. El sistema auto-sincronizará los datos al detectar conexión.
3.  **Panel del Editor:**
    * Dashboard maestro que consolida la información mediante consultas SQL relacionales (`LEFT JOIN`).
    * Muestra el ID, nombre del documento, fecha, estado, calificación y comentarios de todos los artículos ingresados al sistema.
    * *Capacidad Offline:* Puede consultar el panel de control y el estado de los artículos sin conexión.

---

## ⚙️ Requisitos Previos e Instalación

Para ejecutar este proyecto en un entorno local, necesitas tener instalado:
* [Node.js](https://nodejs.org/) (Incluye NPM).
* Un servidor local de MySQL (como [XAMPP](https://www.apachefriends.org/), MAMP o WAMP).
* Extensión *Live Server* en Visual Studio Code (opcional, para el frontend).

### Pasos de Instalación:

1.  **Clonar el proyecto:** Descarga o clona este repositorio en tu máquina local.
2.  **Instalar dependencias del Backend:** Abre una terminal en la carpeta del proyecto y ejecuta:
    ```bash
    npm install express cors multer mysql2
    ```
3.  **Configurar la Base de Datos:**
    * Abre tu gestor de MySQL (ej. phpMyAdmin) y crea una base de datos llamada `sistema_editorial`.
    * El sistema requiere dos tablas principales: `articulos` y `evaluaciones` (conectadas por llave foránea `articulo_id`).
4.  **Crear directorio de archivos:** Asegúrate de que exista una carpeta llamada `uploads` en la raíz de tu backend para que Multer guarde los PDFs.

---

## 🚀 Cómo ejecutar y probar el sistema

### 1. Iniciar el entorno
* Enciende tu base de datos MySQL (desde el panel de control de XAMPP, por ejemplo).
* Abre una terminal en la carpeta del proyecto y arranca el backend:
    ```bash
    node server.js
    ```
    *(Verás el mensaje: `🚀 Servidor backend corriendo en http://localhost:3000` y `✅ Conectado a la base de datos MySQL`).*
* Abre el archivo `index.html` en tu navegador (se recomienda usar *Live Server* en el puerto 5500).

### 2. Guía de Pruebas Offline (Simulacro de caída de red)

Para comprobar el verdadero poder de la PWA, sigue esta secuencia técnica:

1.  **Caché inicial (Con internet):** Navega por los tres portales (Autor, Revisor, Editor) con el servidor Node encendido. El Service Worker registrará la interfaz y los datos de las tablas en segundo plano.
2.  **El Apagón:** Abre la terminal donde corre Node.js y presiona `Ctrl + C` para apagar el servidor. (O usa las herramientas de desarrollo del navegador `F12 > Network > Offline`).
3.  **Lectura Offline:** Recarga (`F5`) cualquiera de los tres portales. Notarás que la página carga a la perfección y las tablas de datos (historiales y pendientes) se muestran usando el caché dinámico.
4.  **Escritura Offline:** Entra al portal del Revisor, selecciona un artículo y envíale una calificación. El sistema te notificará que ha guardado la evaluación localmente (en IndexedDB).
5.  **Reconexión Mágica:** Vuelve a encender el servidor Node (`node server.js`) y reconecta tu navegador. Al instante, el sistema detectará la red y sincronizará la evaluación almacenada hacia MySQL automáticamente.