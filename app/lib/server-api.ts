import { cookies } from 'next/headers';
import { ItemDTO, CategoryDTO, ItemsQueryParams, PaginatedResponse, AuctionDTO } from '~/types/api';

const API_BASE_URL = 'https://api.flipit.ng';


// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getItemsServerSide(params: ItemsQueryParams = {}): Promise<{ data: PaginatedResponse<ItemDTO> | null; error: string | null }> {
  try {
    // Build query string with all parameters
    const queryString = buildQueryString(params);
    const apiUrl = `${API_BASE_URL}/api/v1/items${queryString}`;

    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    console.log('getItemsServerSide - API URL:', apiUrl);
    console.log('getItemsServerSide - Has token:', !!token);

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    // If we get 401 with a token, retry without authentication (items endpoint is public)
    if (!response.ok && response.status === 401 && token) {
      console.log('getItemsServerSide - Got 401, retrying without token...');
      const retryResponse = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
      });

      console.log('getItemsServerSide - Retry response status:', retryResponse.status);

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        console.error('getItemsServerSide - Retry failed:', errorText);
        return {
          data: null,
          error: `API error: ${retryResponse.status} ${retryResponse.statusText}`
        };
      }

      const data = await retryResponse.json();
      console.log('getItemsServerSide - Retry success, items count:', Array.isArray(data) ? data.length : data.content?.length || 0);

      // The API might return items directly as an array or in a paginated wrapper
      if (Array.isArray(data)) {
        // Transform to paginated format for consistency
        const paginatedData = {
          content: data,
          totalElements: data.length,
          totalPages: 1,
          size: data.length,
          number: 0,
          first: true,
          last: true,
          empty: data.length === 0,
          numberOfElements: data.length,
          pageable: {
            offset: 0,
            sort: { empty: true, sorted: false, unsorted: true },
            pageNumber: 0,
            pageSize: data.length,
            paged: true,
            unpaged: false
          },
          sort: { empty: true, sorted: false, unsorted: true }
        };
        return { data: paginatedData, error: null };
      }

      return { data, error: null };
    }

    console.log('getItemsServerSide - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('getItemsServerSide - Error:', errorText);
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('getItemsServerSide - Success, items count:', Array.isArray(data) ? data.length : data.content?.length || 0);

    // The API might return items directly as an array or in a paginated wrapper
    if (Array.isArray(data)) {
      // Transform to paginated format for consistency
      const paginatedData = {
        content: data,
        totalElements: data.length,
        totalPages: 1,
        size: data.length,
        number: 0,
        first: true,
        last: true,
        empty: data.length === 0,
        numberOfElements: data.length,
        pageable: {
          offset: 0,
          sort: { empty: true, sorted: false, unsorted: true },
          pageNumber: 0,
          pageSize: data.length,
          paged: true,
          unpaged: false
        },
        sort: { empty: true, sorted: false, unsorted: true }
      };
      return { data: paginatedData, error: null };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getCategoriesServerSide(): Promise<{ data: CategoryDTO[] | null; error: string | null }> {
  try {
    // Call backend API directly from server-side
    const apiUrl = `${API_BASE_URL}/api/v1/items/categories`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json'
        // No authentication needed for categories
      },
      cache: 'no-store',
    });


    if (!response.ok) {
      const errorText = await response.text();
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
    // Validate itemId
    if (!itemId || itemId === 'undefined' || itemId === 'null' || isNaN(Number(itemId))) {
      console.error('Invalid itemId provided:', itemId);
      return {
        data: null,
        error: 'Invalid item ID'
      };
    }

    // Call backend API directly to get single item
    const apiUrl = `${API_BASE_URL}/api/v1/items/${itemId}`;
    console.log('Fetching item from:', apiUrl);

    // Get token from cookies for authentication
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
      const errorText = await response.text();
      console.error('API error response:', response.status, errorText);
      return {
        data: null,
        error: `API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    console.log('Successfully fetched item:', data?.id);

    return { data, error: null };
  } catch (error) {
    console.error('Exception in getSingleItemServerSide:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getUserItemsServerSide(userId: string): Promise<{ data: ItemDTO[] | null; error: string | null }> {
  try {
    // Call backend API directly to get user's items
    const apiUrl = `${API_BASE_URL}/api/v1/items/user/${userId}`;

    // Get token from cookies for authentication
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
      const errorText = await response.text();
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

    // Verify token with backend by making a simple authenticated request
    try {
      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });

      if (!verifyResponse.ok) {
        // Clear cookies if it's 401 Unauthorized or 403 Forbidden (invalid/expired token)
        // Don't clear on 404 (endpoint doesn't exist) or 500 (server error)
        if (verifyResponse.status === 401 || verifyResponse.status === 403) {
          return { isAuthenticated: false, user: null, clearCookies: true };
        }
        // For other errors, fall through to use cookie data
      } else {
        // If successful, get actual user data from the response
        const verifiedUserData = await verifyResponse.json();
        return { isAuthenticated: true, user: verifiedUserData };
      }
    } catch (verifyError) {
      // On network errors, fall back to cookie data but mark as potentially stale
    }

    // Return user data from cookies for now
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

    // Get token from cookies for authentication
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
      const errorText = await response.text();
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

    // Get token from cookies for authentication
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
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
      });

      if (!retryResponse.ok) {
        const errorText = await retryResponse.text();
        return {
          data: null,
          error: `API error: ${retryResponse.status} ${retryResponse.statusText}`
        };
      }

      const data = await retryResponse.json();
      return { data: Array.isArray(data) ? data : [], error: null };
    }

    if (!response.ok) {
      const errorText = await response.text();
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

export async function getSingleAuctionServerSide(auctionId: string): Promise<{ data: AuctionDTO | null; error: string | null }> {
  try {
    // Use the Next.js API route instead of calling backend directly to avoid serialization issues
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/auction/${auctionId}`;

    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Cookie: `token=${token}` })
      },
      cache: 'no-store',
    });


    if (!response.ok) {
      const errorText = await response.text();
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