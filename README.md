# Cómo ejecutar el proyecto

## 1. Abrir el proyecto

Abrir la carpeta del proyecto en Visual Studio Code.

## 2. Crear el entorno virtual

En la terminal, ejecutar:

```bash
python -m venv .venv
```

## 3. Activar el entorno virtual

En Windows:

```bash
.venv\Scripts\activate
```

Debe aparecer `(.venv)` al inicio de la terminal.

## 4. Instalar dependencias

Ejecutar:

```bash
pip install -r dependencias.txt
```

## 5. Ejecutar el servidor local

Desde la raíz del proyecto, ejecutar:

```bash
uvicorn backend.main:app --reload
```

Debe aparecer una dirección similar a:

```text
http://127.0.0.1:8000
```

No cerrar esta terminal mientras se usa el proyecto.

## 6. Abrir la página

Abrir el archivo:

```text
index.html
```

Puede abrirse directamente con doble clic o usando Live Server en Visual Studio Code.

## 7. Probar el sistema

Ingresar dos números primos, por ejemplo:

```text
Primer número: 11
Segundo número: 17
```

Presionar:

```text
Continuar
```

El sistema mostrará los cálculos básicos de RSA.
