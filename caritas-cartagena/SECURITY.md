# Seguridad y preparación para producción

## Alcance actual

Este prototipo es contenido estático ejecutado en el navegador. Incluye un editor local que guarda en `localStorage` y reduce fotos seleccionadas con `canvas`; no autentica usuarios ni publica en servidor. No procesa pagos, no recibe formularios ni se conecta a una API. Cualquier persona con acceso al mismo navegador puede usar el editor. Por ello, las protecciones de backend descritas en el encargo **no pueden considerarse implementadas ni verificadas por esta entrega**.

Riesgos actuales: contenido institucional que todavía debe validarse; dependencias de disponibilidad/privacidad de imágenes y Google Fonts de terceros; enlaces externos susceptibles de cambiar; cambios locales no publicados; y ausencia de encabezados HTTP, dominio, política de privacidad y proceso de despliegue definidos.

## Modelo de amenazas inicial (STRIDE)

| Activo / frontera | Amenaza | Ejemplo | Control para la siguiente fase |
|---|---|---|---|
| Publicación editorial / CMS | Suplantación, elevación de privilegios | Cuenta editorial robada o editor administrando usuarios | MFA para administradores; roles separados; autorización en servidor; recuperación robusta; auditoría y revisión periódica de cuentas |
| Contenido renderizado | Manipulación, XSS | Texto editorial o URL hostil ejecutada en navegador | Sanitización/validación al guardar; escape contextual al renderizar; editor sin HTML arbitrario; CSP ajustada |
| Visitante y formulario futuro | Repudio, abuso, denegación de servicio | Spam, envío repetido, inyección | Esquema del lado servidor; límites de frecuencia; controles antiabuso; logs mínimos; mensajes de error seguros |
| Archivos de medios | Código malicioso, exposición | SVG/archivo polimórfico o foto con metadatos sensibles | Lista de tipos real, límites; análisis; renombrado; almacenamiento aislado; quitar metadatos cuando aplique |
| Datos de contacto | Divulgación | Exposición de solicitudes o base de datos | Minimización; plazos de retención; acceso restringido; cifrado; procedimiento de atención y eliminación |
| Pagos externos | Manipulación o filtración financiera | Captura de datos de tarjeta en un formulario propio | Derivar al procesador oficial; no almacenar datos de tarjeta; revisar enlaces y contratos del proveedor |
| Operación/infraestructura | Alteración, indisponibilidad, pérdida | Dependencia comprometida, mala configuración o borrado | Actualizaciones; revisión de dependencias; copias aisladas y cifradas; pruebas de restauración; plan de incidentes |
| Terceros del frontend | Seguimiento o recurso comprometido | Fuentes e imágenes externas | Sustituir por assets aprobados/alojados bajo control institucional o documentar proveedor; limitar hosts mediante CSP; revisar privacidad/licencias |

## Controles recomendados

### Aplicables al prototipo al alojarlo

- HTTPS obligatorio, redirección HTTP a HTTPS y HSTS únicamente cuando todo el dominio esté preparado.
- Encabezados: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva y `frame-ancestors 'none'` en CSP.
- CSP base sugerida **a adaptar y probar**: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com data:; upgrade-insecure-requests`. Las imágenes de Unsplash deberían migrarse o someterse a revisión antes de endurecer `img-src`. No habilitar `unsafe-eval`; evitar `unsafe-inline` con CSS/JS inline.
- No activar CORS si no hay API. Si se crea una API, usar lista explícita de orígenes, métodos y encabezados necesarios.
- Revisar enlaces externos antes de publicación y mantener `rel="noopener noreferrer"` en pestañas nuevas.

### CMS/API futuros

- Validar los datos en servidor con esquema y límites; parametrizar consultas; codificar la salida para el contexto; rechazar campos inesperados.
- Separar roles visitante, editor y administrador. Autorizar cada operación en servidor, aunque el botón esté oculto en interfaz. Editores no gestionan usuarios ni configuración.
- MFA para administradores, cookies `Secure`, `HttpOnly`, `SameSite`, renovación y expiración de sesión, protección CSRF si aplica, limitación de intentos y recuperación con tokens de un solo uso y caducidad.
- Hash de contraseñas con Argon2id (o algoritmo mantenido recomendado por el stack). Nunca guardar contraseñas, tokens de recuperación o secretos en texto plano ni en logs.
- CSRF, límites de solicitudes y antispam en formularios; validación MIME por contenido y tamaño en archivos; almacenamiento privado fuera del webroot o en bucket con políticas mínimas.
- Secretos en gestor de secretos/variables del entorno de servidor; no incluirlos en cliente, repositorio ni artefactos públicos.
- Logs de cambios administrativos y eventos de seguridad con retención definida; excluir contraseñas, tokens y datos personales que no hagan falta.
- Dependencias bloqueadas y actualizadas; escaneo de vulnerabilidades en CI; parcheo acordado; entornos separados de desarrollo, pruebas y producción.
- Backups cifrados, acceso independiente y pruebas de restauración; procedimiento de incidentes y recuperación con responsables asignados.
- Evaluación jurídica institucional sobre protección de datos personales y privacidad en Colombia antes de recoger cualquier dato.

## Verificaciones pendientes antes de publicar

- [ ] Dominio, proveedor, HTTPS y encabezados revisados en el entorno real.
- [ ] Marca, textos, enlaces, fotos, derechos y consentimiento aprobados.
- [ ] URL de política de tratamiento de datos aprobada y visible.
- [ ] Pruebas de teclado, lector de pantalla, contraste, zoom y dispositivos móviles; objetivo WCAG 2.2 AA evaluado con herramientas y revisión manual.
- [ ] Metadatos sociales/SEO, sitemap y dominio canónico adaptados al dominio real.
- [ ] Si se añade CMS: permisos, autenticación, flujos de publicación, auditoría y restauración comprobados.
- [ ] Sustituir el editor local por un CMS autenticado antes de ofrecer administración en un sitio público.
- [ ] Si se añaden formularios o integraciones: revisión de privacidad, pruebas de seguridad y límites verificados.
- [ ] Evidencia de controles y riesgos residuales documentada. No afirmar que el sistema es invulnerable.

Este documento es un punto de partida de ingeniería, no una auditoría, certificación ASVS, revisión jurídica ni prueba de penetración.
