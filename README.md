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
pip install -r requirements.txt
```

El archivo `dependencias.txt` se conserva como referencia anterior, pero para ejecutar el proyecto se recomienda usar `requirements.txt`.

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

1. Escribir el mensaje a cifrar en la barra tipo chat del centro.
2. Ingresar los dos números primos en las burbujas (indican en vivo si el número es primo), por ejemplo:

```text
Primer primo p: 11
Segundo primo q: 17
```

3. Pulsar la flecha (**Empezar a cifrar**). Una ola de mar cubre la pantalla y deja visible solo el resultado.
4. Seguir el recorrido guiado paso a paso (Atrás / Siguiente): comprobar primos, calcular `n` y `φ(n)`, **elegir tú la clave `d`**, calcular `e`, ver las claves pública/privada y cifrar el mensaje letra por letra. El botón **Descifrar** comprueba que el texto se recupera.

Casos recomendados para probar:

- `p = 11`, `q = 17`, mensaje `hola`: debe cifrar y descifrar correctamente.
- `p = 10`, `q = 17`: debe indicar que ambos numeros deben ser primos.
- `p = 2`, `q = 2`: debe indicar que los primos deben ser distintos.
- `p = 2`, `q = 3`: debe indicar que son primos demasiado pequenos para RSA.
