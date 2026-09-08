import { cookies } from 'next/headers';
import { ItemDTO, CategoryDTO, ItemsQueryParams, PaginatedResponse, AuctionDTO } from '~/types/api';
import { API_BASE_URL as CONFIG_BASE_URL } from '~/lib/config';
import { buildQueryString } from '~/lib/api-client';
import { wrapAsPaginated } from '~/lib/pagination';

// CONFIG_BASE_URL includes /api/v1 suffix, but server-api URLs already include /api/v1 in paths
const API_BASE_URL = CONFIG_BASE_URL.replace(/\/api\/v1$/, '');

export async function getItemsServerSide(params: ItemsQueryParams = {}): Promise<{ data: PaginatedResponse<ItemDTO> | null; error: string | null }> {
  try {
    const queryString = buildQueryString(params);
    const apiUrl = `${API_BASE_URL}/api/v1/items${queryString}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    // If we get 401 with a token, retry without authentication (items endpoint is public)
    if (!response.ok && response.status === 401 && token) {
      const retryResponse = await fetch(apiUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!retryResponse.ok) {
        return {
          data: null,
          error: `API error: ${retryResponse.status} ${retryResponse.statusText}`
        };
      }

      const data = await retryResponse.json();
      return { data: Array.isArray(data) ? wrapAsPaginated(data) : data, error: null };
    }

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data: Array.isArray(data) ? wrapAsPaginated(data) : data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getCategoriesServerSide(): Promise<{ data: CategoryDTO[] | null; error: string | null }> {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/items/categories`;

    const response = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getSingleItemServerSide(itemId: string): Promise<{ data: ItemDTO | null; error: string | null }> {
  try {
    if (!itemId || itemId === 'undefined' || itemId === 'null' || isNaN(Number(itemId))) {
      return { data: null, error: 'Invalid item ID' };
    }

    const apiUrl = `${API_BASE_URL}/api/v1/items/${itemId}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getUserItemsServerSide(userId: string): Promise<{ data: ItemDTO[] | null; error: string | null }> {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/items/user/${userId}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function checkAuthServerSide(): Promise<{ isAuthenticated: boolean; user: any | null; clearCookies?: boolean }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;
    const userName = cookieStore.get('userName')?.value;

    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    // Verify token with backend
    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!verifyResponse.ok) {
        if (verifyResponse.status === 401) {
          return { isAuthenticated: false, user: null, clearCookies: true };
        }
        // For other errors, fall through to use cookie data
      } else {
        const verifiedUserData = await verifyResponse.json();
        return { isAuthenticated: true, user: verifiedUserData };
      }
    } catch {
      // On network errors, fall back to cookie data
    }

    // Return user data from cookies as fallback
    const userData = {
      id: parseInt(userId || '0'),
      username: userName || '',
      email: '',
      firstName: userName || '',
      lastName: '',
      phoneNumber: '',
      dateCreated: new Date().toISOString()
    };

    return { isAuthenticated: true, user: userData };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

// Auction-related server-side functions
export async function getAuctionsServerSide(page = 0, size = 15): Promise<{ data: AuctionDTO[] | null; error: string | null }> {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/auction?page=${page}&size=${size}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getActiveAuctionsServerSide(page = 0, size = 15): Promise<{ data: AuctionDTO[] | null; error: string | null }> {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/auction?page=${page}&size=${size}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    // If we get 401 with a token, retry without authentication (auctions endpoint is public)
    if (!response.ok && response.status === 401 && token) {
      const retryResponse = await fetch(apiUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (!retryResponse.ok) {
        return {
          data: null,
          error: `API error: ${retryResponse.status} ${retryResponse.statusText}`
        };
      }

      const data = await retryResponse.json();
      return { data: Array.isArray(data) ? data : data?.content || [], error: null };
    }

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data: Array.isArray(data) ? data : data?.content || [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getSingleAuctionServerSide(auctionId: string): Promise<{ data: AuctionDTO | null; error: string | null }> {
  try {
    // Call backend directly instead of looping through our own Next.js API route
    const apiUrl = `${API_BASE_URL}/api/v1/auction/${auctionId}`;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
