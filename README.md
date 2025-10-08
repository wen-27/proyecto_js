# 🏨 Hotel el Rincón del Carmen - Sistema de Reservaciones

## ✨ Descripción

El Hotel **el Rincón del Carmen** quiere tener presencia en la web mediante un sitio **sencillo, agradable y funcional** que permita a los clientes explorar sus servicios y realizar reservaciones de manera fácil y rápida.  

Este proyecto consiste en desarrollar un **sitio web interactivo** donde:  
- Los usuarios pueden consultar disponibilidad, reservar habitaciones y gestionar sus reservas.  
- Los administradores pueden gestionar habitaciones y reservas eficientemente.  

---

## 📌 Requerimientos

### 🌐 Sitio Web

- Diseño **sencillo, agradable y funcional**, visualmente atractivo.  
- Optimizado para **dispositivos móviles**.  
- Debe incluir al menos **3 páginas principales**:

1. **Inicio (Landing Page)**  
   - 🛏️ Carrusel de habitaciones.  
   - 🏊‍♀️ Presentación de áreas del hotel y servicios: spa, comidas, zonas húmedas.

2. **Disponibilidad y Reservas**  
   - 📅 Formulario para fechas y número de personas.  
   - 🏨 Lista de habitaciones disponibles según filtros.  
   - ℹ️ Detalles de la habitación: camas, servicios incluidos (internet, minibar, jacuzzi, etc.), precio, capacidad y fechas disponibles.  
   - ✅ Opción de **realizar reserva** solo para usuarios registrados.

3. **Contacto**  
   - 📍 Ubicación y dirección del hotel.  
   - 📞 Formas de contacto.

- **Usuarios registrados**: solo pueden hacer reservas o cancelaciones.  
  - Registro requerido: 🆔 Número de identificación, 👤 Nombre completo, 🌎 Nacionalidad, ✉️ Email, 📱 Teléfono y 🔒 Contraseña.  
- ✅ El sistema verifica que la habitación siga disponible antes de confirmar la reserva.  
- ❌ Las cancelaciones liberan la habitación automáticamente.

---

### 🛠️ Panel de Gestión (Administradores)

- Gestionar habitaciones:  
  - 🛏️ Cantidad de camas  
  - 👥 Número máximo de personas  
  - 💰 Precio por noche  
  - 🧴 Servicios incluidos  
- Gestionar reservas: modificar o cancelar cualquier reserva.  
- Interfaz clara que distingue **usuarios normales** de **administradores**.

---

### ⚠️ Consideraciones Adicionales

- Una **reserva cancelada** libera automáticamente la habitación.  
- Evitar **solapamiento de reservas** (una habitación no puede reservarse en el mismo rango de fechas por diferentes clientes).

---

## 💻 Tecnologías Utilizadas

- **HTML5 & CSS3**: Estructura y diseño responsivo.  
- **JavaScript (ES6+)**: Lógica de negocio y gestión de datos.  
- **Web Components (Vanilla JS)**: Modularización y reutilización de código.  
- **SweetAlert2**: Notificaciones visuales.  
- **LocalStorage**: Simulación de almacenamiento de usuarios, habitaciones y reservas.  

> ⚠️ Nota: Todo el funcionamiento es **simulado con LocalStorage**, no hay persistencia en servidor.

---

## 🚀 Funcionalidades Clave

### 👤 Usuarios normales
- Registro e inicio de sesión.  
- Consultar disponibilidad de habitaciones.  
- Realizar y cancelar reservas propias.

### 🧑‍💼 Usuarios administradores
- Agregar, editar y gestionar habitaciones.  
- Visualizar todas las reservas.  
- Modificar o cancelar cualquier reserva.

### 🔒 Validaciones y seguridad básica
- Verificación de disponibilidad antes de confirmar reservas.  
- Prevención de solapamiento de reservas.  
- Notificaciones visuales con **SweetAlert2**.

---

## ⚡ Cómo Ejecutar

1. Clonar el repositorio:
```bash
git clone https://github.com/wen-27/proyecto_js.git
````
2. Abrir en un servidor local o desplegar en Netlify:
```bash
netlify http://elrincondelcarmen.netlify.app/
```
## autora 

- wendy angelica vega sanchez 