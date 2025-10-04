# Tareas para mejorar la navegación y control de acceso en la aplicación

## 1. Página principal siempre activa como "Inicio"
- Asegurar que al cargar la aplicación, la página activa sea siempre la sección "inicio".
- Ajustar la lógica de navegación para que no se muestre otra sección como principal por defecto.

## 2. Control de acceso a la página de reservas
- Implementar verificación para detectar si el usuario está logueado antes de permitir acciones de reserva.
- Si el usuario no está logueado y quiere reservar una sala, redirigirlo automáticamente a la página de login.
- Mostrar un mensaje claro indicando que debe iniciar sesión para poder reservar.

## 3. Mejoras adicionales
- Revisar y asegurar que la navegación entre secciones (login, registro, inicio, reservas, contacto) funcione sin cambiar el hash en la URL que cause recarga o navegación no deseada.
- Validar que los formularios de login y registro se muestren correctamente al cambiar entre pestañas.
- Confirmar que el estado de sesión se mantenga correctamente y se utilice para controlar el acceso a funcionalidades restringidas.

## 4. Pruebas recomendadas
- Probar la carga inicial de la aplicación y verificar que la sección "inicio" sea la activa.
- Probar la navegación entre login y registro, asegurando que los formularios se muestren correctamente sin cambiar la URL.
- Probar el flujo de reserva intentando reservar sin estar logueado y verificar que redirige a login.
- Probar el login y luego intentar reservar para confirmar que se permite el acceso.
- Probar la persistencia de sesión y comportamiento al recargar la página.

Por favor, confirma si quieres que proceda con la implementación de estas tareas o si deseas agregar/modificar algo en el plan.
