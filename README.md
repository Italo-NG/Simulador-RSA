# Simulador RSA

Aplicación web educativa que muestra paso a paso cómo funciona el cifrado RSA: validación de números primos, cálculo de claves y cifrado/descifrado de un mensaje carácter por carácter.

Proyecto de la asignatura Matemática Computacional.

## Descripción

El usuario escribe un mensaje y dos números primos (`p` y `q`). La aplicación valida los datos, calcula las claves pública y privada y cifra el mensaje mostrando cada paso del algoritmo con una interfaz interactiva.

Toda la lógica matemática de RSA está en el backend (Python). El frontend (HTML, CSS y JavaScript puro) solo se encarga de la interfaz y de pedir los resultados al backend por HTTP.

Es un proyecto didáctico: usa primos pequeños y no debe usarse como cifrado seguro real.

## Tecnologías

- Frontend: HTML, CSS y JavaScript puro (ES Modules). CSS modular en la carpeta `css/`.
- Backend: Python 3 con FastAPI, servido por Uvicorn. Validación de datos con Pydantic.

## Requisitos

- Python 3.10 o superior.
- Un navegador moderno.
- Visual Studio Code con la extensión Live Server (recomendado para abrir el frontend).

## Instalación y ejecución

Desde la raíz del proyecto:

1. Crear y activar el entorno virtual:

```bash
python -m venv .venv
.venv\Scripts\activate
```

En macOS o Linux: `source .venv/bin/activate`

2. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

3. Levantar el backend (dejar la terminal abierta mientras se use la app):

```bash
uvicorn backend.main:app --reload
```

Queda disponible en `http://127.0.0.1:8000`, con documentación interactiva en `/docs`.

4. Abrir el frontend: clic derecho en `index.html` y "Open with Live Server". El proyecto usa ES Modules, por lo que abrirlo con doble clic (`file://`) puede no cargar el JavaScript.

## Uso

1. Escribe el mensaje en la barra central.
2. Ingresa los dos primos `p` y `q` (indican en vivo si el número es primo).
3. Pulsa la flecha para empezar a cifrar.
4. Avanza con Atrás y Siguiente por cada paso: comprobar primos, calcular `n` y `φ(n)`, elegir la clave `d`, calcular `e`, ver las claves y cifrar letra por letra.
5. El botón Descifrar comprueba que el texto original se recupera.

## API

Base: `http://127.0.0.1:8000` (documentación en `/docs`).

- `POST /api/validarNumerosPrimo`: comprueba si `p` y `q` son primos.
- `POST /api/calcularDatosRSA`: calcula `n`, `φ(n)`, las claves y los pasos.
- `POST /api/cifrarMensajeRSA`: calcula las claves y cifra/descifra el mensaje. Es el que usa el frontend.

## Limitaciones

- No es criptografía segura; es un simulador con fines didácticos y usa primos pequeños.
- Con primos muy pequeños (por ejemplo 2 y 3) no existe un `d` válido y no se puede cifrar.
- Los caracteres con código mayor o igual que `n` (acentos, emojis) pueden no recuperarse al descifrar; conviene usar primos más grandes para esos textos.
