# JWT Auth API – README

## 📌 Descripción
Este proyecto implementa una API REST sencilla en **Node.js + Express** que permite:

- Autenticación mediante usuario/contraseña mock.  
- Generación de **JWT** firmados con HS256.  
- Validación de tokens para acceder a rutas protegidas.  
- Uso de un archivo `config.json` equivalente a `appsettings.json`.

Es ideal para trabajos técnicos o proyectos educativos donde se requiere demostrar el uso de JWT sin OAuth.

---

## 📂 Estructura del Proyecto

```
/project
│
├── controllers
│ └── authController.js
│
├── middleware
│ └── authMiddleware.js
│
├── models
│ └── user.js
│
├── routes
│ └── authRoutes.js
│ └── protected.js
│
├── server.js
```

---

## 🚀 Instalación

### 1️⃣ Clonar el repositorio
```bash
git clone <url-del-repo>
cd Seguridad-JWT
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar la clave JWT y valores de Auth0
- Crear un archivo .env en la raiz del proyecto y agregarle estos valores

```bash
  AUTH0_DOMAIN=dev-a1rkattoj2gelzi3.us.auth0.com
  AUTH0_CLIENT_ID=h64i8gjsnZxQs7svJ4xw7ZLlqMmbVaYx
  AUTH0_CLIENT_SECRET=awANeewFPCcTuffXnIDvfbRE9QPfIsVRhxw3Fq90RN_G_IRMQp669YZHsrky-lBh
  AUTH0_CALLBACK_URL=http://localhost:3001/auth/external/callback
  JWT_SECRET=tuSecretoParaJWT
```

## ▶️ Ejecutar el proyecto

```bash
npm start
```

```bash
La API quedará disponible en:
http://localhost:3001
```

```bash
para completar el flujo de login en Google usando Auth0 se necesita acceder a travez del navegador a la URL: "http://localhost:3001/auth/login/auth0", luego van a ser redirigidos a "http://localhost:3001/auth/external/callback" donde van a poder ver el JWT generado por el proyecto junto a los datos del usuario.
```


##🔐 Uso del Endpoint de Login

```bash
## POST /auth/login
- url: http://localhost:3001/auth/login
- descripcion: crea y entrega el bearer token que permite ingreso para usuarios y admin
- requestBody:
  - required: true
  - content:
      application/json:
        {
            "username": "admin",
            "password": "1234"
        }
- respuesta:
  - 200:
    {
        "token": "<jwt_generado>"
    }
```


##🛡️ Acceso a Rutas Protegidas

```bash
## POST /auth/usuario
- url: http://localhost:3001/auth/usuario
- descripcion: da acceso a la ruta protegida de mas bajo nivel pueden acceder a ella tanto usuarios como admins
- parametros:
  - required: true
  bearer-token
    {
        bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6...
    }
- respuesta:
  - 200:
    {
        "message": "Bienvenido usuario.",
        "user": {
            "name": "Usuario Normal",
            "email": "user@example.com",
            "role": "user",
            "sub": "user",
            "iat": 1764524653,
            "exp": 1764525553
        }
    }
  - 401:
    {
        "error": "Token inválido o expirado"
    }
```

```bash
## POST /auth/admin
- url: http://localhost:3001/auth/admin
- descripcion: da acceso a la ruta protegida solo para usuarios de nivel admin
- parametros:
  - required: true
  bearer-token
    {
        bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6...
    }
- respuesta:
  - 200:
    {
        "message": "Bienvenido administrador.",
        "user": {
            "name": "Administrador",
            "email": "admin@example.com",
            "role": "admin",
            "sub": "admin",
            "iat": 1764525372,
            "exp": 1764526272
        }
    }
  - 401:
    {
        "error": "Token inválido o expirado"
    }
```

```bash
## GET /auth/login/auth0
- url: http://localhost:3001/auth/login/auth0
- descripcion:  Inicia el flujo de autenticación OAuth2 con Auth0/Google. Redirige a la página de login de Auth0. Este enpoint no puede ser testeado en postmand, se debe acceder a el a travez de un navegador
- respuesta:
  - 200:
    {
      "success":true,
      "message":"OAuth2 login exitoso",
      "jwt":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJuYW1lIjoiTWFydGluIENvdWFkZWF1IiwiZW1haWwiOiJtYXJ0aW5jb3VhZGVhdTE2QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY0NTQxMzAxLCJleHAiOjE3NjQ1NDQ5MDF9.K2fcKwwDNgKXHfGZdePD_LqkfgM_C8VX34F4RzLWZwc",
      "user":{"name":"Martin Couadeau","email":"martincouadeau16@gmail.com","role":"user"}
    }
  - 401:
    {
        "error": "Token inválido o expirado"
    }
```
```bash
## GET /auth/users
- url: http://localhost:3001/auth/users
- descripcion: muestra lista de todos los usuarios conectados en la sesion
- parametros:
  - required: true
- respuesta:
  - 200:
    [
      {
          "Name": "Martin Couadeau",
          "Email": "martincouadeau16@gmail.com",
          "Role": "user"
      }
    ]
```