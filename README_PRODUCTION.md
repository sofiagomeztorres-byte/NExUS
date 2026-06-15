# NExUS — Guía de Despliegue en Producción

## Resultado Final

Una vez completados estos pasos, NExUS estará disponible en una URL pública como:
```
https://nexus.tudominio.com
```

Accesible desde celular, tablet y computadora. Cada usuario tiene sus propios datos, completamente aislados.

---

## Prerequisitos

- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [Vercel](https://vercel.com) (gratuita)
- Repositorio en GitHub con el código de NExUS

---

## PASO 1 — Crear Proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → **New Project**
2. Nombre: `nexus` (o el que prefieras)
3. Contraseña de base de datos: genera una segura y guárdala
4. Región: selecciona la más cercana a tus usuarios
5. Clic en **Create new project** (tarda ~2 minutos)

---

## PASO 2 — Ejecutar el Schema SQL

1. En Supabase Dashboard → **SQL Editor** → **New Query**
2. Copiar y pegar el contenido completo de:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Clic en **Run** (botón verde)
4. Verificar que muestra "Success" para todas las operaciones

Esto crea:
- Tablas: `profiles`, `brands`, `tasks`, `calendar_events`, `smart_schedules`, `library_files`, `groups`, `goals`, `analytics_entries`
- Políticas RLS (Row Level Security) — cada usuario solo ve sus propios datos
- Trigger automático que crea el perfil al registrarse

---

## PASO 3 — Configurar Storage (Almacenamiento)

En Supabase Dashboard → **Storage** → **New Bucket**:

### Bucket 1: Archivos de Biblioteca
- Name: `library-files`
- Public: **NO** (privado)
- Clic en **Save**

### Bucket 2: Media de Analytics
- Name: `analytics-media`
- Public: **NO** (privado)
- Clic en **Save**

### Políticas de Storage

Para cada bucket, ir a **Policies** → **New Policy** → **For full customization**:

```sql
-- Política para library-files:
-- Allow authenticated users to manage their own files
CREATE POLICY "owner_access" ON storage.objects
FOR ALL USING (
  auth.uid()::text = (storage.foldername(name))[1]
);
```

Aplicar la misma política para `analytics-media`.

---

## PASO 4 — Obtener las Credenciales

En Supabase Dashboard → **Settings** → **API**:

Copiar:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## PASO 5 — Configurar Autenticación

En Supabase Dashboard → **Authentication** → **Settings**:

### Para desarrollo rápido (recomendado al inicio):
- **Email Confirmations**: Desactivar → "Disable email confirmations"
- Esto permite que los usuarios inicien sesión inmediatamente al registrarse

### Para producción real:
- Mantener Email Confirmations activado
- Configurar un dominio personalizado para los emails en **Auth** → **Email Templates**

### Dominios permitidos (CORS):
En **Authentication** → **Settings** → **Site URL**:
- Agregar tu dominio de Vercel: `https://nexus-xxx.vercel.app`
- Agregar tu dominio propio: `https://tudominio.com`

---

## PASO 6 — Subir a GitHub

```bash
git init
git add .
git commit -m "NExUS v1.0 - Production Ready"
git remote add origin https://github.com/TU_USUARIO/nexus.git
git push -u origin main
```

> Asegúrate de que `.env.local` está en `.gitignore` (ya lo está).
> Nunca subas las claves de Supabase a GitHub.

---

## PASO 7 — Desplegar en Vercel

1. Ir a [vercel.com](https://vercel.com) → **New Project**
2. Importar desde GitHub → seleccionar el repositorio `nexus`
3. Framework: **Next.js** (detectado automáticamente)
4. En **Environment Variables**, agregar:

   | Variable | Valor |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://XXXX.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyXXXXXXX...` |

5. Clic en **Deploy**
6. Vercel construye y despliega (~2 minutos)
7. Tu app está disponible en: `https://nexus-xxx.vercel.app`

---

## PASO 8 — Conectar Dominio Propio

1. En Vercel → tu proyecto → **Settings** → **Domains**
2. Escribir tu dominio: `nexus.tudominio.com` → **Add**
3. Vercel te da los registros DNS a configurar
4. En tu proveedor de dominio (GoDaddy, Namecheap, Cloudflare, etc.):
   - Agregar un registro **CNAME**: `nexus` → `cname.vercel-dns.com`
   - O un registro **A**: apuntar a la IP de Vercel
5. Esperar propagación DNS (5 minutos - 48 horas, usualmente <1 hora)
6. Verificar en Vercel que el dominio muestra ✅

### En Supabase, agregar el dominio a la lista permitida:
**Authentication** → **Settings** → **Site URL** → agregar `https://nexus.tudominio.com`

---

## PASO 9 — Actualizar la Aplicación en el Futuro

Cualquier cambio en el código se despliega automáticamente:

```bash
# Hacer cambios en el código
git add .
git commit -m "descripción del cambio"
git push origin main
# Vercel detecta el push y despliega automáticamente (~1-2 min)
```

Para cambios en la base de datos:
1. Escribir la nueva migración SQL
2. Ejecutarla en Supabase SQL Editor
3. El código actualizado en Vercel automáticamente usará los nuevos campos

---

## Variables de Entorno Requeridas

```bash
# .env.local (desarrollo local)
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXXXXXXXXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Estas mismas variables se configuran en Vercel para producción.

---

## Estructura de Base de Datos

```
profiles          — Perfil de usuario (1 por auth.users)
brands            — Marcas del usuario (N por usuario)
tasks             — Tareas (N por marca)
calendar_events   — Eventos del calendario (N por marca)
smart_schedules   — Horarios generados por Mi Día (1 por marca/día)
library_files     — Archivos de la biblioteca (N por marca)
groups            — Grupos/semanas (N por marca)
goals             — Metas (N por marca)
analytics_entries — Registros de analytics (N por marca)
```

Todas las tablas tienen:
- `user_id` que referencia a `auth.users` con RLS activo
- `brand_id` (cuando aplica) que referencia a `brands`
- Políticas que garantizan aislamiento total entre usuarios

---

## Seguridad Implementada

- **Row Level Security (RLS)** en todas las tablas
- Cada usuario solo puede ver, editar y eliminar sus propios datos
- Las claves privadas de Supabase nunca se exponen al cliente
- Autenticación manejada por Supabase Auth (JWT)
- HTTPS obligatorio en Vercel

---

## Solución de Problemas

### "Supabase no configurado"
→ Verifica que las variables de entorno están correctamente definidas en Vercel y que no tienen espacios extra.

### "Error al iniciar sesión"
→ Verifica que el dominio de tu app está en la lista de URLs permitidas en Supabase Authentication → Settings.

### "Usuario no puede ver sus datos"
→ Verifica que las políticas RLS fueron creadas correctamente ejecutando el SQL de migración completo.

### Los datos no persisten
→ Verifica en Supabase Dashboard → Table Editor que las tablas existen y tienen datos.

---

*NExUS — Creado por Sofía Gómez*
