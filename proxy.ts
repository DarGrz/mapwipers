import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logVisitor, getRequestInfo, generateSessionId, extractUtmAndGtmParams } from './lib/logging'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next()
  }


  // Get request info
  const requestInfo = getRequestInfo(request)

  // Extract UTM parameters and gtm_from from URL
  const utmAndGtmParams = extractUtmAndGtmParams(request.url)

  // Get or create session ID from cookies
  let sessionId = request.cookies.get('session_id')?.value
  if (!sessionId) {
    sessionId = generateSessionId()
  }

  // Log the visitor (don't await to avoid blocking the response)
  logVisitor({
    ...requestInfo,
    ...utmAndGtmParams,
    page_path: pathname,
    session_id: sessionId,
    referer: requestInfo.referer
  }).catch(error => {
    console.error('Failed to log visitor:', error)
  })

  // Create response and set session cookie if needed
  const response = NextResponse.next()

  if (!request.cookies.get('session_id')?.value) {
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
