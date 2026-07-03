import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
  const isSetupFeeRoute = request.nextUrl.pathname.startsWith('/setup-fee')

  // Not logged in trying to access dashboard -> send to login
  if (!user && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logged in - check if setup fee is paid before allowing dashboard access
  if (user && isDashboardRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('setup_complete')
      .eq('id', user.id)
      .single()

    if (!profile?.setup_complete) {
      return NextResponse.redirect(new URL('/setup-fee', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/setup-fee'],
}
