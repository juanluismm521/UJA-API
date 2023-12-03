# UJA API

API para mostrar los datos de la Universidad de Jaén (UJA). Esta API requiere el envío de credenciales de usuario y contraseña para acceder a la información.

## Funcionalidades

La API proporciona acceso a los siguientes datos de la plataforma Platea de la UJA:

- Nombre del usuario
- Dirección de correo electrónico
- Fotografía del perfil
- Lista de cursos en la plataforma Platea

## Uso

Para utilizar esta API, se debe realizar una solicitud POST al endpoint `/login` con las credenciales de usuario y contraseña en el cuerpo de la solicitud. Esto iniciará sesión en la plataforma UJA y devolverá los datos del usuario.

### Endpoint: `/login`

- **Método**: POST
- **Parámetros del cuerpo (Body)**:
  - `usuario`: Nombre de usuario para acceder a la UJA
  - `clave`: Contraseña del usuario

#### Ejemplo de solicitud:

```http
POST /login
Content-Type: application/json

{
  "usuario": "nombre_de_usuario",
  "clave": "tu_contraseña_segura"
}
```

### Respuesta exitosa:

Si las credenciales son válidas y la autenticación es exitosa, la API devolverá un objeto JSON con los datos del usuario:

```json
{
  "nombre": "Nombre del Usuario",
  "email": "usuario@ujaen.es",
  "foto": "URL_de_la_foto",
  "cursos": [
    "Curso 1",
    "Curso 2",
    "Curso 3"
  ]
}
```

### Respuesta de error:

Si hay algún problema durante el proceso de inicio de sesión o autenticación, la API devolverá un mensaje de error junto con el correspondiente código de estado HTTP.

## Tecnologías utilizadas

- Node.js
- Express
- Puppeteer (para realizar el scrapping en la plataforma Platea)
- Otros paquetes de JavaScript según sea necesario

## Requisitos

Antes de usar la API, se necesitan los siguientes requisitos:

- Node.js instalado
- Credenciales válidas de la UJA (usuario y contraseña)

## Instalación

1. Clona este repositorio: `git clone https://github.com/tu_usuario/tu-repositorio.git`
2. Instala las dependencias: `npm install`
3. Inicia el servidor: `npm start`

## Contribución

Siéntete libre de contribuir a este proyecto. Puedes abrir un issue para reportar problemas o proponer mejoras. Además, las solicitudes de extracción son bienvenidas.

## Licencia

Este proyecto está bajo la Licencia [MIT](https://opensource.org/licenses/MIT).
```

