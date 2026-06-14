# Simulador RSA

Aplicación web educativa que muestra, **paso a paso**, cómo funciona el algoritmo de cifrado **RSA**: validación de números primos, cálculo de claves y cifrado/descifrado de un mensaje letra por letra.

> Proyecto de la asignatura **Matemática Computacional**.

---

## Descripción breve

El usuario escribe un mensaje y dos números primos (`p` y `q`). La aplicación valida los datos, calcula las claves pública y privada, y cifra el mensaje mostrando cada paso del algoritmo con una interfaz visual e interactiva.

**Toda la lógica matemática de RSA vive en el backend (Python).** El frontend (HTML/CSS/JS) solo se encarga de la interfaz y de pedir los resultados al backend mediante peticiones HTTP.

---

## Objetivo educativo

Ayudar a entender de forma visual y práctica:

- Qué es un número primo y por qué RSA los necesita.
- Cómo se calculan `n` y `φ(n)`.
- Cómo se eligen las claves `d` (privada) y `e` (pública).
- Cómo se cifra y descifra un mensaje carácter por carácter.

> Es un proyecto **didáctico**: usa números primos pequeños y **no** debe usarse como cifrado seguro real.

---

## Tecnologías usadas

| Capa | Tecnología |
|------|------------|
| Frontend | HTML, CSS y JavaScript puro (ES Modules) |
| Backend | Python 3 + FastAPI |
| Servidor | Uvicorn (servidor ASGI) |
| Validación de datos | Pydantic |

---

## Estructura del proyecto

```
ProyectoMateComputacional/
│
├── index.html                  # Página principal (interfaz del simulador)
├── styles.css                  # Estilos visuales
│
├── js/                         # Frontend (sin lógica RSA: interfaz + llamadas)
│   ├── config.js               # URL del backend
│   ├── api.js                  # Peticiones fetch al backend
│   ├── estado.js               # Estado de la aplicación
│   ├── dom.js                  # Referencias y utilidades del DOM
│   ├── validaciones.js         # Validaciones de entrada en el navegador
│   ├── animaciones.js          # Animaciones (ola de mar, etc.)
│   ├── renderPasos.js          # Dibuja el recorrido paso a paso
│   ├── renderResultados.js     # Dibuja los resultados
│   └── main.js                 # Punto de entrada del frontend
│
├── backend/                    # Backend (Python / FastAPI) — TODA la lógica RSA
│   ├── main.py                 # App FastAPI, CORS y registro de rutas
│   ├── api/
│   │   └── rutas_rsa.py        # Definición de los 3 endpoints
│   ├── modelos/
│   │   └── solicitudes.py      # Modelos de entrada (Pydantic)
│   ├── rsa/                     # Lógica del algoritmo RSA
│   │   ├── procesarRSA.py      # Calcula n y φ(n)
│   │   ├── validarRSA.py       # Valida que p y q sirvan para RSA
│   │   ├── generarClavesRSA.py # Genera posibles d, e y las claves
│   │   ├── calcularRSA.py      # Orquesta el cálculo completo y los pasos
│   │   └── cifrarMensajeRSA.py # Cifra y descifra el mensaje
│   └── validarNumeroPrimo/     # Validación de números primos
│       ├── procesarNumero.py   # Comprueba si un número es primo
│       └── validarNumero.py    # Valida p y q juntos
│
├── requirements.txt            # Dependencias del backend
├── .gitignore
└── README.md
```

---

## Requisitos previos

