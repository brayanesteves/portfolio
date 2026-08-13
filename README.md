# 🗡️ Brayan Esteves - Animus 1.28 Interactive Portfolio

[![Animus Theme](https://img.shields.io/badge/Interface-Animus%201.28-00f0ff.svg)](index.html)
[![Role](https://img.shields.io/badge/Role-Software%20Architect-0284c7.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Java%20%7C%20Clojure%20%7C%20Kafka%20%7C%20GCP%20%7C%20Web3-00d2ff.svg)](#)

Portfolio web interactivo y hoja de vida profesional de **Brayan Esteves**, diseñado y construido con la estética visual y experiencia inmersiva del **Animus 1.28 de Assassin's Creed 1**.

---

## 🌟 Características de la Interfaz Animus

- **🎨 Estética Animus 1.28 Luminous White & Abstergo Dark**: Paneles HUD translúcidos, corchetes tecnológicos (`[+]`), líneas de datos cian (`#00f0ff`) y alternador de modo oscuro.
- **🌌 Fondo Canvas 2D/3D Dinámico**: Motor de partículas con fragmentos geométricos de memoria, hilos de datos y nodos interactivos que responden al cursor.
- **🔊 Sintetizador Web Audio API**: Efectos de sonido futuristas nativos para hovers, clics y pulsos de sincronización sin archivos pesados externos.
- **💻 Consola Animus CLI (Terminal)**: Terminal interactiva accesible por botón HUD o atajo de teclado (`~`) con comandos `help`, `bio`, `skills`, `exp`, `projects`, `contact`, `theme` y `sync`.
- **📊 Bloques de Memoria Organizados**:
  - **Block 01 (Sujeto)**: Resumen profesional y métricas animadas (+11 Años Java, +100 Tópicos Kafka, +15 Plataformas Cloud).
  - **Block 02 (Matriz Neural)**: Matriz de habilidades con filtros en tiempo real y buscador instantáneo.
  - **Block 03 (Memorias)**: Cronología detallada de la trayectoria profesional.
  - **Block 04 (Arquitectura)**: Nodos y proyectos destacados (gRQL Engine, AWS Bedrock Contact Center, Monetae Web3).
  - **Block 05 (Protocolos)**: Formación académica y certificaciones.
  - **Block 06 (Canal Link)**: Acceso directo a redes y contacto (WhatsApp, Email, LinkedIn, GitHub, Torre.co).

---

## 🚀 Cómo Ejecutar Localmente

### Opción 1: Abrir directamente en el navegador
Puedes abrir el archivo [`index.html`](file:///c:/Users/PC/Documents/OWN-PROJECTS/portfolio/portfolio/index.html) haciendo doble clic o arrastrándolo a cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).

### Opción 2: Servidor de desarrollo local (Vite / Live Server / npx serve)
Para una experiencia óptima con recarga en vivo:

```bash
# Con npx serve
npx serve .

# O con python
python -m http.server 8000
```
Luego abre `http://localhost:8000` en tu navegador.

---

## 📁 Estructura del Proyecto

```
portfolio/
├── index.html                  # HTML5 Semántico con estructura Animus HUD
├── BrayanEsteves-HojaDeVida.md # Hoja de vida original en formato Markdown
├── css/
│   ├── animus-theme.css        # Sistema de diseño Animus (variables, HUD, animaciones)
│   └── components.css          # Estilos de tarjetas, consola CLI y timeline
├── js/
│   ├── animus-canvas.js        # Fondo animado 2D/3D con fragmentos y partículas
│   ├── animus-audio.js         # Sintetizador Web Audio API (efectos de sonido AC1)
│   ├── animus-console.js       # Consola interactiva CLI
│   └── app.js                  # Lógica de secuencia boot, filtros y navegación
└── assets/
    └── images/
        └── animus_avatar.jpg   # Retrato holográfico Animus del sujeto
```

---

## 👤 Información del Sujeto

- **Nombre:** Brayan Esteves
- **Especialidad:** Arquitecto de Software | Especialista Backend & Sistemas Distribuidos
- **Contacto:** [+584149904852](https://wa.me/584149904852) | [brayan.esteves93@gmail.com](mailto:brayan.esteves93@gmail.com)
- **LinkedIn:** [linkedin.com/in/brayanesteves93](https://www.linkedin.com/in/brayanesteves93)
- **GitHub:** [github.com/brayanesteves](https://github.com/brayanesteves)
