import { NextRequest, NextResponse } from 'next/server';

// Pre-launch gate. The site is public-facing but not launch-quality yet, so
// everything behind duffleup.in sits behind shared Basic Auth credentials until
// we ship. This is a friction barrier for founding partners, not a security
// boundary — the real API (api.duffleup.in) is a separate origin and is
// unaffected by this file.
const GATE_USER = 'duffleup';

function challenge() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Duffleup preview"',
    },
  });
}

export function middleware(request: NextRequest) {
  // Launch-day escape hatch: flip SITE_GATE_ENABLED to 'false' in Vercel and
  // redeploy. Anything else (including unset) leaves the gate closed, so a
  // missing env var can never accidentally expose the site.
  if (process.env.SITE_GATE_ENABLED === 'false') {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');

    if (scheme?.toLowerCase() === 'basic' && encoded) {
      let user: string | undefined;
      let pass: string | undefined;

      // A malformed header is a 401, not a 500 — atob throws on invalid base64
      // and this runs on every request from the open internet.
      try {
        const decoded = atob(encoded);
        const separator = decoded.indexOf(':');
        if (separator !== -1) {
          user = decoded.slice(0, separator);
          pass = decoded.slice(separator + 1);
        }
      } catch {
        return challenge();
      }

      const expected = process.env.SITE_GATE_PASSWORD;

      if (expected && user === GATE_USER && pass === expected) {
        return NextResponse.next();
      }
    }
  }

  return challenge();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - robots.txt (let crawlers see the gate rather than nothing)
     * - Any path with a file extension (public/ assets: sitemap.xml, svgs)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
  ],
};