- **Python 3.10 o superior** instalado ([python.org](https://www.python.org/)).
- Un navegador web moderno (Chrome, Edge o Firefox).
- **Visual Studio Code** con la extensión **Live Server** (recomendado para abrir el frontend).
- Conexión a internet solo la primera vez (para instalar las dependencias).

> Para comprobar tu versión de Python: `python --version`

---

## Instalación

Desde la carpeta raíz del proyecto:

**1. Crear el entorno virtual**

```bash
python -m venv .venv
```

**2. Activar el entorno virtual** (Windows)

```bash
.venv\Scripts\activate
```

Debe aparecer `(.venv)` al inicio de la línea de la terminal.

> En macOS o Linux: `source .venv/bin/activate`

**3. Instalar las dependencias**

```bash
pip install -r requirements.txt
```

---

## ▶Ejecución del backend

Con el entorno virtual activado y desde la **raíz del proyecto**:

```bash
uvicorn backend.main:app --reload
```

Si todo va bien verás algo como:

```text
Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

- **No cierres esta terminal** mientras uses la aplicación.
- Documentación automática de la API (opcional): http://127.0.0.1:8000/docs

---

## Ejecución del frontend

Con el backend ya en marcha, abre el frontend de una de estas formas:

**Opción recomendada — Live Server (VS Code):**

1. Haz clic derecho sobre `index.html`.
2. Selecciona **"Open with Live Server"**.
3. Se abrirá en el navegador (por ejemplo `http://127.0.0.1:5500`).

**Opción alternativa — abrir el archivo directamente:**

Puedes intentar abrir `index.html` con doble clic, **pero puede no funcionar**: el proyecto usa *ES Modules* y muchos navegadores bloquean su carga desde `file://`. Si la página se ve pero no responde, usa Live Server.

### Cómo usar el simulador

1. Escribe el mensaje en la barra central tipo chat.
2. Ingresa los dos primos `p` y `q` en las burbujas (indican en vivo si el número es primo).
3. Pulsa la flecha **Empezar a cifrar**.
4. Avanza con **Atrás / Siguiente** por cada paso: comprobar primos → calcular `n` y `φ(n)` → **elegir tú la clave `d`** → calcular `e` → ver las claves → cifrar letra por letra.
5. El botón **Descifrar** comprueba que el texto original se recupera.

---

## Endpoints disponibles

Base: `http://127.0.0.1:8000`

### `POST /api/validarNumerosPrimo`

Comprueba si `p` y `q` son primos.

Cuerpo (request):

```json
{ "primerNumero": 11, "segundoNumero": 17 }
```

Respuesta (ejemplo):

```json
{
  "primerNumero": 11,
  "segundoNumero": 17,
  "primerNumeroEsPrimo": true,
  "segundoNumeroEsPrimo": true,
  "ambosSonPrimos": true,
  "mensaje": "11 y 17 son numeros primos."
}
```

### `POST /api/calcularDatosRSA`

Valida y calcula `n`, `φ(n)`, los posibles `d`, las claves y los pasos.

Cuerpo (request):

```json
{ "primerNumero": 11, "segundoNumero": 17 }
```

Respuesta (campos principales): `procesoCorrecto`, `mensaje`, `n`, `phi`, `posiblesD`, `d`, `e`, `clavePublica`, `clavePrivada`, `pasos`, `validacion`.

### `POST /api/cifrarMensajeRSA`

Calcula las claves y cifra/descifra el mensaje. **Es el endpoint que usa el frontend.**

Cuerpo (request) — `d` es opcional:

```json
{ "primerNumero": 11, "segundoNumero": 17, "mensaje": "hola", "d": null }
```

Respuesta (campos principales): `procesoCorrecto`, `mensaje`, `datosRSA`, `textoOriginal`, `numerosCifrados`, `textoDescifrado`, `advertencia`.

> Puedes probar los tres endpoints de forma interactiva en http://127.0.0.1:8000/docs

---

## Notas importantes

- **Toda la lógica RSA está en el backend.** El frontend solo dibuja la interfaz y pide resultados por HTTP.
- El frontend usa `/api/cifrarMensajeRSA`, que internamente ya valida los números y calcula las claves.
- CORS está abierto (`allow_origins=["*"]`) para facilitar las pruebas en local; no es una configuración pensada para producción.
- FastAPI ofrece documentación automática en `/docs` y `/redoc`.
- Si eliges tú la clave `d`, el backend recalcula `e` y vuelve a cifrar con esa elección.

---

## Limitaciones conocidas

- **No es criptografía segura.** Es un simulador con fines didácticos; usa primos pequeños.
- Abrir `index.html` con doble clic (`file://`) puede no cargar el JavaScript por usar *ES Modules*: usa **Live Server**.
- Con primos muy pequeños (por ejemplo `2` y `3`) no se puede cifrar porque no existe un `d` válido.
- Los caracteres cuyo código sea mayor o igual que `n` (acentos, emojis…) pueden no recuperarse al descifrar; el backend muestra una **advertencia**. Usa primos más grandes para esos textos.
- El mensaje se cifra **carácter por carácter** (no por bloques), para que el proceso sea fácil de seguir.
