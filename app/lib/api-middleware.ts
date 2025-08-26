import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from './config';

export interface ApiMiddlewareOptions {
  requireAuth?: boolean;
  allowedMethods?: string[];
  cors?: boolean;
}

export async function withApiMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: ApiMiddlewareOptions = {}
) {
  return async function (req: NextRequest): Promise<NextResponse> {
    const { requireAuth = false, allowedMethods, cors = true } = options;

    try {
      // CORS handling
      if (cors) {
        if (req.method === 'OPTIONS') {
          return new NextResponse(null, {
            status: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
          });
        }
      }

      // Method validation
      if (allowedMethods && !allowedMethods.includes(req.method)) {
        return NextResponse.json(
          { error: 'Method not allowed', message: `Method ${req.method} is not allowed` },
          { status: 405 }
        );
      }

      // Authentication check
      if (requireAuth) {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
          return NextResponse.json(
            { error: 'Unauthorized', message: 'Authentication required' },
            { status: 401 }
          );
        }

        // Validate token with backend
        try {
          const authResponse = await fetch(`${API_BASE_URL}/checkJwt`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          });

          if (!authResponse.ok) {
            return NextResponse.json(
              { error: 'Unauthorized', message: 'Invalid or expired token' },
              { status: 401 }
            );
          }
        } catch (error) {
          return NextResponse.json(
            { error: 'Authentication Error', message: 'Failed to validate token' },
            { status: 500 }
          );
        }
      }

      // Call the actual handler
      const response = await handler(req);

      // Add CORS headers to response
      if (cors) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }

      return response;
    } catch (error) {
      
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        },
        { status: 500 }
      );
    }
  };
}

export function createProtectedRoute(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: Omit<ApiMiddlewareOptions, 'requireAuth'>
) {
  return withApiMiddleware(handler, { ...options, requireAuth: true });
}

export function createPublicRoute(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: ApiMiddlewareOptions
) {
  return withApiMiddleware(handler, { ...options, requireAuth: false });
}

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number, windowMs: number) {
  return function (req: NextRequest): NextResponse | null {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    Array.from(rateLimitMap.entries()).forEach(([key, value]) => {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    });

    const current = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (current.resetTime < now) {
      // Reset window
      current.count = 1;
      current.resetTime = now + windowMs;
    } else {
      current.count++;
    }

    rateLimitMap.set(ip, current);

    if (current.count > maxRequests) {
      return NextResponse.json(
        { 
          error: 'Too Many Requests', 
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((current.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - current.count).toString(),
            'X-RateLimit-Reset': current.resetTime.toString(),
          }
        }
      );
    }

    return null; // Continue processing
  };
}

// Input validation utility
export function validateRequestBody<T>(
  body: any,
  schema: Record<string, (value: any) => boolean>,
  required: string[] = []
): { isValid: boolean; errors: string[]; data?: T } {
  const errors: string[] = [];

  // Check required fields
  for (const field of required) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      errors.push(`${field} is required`);
    }
  }

  // Validate fields against schema
  for (const [field, validator] of Object.entries(schema)) {
    if (field in body && !validator(body[field])) {
      errors.push(`${field} is invalid`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? body as T : undefined,
  };
}