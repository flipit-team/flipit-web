import { cookies } from 'next/headers';
import { ItemDTO, CategoryDTO, ItemsQueryParams, PaginatedResponse } from '~/types/api';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.flipit.ng' 
  : 'http://localhost:8080';


export async function getItemsServerSide(params: ItemsQueryParams = {}): Promise<{ data: PaginatedResponse<ItemDTO> | null; error: string | null }> {
  try {
    // Call backend API directly from server-side
    const page = params.page?.toString() ?? '0';
    const size = params.size?.toString() ?? '10';
    const query = params.search ?? '';
    
    const apiUrl = `${API_BASE_URL}/api/v1/items?page=${page}&size=${size}&search=${encodeURIComponent(query)}`;
    
    console.log('🏠 Server-side getItems - calling backend directly:', apiUrl);
    console.log('🏠 Server-side getItems - params:', params);
    
    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('🏠 Server-side getItems - token present:', !!token);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    console.log('🏠 Server-side getItems - response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🏠 Server-side getItems - error:', errorText);
      return { 
        data: null, 
        error: `API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    console.log('🏠 Server-side getItems - success:', data);
    
    // The API might return items directly as an array or in a paginated wrapper
    if (Array.isArray(data)) {
      console.log('🏠 Server-side getItems - items count (direct array):', data.length);
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
    } else {
      console.log('🏠 Server-side getItems - items count (paginated):', data.content?.length);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('🏠 Server-side getItems - exception:', error);
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
    
    console.log('🏷️ Server-side getCategories - calling backend directly:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json'
        // No authentication needed for categories
      },
      cache: 'no-store',
    });

    console.log('🏷️ Server-side getCategories - response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🏷️ Server-side getCategories - error:', errorText);
      return { 
        data: null, 
        error: `API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    console.log('🏷️ Server-side getCategories - success:', data);
    console.log('🏷️ Server-side getCategories - categories count:', data.length);
    
    return { data, error: null };
  } catch (error) {
    console.error('🏷️ Server-side getCategories - exception:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getSingleItemServerSide(itemId: string): Promise<{ data: ItemDTO | null; error: string | null }> {
  try {
    // Call backend API directly to get single item
    const apiUrl = `${API_BASE_URL}/api/v1/items/${itemId}`;
    
    console.log('🔍 Server-side getSingleItem - calling backend directly:', apiUrl);
    
    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('🔍 Server-side getSingleItem - token present:', !!token);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    console.log('🔍 Server-side getSingleItem - response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Server-side getSingleItem - error:', errorText);
      return { 
        data: null, 
        error: `API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    console.log('🔍 Server-side getSingleItem - success:', data);
    console.log('🔍 Server-side getSingleItem - item title:', data.title);
    
    return { data, error: null };
  } catch (error) {
    console.error('🔍 Server-side getSingleItem - exception:', error);
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
    
    console.log('👤 Server-side getUserItems - calling backend directly:', apiUrl);
    
    // Get token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('👤 Server-side getUserItems - token present:', !!token);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      cache: 'no-store',
    });

    console.log('👤 Server-side getUserItems - response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('👤 Server-side getUserItems - error:', errorText);
      return { 
        data: null, 
        error: `API error: ${response.status} ${response.statusText}` 
      };
    }

    const data = await response.json();
    console.log('👤 Server-side getUserItems - success:', data);
    console.log('👤 Server-side getUserItems - items count:', Array.isArray(data) ? data.length : 'not array');
    
    return { data: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    console.error('👤 Server-side getUserItems - exception:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function checkAuthServerSide(): Promise<{ isAuthenticated: boolean; user: any | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;
    const userName = cookieStore.get('userName')?.value;
    
    console.log('🔍 Server auth check: Cookie values:', {
      hasToken: !!token,
      hasUserId: !!userId,
      hasUserName: !!userName,
      tokenLength: token?.length || 0
    });
    
    if (!token) {
      console.log('🔍 Server auth check: No token found');
      return { isAuthenticated: false, user: null };
    }

    console.log('🔍 Server auth check: Token found, skipping backend verification for now...');

    // Temporarily skip backend verification to test cookie persistence
    // TODO: Re-enable backend verification once we confirm cookies work
    /*
    const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/checkJwt`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!verifyResponse.ok) {
      console.log('🔍 Server auth check: Token verification failed', verifyResponse.status);
      return { isAuthenticated: false, user: null };
    }
    */

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

    console.log('🔍 Server auth check: User authenticated from cookies', userData.username || userData.firstName || userData.email);
    return { isAuthenticated: true, user: userData };
  } catch (error) {
    console.error('🔍 Server auth check: Error', error);
    return { isAuthenticated: false, user: null };
  }
}