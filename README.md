# Manual de Operacion y Verificacion Tecnica - PWA Editorial

Este documento proporciona las instrucciones necesarias para ejecutar y validar el funcionamiento del sistema de gestion de articulos academicos desarrollado bajo la metodologia ISA/IA. El sistema esta diseñado para permitir a revisores, como la Dra. Mariela Hinojoza, trabajar de forma offline y sincronizar sus evaluaciones posteriormente.

## Archivos Necesarios (Incluidos en el repositorio)

Para el correcto funcionamiento de la Progressive Web App (PWA), asegurese de tener los siguientes archivos en el mismo directorio raiz:

* index.html: Estructura de la interfaz de usuario.

* style.css: Hoja de estilos para el diseño responsivo.

* app.js: Logica de negocio, gestion de eventos de red y persistencia en IndexedDB.

* sw.js: Service Worker encargado del almacenamiento en cache y funcionamiento offline.

* manifest.json: Metadatos para permitir la instalacion de la aplicacion.


## Instrucciones de Ejecucion
Debido a que los Service Workers requieren un contexto seguro para funcionar, es obligatorio utilizar un servidor local.
1. Abra la carpeta del proyecto en un editor de codigo como VS Code.
2. Utilice una extension de servidor local como Live Server.
3. Haga clic derecho en index.html y seleccione Open with Live Server.
4. La aplicacion se ejecutara en su navegador predeterminado (Opera GX, Chrome o Edge) bajo la direccion [http://127.0.0.1:5500](https://www.google.com/search?q=http://127.0.0.1:5500).

## Instalacion como Aplicacion
Para habilitar la experiencia completa de PWA y que la aplicacion aparezca en su escritorio o menu de inicio:
1. En la barra de direcciones del navegador, localice el icono de instalacion (generalmente un simbolo de suma o una computadora con flecha).
2. Haga clic en Instalar.
3. La aplicacion ahora se ejecutara en una ventana independiente sin las barras de navegacion del explorador.

## Verificacion en Modo Desarrollador (Chromium)
Para confirmar que los datos se estan guardando correctamente en la capa de persistencia local sin depender de internet:
1. Acceso a Herramientas: Presione la tecla F12 o utilice el atajo Ctrl + Shift + I.
2. Pestaña de Aplicacion: En el menu superior de la consola, busque la pestaña denominada Application (Aplicacion). Si no es visible, haga clic en el icono de flechas dobles (>>) para ver las opciones ocultas.
3. Inspeccion de IndexedDB:
* En el panel izquierdo, localice la seccion Storage (Almacenamiento).
* Despliegue la opcion IndexedDB.
* Haga clic en EditorialDB y seleccione el almacen de objetos evaluaciones.
