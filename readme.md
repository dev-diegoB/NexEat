# NexEat

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey?style=for-the-badge)

NexEat es una plataforma web integral diseñada para la gestión automatizada de pedidos y pagos en establecimientos de consumo. El sistema utiliza el escaneo de códigos QR para vincular mesas directamente con la cocina, eliminando intermediarios y optimizando el flujo de trabajo mediante el modelo de pago adelantado.

---

## Especificaciones Técnicas

* **Arquitectura:** MERN Stack (MongoDB, Express.js, React.js, Node.js).
* **Comunicación:** Protocolos WebSocket mediante **Socket.io** para actualizaciones en tiempo real.
* **Seguridad:** Autenticación vía **Google OAuth 2.0** y manejo de sesiones con **JSON Web Tokens (JWT)**.
* **Interfaz:** Diseño orientado a dispositivos móviles (**Mobile-First**) con optimización para redes de datos variables.

## Funcionalidades del Sistema

- [ ] **Identificación Dinámica:** Captura de identificadores de mesa a través de parámetros en URL.
- [ ] **Gestión de Catálogo:** Administración de productos con control de disponibilidad inmediata.
- [ ] **Pasarela de Pagos:** Integración de métodos de pago digitales con validación mediante Webhooks.
- [ ] **Monitor de Producción:** KDS (Kitchen Display System) para la gestión de estados de preparación.
- [ ] **Sistema de Fidelización:** Algoritmo de acumulación de puntos por transacciones confirmadas.

---

## Licencia

Este proyecto se encuentra bajo la licencia **Creative Commons Atribución-NoComercial-SinObraDerivada 4.0 Internacional (CC BY-NC-ND 4.0)**.

Para conocer los términos legales detallados, consulte el archivo [LICENSE](./LICENSE).

---
*Desarrollado como proyecto de ingeniería para optimización de servicios gastronómicos.*