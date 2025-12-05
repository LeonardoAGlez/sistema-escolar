# Sistema Escolar (Angular + Django)

Aplicacion full-stack para gestionar eventos academicos, usuarios y estadisticas. Frontend en Angular 16 desplegado en Vercel y backend en Django REST Framework desplegado en PythonAnywhere con MySQL.

## Produccion

- Frontend: https://dev-sistema-escolar-webapp-eotmiwspo.vercel.app
- Backend: https://leonardoalvarez.pythonanywhere.com

## Tecnologias y versiones clave

- Frontend: Angular 16.2, Angular Material 16.2, Bootstrap 5.3, ng2-charts 4.1, ngx-mask 16.4
- Backend: Python 3.10, Django 5.0.2, Django REST Framework 3.16.1, django-cors-headers 4.7, PyMySQL, WhiteNoise 6.6
- Base de datos: MySQL (PythonAnywhere) / MySQL local para desarrollo
- Despliegue: Vercel (front), PythonAnywhere (back)

## Arquitectura rapida

- Angular (SPA) consume la API REST de Django via `url_api` configurada en `src/environments/*`.
- Autenticacion basada en token (endpoints `login/` y `logout/`).
- Roles: Administradores, Maestros, Alumnos (permisos por rol en endpoints y vistas).
- Base de datos MySQL; ORM de Django gestiona migraciones.

## Estructura del repositorio

- `dev-sistema-escolar-web/`: frontend Angular
- `dev_sistema_escolar_api/`: backend Django REST
- `env/`: entorno virtual local (ignorar en despliegues)
- `static/`: assets estaticos del backend (admin y DRF docs)

## Frontend (Angular)

- Pantallas: login, dashboard, lista de eventos, registro/edicion de eventos, administracion de usuarios (admins, maestros, alumnos), graficas.
- Carpetas clave: `layouts/` (auth, dashboard), `screens/` (paginas), `partials/` (navbar, sidebar, formularios), `modals/` (editar/eliminar), `services/` (HTTP + facade), `shared/` (paginador en espanol).
- Build de produccion: `npm run vercel-build` (genera `dist/dev-sistema-escolar-webapp`).

## Backend (Django REST)

- Endpoints principales (relativos a la base URL):
  - `login/`, `logout/`
  - `admin/`, `lista-admins/`, `total-usuarios/`
  - `maestros/`, `lista-maestros/`
  - `alumnos/`, `lista-alumnos/`
  - `eventos/`, `lista-eventos/`, `responsables/`, `estadisticas-eventos/`
  - `poblar-bd/` (carga de datos de ejemplo)
- Vistas en `dev_sistema_escolar_api/views/`; modelos y serializers en `models.py` y `serializers.py`.

## Puesta en marcha local

### Backend

1. Requisitos: Python 3.10+, MySQL 8+, pip, virtualenv.
2. Crear entorno e instalar dependencias:

```bash
cd dev_sistema_escolar_api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

3. Base de datos local (opcion 1: my.cnf.local):
   - Copia `my.cnf` a `my.cnf.local` y ajusta credenciales.
   - Crea la BD:

```sql
CREATE DATABASE dev_sistema_escolar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Migraciones y superusuario:

```bash
python manage.py migrate
python manage.py createsuperuser  # opcional
python manage.py runserver  # http://127.0.0.1:8000
```

### Frontend

1. Requisitos: Node 18+, npm 9+, Angular CLI 16 (`npm i -g @angular/cli@16`).
2. Instalar dependencias y correr en dev:

```bash
cd dev-sistema-escolar-web
npm install
ng serve --open  # http://localhost:4200
```

3. Configura el endpoint API en `src/environments/environment.ts` y `environment.prod.ts`:

```ts
export const environment = {
  production: false,
  url_api: "http://127.0.0.1:8000",
};
```

## Variables de entorno (backend)

Crea un `.env` o configura variables en PythonAnywhere:

```
DEBUG=False
SECRET_KEY=<tu-clave>
ALLOWED_HOSTS=leonardoalvarez.pythonanywhere.com
DB_NAME=LeonardoAlvarez$dev_sistema_escolar_db
DB_USER=LeonardoAlvarez
DB_PASSWORD=<tu-password>
DB_HOST=LeonardoAlvarez.mysql.pythonanywhere-services.com
DB_PORT=3306
CORS_ALLOWED_ORIGINS=https://dev-sistema-escolar-webapp-eotmiwspo.vercel.app,http://localhost:4200
CSRF_TRUSTED_ORIGINS=https://dev-sistema-escolar-webapp-eotmiwspo.vercel.app
```

Notas:

- Para despliegue usa `DEBUG=False`.
- En local puedes omitir las variables y usar `my.cnf.local`.

## Despliegue

### Backend en PythonAnywhere

1. Crear virtualenv en PythonAnywhere (Python 3.10) y cargar el codigo.
2. Instalar dependencias: `pip install -r requirements.txt`.
3. Configurar variables de entorno (Web > Environment variables) como en la seccion anterior.
4. WSGI: apunta al `wsgi.py` de `dev_sistema_escolar_api`.
5. BD: usa los valores de host `*.mysql.pythonanywhere-services.com` y puerto 3306.
6. Reload de la webapp.

### Frontend en Vercel

1. Conectar el repositorio en Vercel.
2. Build command: `npm run vercel-build`.
3. Output directory: `dist/dev-sistema-escolar-webapp`.
4. No se requieren variables de entorno si `environment.prod.ts` ya apunta al backend en PythonAnywhere.

## Comandos utiles

- Backend: `python manage.py migrate`, `python manage.py runserver`, `python manage.py createsuperuser`.
- Frontend: `npm start` (alias de `ng serve`), `npm run build` (produccion), `npm test`.

## Solucion de problemas

- CORS bloqueado: asegura que `CORS_ALLOWED_ORIGINS` y `CSRF_TRUSTED_ORIGINS` incluyen tu dominio de Vercel y reinicia en PythonAnywhere.
- MySQL conexion rechazada: verifica `DB_HOST`, `DB_PORT` y credenciales; en local confirma que MySQL este levantado y que `my.cnf.local` exista.
- Migracion duplicada (columna ya existe): usa `python manage.py migrate dev_sistema_escolar_api 0005_add_edad_to_maestros --fake` si la columna esta creada en la BD.

## Licencia

Proyecto academico. Uso educativo.
