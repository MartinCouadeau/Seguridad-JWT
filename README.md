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

/project
│
├── config.json
├── server.js
│
├── controllers
│ └── authController.js
│
├── middleware
│ └── authMiddleware.js
│
└── routes
└── authRoutes.js

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

### 3️⃣ Configurar la clave JWT

```bash
Editar el archivo config.json:
```

```
{
  "Jwt": {
    "Secret": "mi_clave_super_secreta"
  }
}
```

## ▶️ Ejecutar el proyecto

```bash
npm start
```

```bash
La API quedará disponible en:
http://localhost:3001
```




##🔐 Uso del Endpoint de Login

```bash
## POST /auth/login
- url: http://localhost:3001/auth/login
- descripcion: crea y entrega el bearer token que permite ingreso
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
## POST /auth/protected
- url: http://localhost:3001/auth/protected
- descripcion: da acceso a la ruta
- parametros:
  - required: true
  bearer-token
    {
        bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6...
    }
- respuesta:
  - 200:
    {
        "message": "Acceso permitido",
        "user": {
            "sub": "admin",
            "iat": 1764522200,
            "exp": 1764523100
        }
    }
  - 401:
    {
        "error": "Token inválido o expirado"
    }
```

##📎 Notas finales
- Este proyecto no usa base de datos, solo credenciales mock.
- El token expira a los 15 minutos.
- Se puede ampliar fácilmente agregando usuarios reales, roles o más rutas protegidas.