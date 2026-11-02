# Cáritas · Arquidiócesis de Cartagena

## Iniciar el sitio y el administrador

1. Extrae el archivo y abre en VS Code la carpeta `caritas-cartagena` que contiene `server.py`, `index.html` y `login.html`.
2. Haz doble clic en `iniciar-sitio.bat`, o ejecuta `py server.py` en la terminal de VS Code situada en esa carpeta.
3. Mantén la ventana abierta. El iniciador abre la portada automáticamente.

- Sitio público: http://127.0.0.1:8000/
- Acceso al administrador: http://127.0.0.1:8000/login.html

No uses `py -m http.server`: sirve solo archivos y no activa la API que necesita el acceso administrativo. Si la carpeta extraída contiene una carpeta interior `caritas-cartagena`, abre esa carpeta interior como raíz del proyecto.

## Personalizar la apariencia

Entra al administrador y abre **Diseño y apariencia**. Cada zona tiene controles independientes para fondo, texto, acento, bordes, tipografía y tamaños. La vista previa permite revisar escritorio y móvil; los cambios se aplican al sitio al pulsar **Guardar cambios**. Usa **Restaurar estilos iniciales** para descartar solo los cambios visuales.

