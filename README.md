# CVR Consultoría Predial

Plataforma integral para auditoría técnica, estudios de títulos y tasaciones comerciales automáticas en la Región de Ñuble, Chile.
Desarrollada con **Next.js 16**, **Tailwind CSS v4**, y **Prisma (SQLite)**.

## Características
- **Página de Inicio (Landing Page):** Diseño premium *Glassmorphism* y navegación enfocada en servicios técnicos especializados.
- **Motor de Tasación Automática:** Integrado con una base de datos regional (Ñuble) actualizable, que evalúa el valor comercial en base a comuna, tipo de propiedad, superficie, conservación y antigüedad.
- **Pasarela de Pagos (MercadoPago):** Integración nativa con MercadoPago para que los clientes adquieran *Informes Oficiales de Tasación* firmados por un perito. Incluye flujo de redirección asíncrono y verificación de IPN mediante webhooks.
- **Panel Administrativo:** Interfaz privada protegida por contraseña para visualizar las solicitudes recibidas y realizar un CRUD completo sobre los valores de mercado de las propiedades.

## Cómo empezar

Primero, instala las dependencias (si no lo has hecho):

```bash
npm install
```

Luego, sincroniza la base de datos de Prisma:

```bash
npx prisma db push
```

Finalmente, inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

### Semillas (Seed Data)
Para cargar los datos iniciales de los precios por metro cuadrado de las 21 comunas de Ñuble, ingresa al panel de administración en `http://localhost:3000/admin` (la contraseña por defecto es `cvr2025admin`) y presiona el botón **"Cargar datos base"**.

## Despliegue en Vercel

Este proyecto está optimizado para ser desplegado en [Vercel](https://vercel.com).
Al desplegar en producción, asegúrate de cambiar el proveedor en `prisma.config.ts` y en el `schema.prisma` a PostgreSQL si deseas persistencia de datos duradera, o mantener SQLite si es un despliegue temporal con volumen local.
Asegúrate de agregar todas las variables de entorno (`MERCADOPAGO_ACCESS_TOKEN`, `ADMIN_PASSWORD`, etc.) en el panel de Vercel.
