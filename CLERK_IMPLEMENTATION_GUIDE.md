# Guía de Implementación Clerk para Vibe Invoice Platform

## Análisis del Proyecto Actual

**Tecnologías actuales:**
- Next.js 15.3.3 (App Router)
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- Estructura básica con `src/app/`

## Plan de Implementación

### Fase 1: Configuración Inicial (Alta Prioridad)

#### 1.1 Instalación del SDK
```bash
npm install @clerk/nextjs
```

#### 1.2 Variables de Entorno
Crear `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

> **Nota:** Obtener las claves desde el Dashboard de Clerk

#### 1.3 Middleware de Autenticación
Crear `middleware.ts` en la raíz del proyecto:
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/' // página de inicio pública
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### Fase 2: Configuración de Layout (Prioridad Media)

#### 2.1 Modificar Layout Principal
Actualizar `frontend/src/app/layout.tsx`:
```tsx
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### Fase 3: Páginas de Autenticación (Prioridad Media)

#### 3.1 Página de Inicio de Sesión
Crear `frontend/src/app/sign-in/[[...sign-in]]/page.tsx`:
```tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  )
}
```

#### 3.2 Página de Registro
Crear `frontend/src/app/sign-up/[[...sign-up]]/page.tsx`:
```tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  )
}
```

### Fase 4: Componentes de Autenticación (Prioridad Media)

#### 4.1 Header con Autenticación
Crear `frontend/src/components/Header.tsx`:
```tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Vibe Invoice Platform
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  )
}
```

### Fase 5: Rutas Protegidas (Prioridad Media)

#### 5.1 Dashboard de Facturas
Crear `frontend/src/app/dashboard/page.tsx`:
```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Dashboard de Facturas
      </h1>
      {/* Contenido del dashboard */}
    </div>
  )
}
```

#### 5.2 API Routes Protegidas
Crear `frontend/src/app/api/invoices/route.ts`:
```typescript
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Lógica para obtener facturas del usuario
  const invoices = await getInvoicesByUserId(userId)
  
  return NextResponse.json({ invoices })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // Lógica para crear factura
  const body = await request.json()
  const newInvoice = await createInvoice(userId, body)
  
  return NextResponse.json({ invoice: newInvoice })
}
```

### Fase 6: Hooks y Utilidades (Prioridad Baja)

#### 6.1 Hook de Usuario
Crear `frontend/src/hooks/useUser.ts`:
```typescript
import { useUser as useClerkUser } from '@clerk/nextjs'

export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser()
  
  return {
    user,
    isLoaded,
    isSignedIn,
    userId: user?.id,
    email: user?.emailAddresses[0]?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
  }
}
```

### Fase 7: Configuración Avanzada (Opcional)

#### 7.1 Middleware Avanzado con Roles
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()

  // Rutas públicas
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Proteger todas las rutas privadas
  if (!userId) {
    return auth().redirectToSignIn()
  }

  // Verificar acceso admin
  if (isAdminRoute(req)) {
    const role = sessionClaims?.metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})
```

#### 7.2 Configuración de Clerk Dashboard
En el Dashboard de Clerk configurar:
- **Redirect URLs:**
  - Sign-in: `http://localhost:3000/dashboard`
  - Sign-up: `http://localhost:3000/dashboard`
  - Sign-out: `http://localhost:3000`

- **Allowed redirect URLs:**
  - `http://localhost:3000/*`
  - `https://tu-dominio.com/*`

## Testing y Validación

### Lista de Verificación
- [ ] Usuario puede registrarse
- [ ] Usuario puede iniciar sesión
- [ ] Usuario puede cerrar sesión
- [ ] Rutas protegidas redirigen correctamente
- [ ] API routes validan autenticación
- [ ] Componentes de UI funcionan correctamente
- [ ] Middleware protege rutas según configuración

### Comandos de Testing
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Linting
npm run lint
```

## Estructura de Archivos Resultante

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── invoices/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── Header.tsx
│   └── hooks/
│       └── useUser.ts
├── middleware.ts
├── .env.local
└── package.json
```

## Recursos Adicionales

- [Documentación Oficial de Clerk](https://clerk.com/docs)
- [Guía Next.js App Router](https://clerk.com/docs/quickstarts/nextjs)
- [Ejemplos de Clerk](https://github.com/clerk/clerk-nextjs-app-quickstart)

## Notas Importantes

1. **Seguridad**: Nunca exponer `CLERK_SECRET_KEY` en el cliente
2. **Desarrollo**: Usar claves de test en desarrollo
3. **Producción**: Configurar claves de producción y dominios correctos
4. **Performance**: Clerk maneja caching automáticamente
5. **SEO**: Las páginas protegidas no son indexables por defecto