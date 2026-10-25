import {apiClient, handleApiCall} from '~/lib/api-client';
import {DashboardSummaryDTO, ListingsSummaryDTO, ListingDTO, CustomersSummaryDTO, BidsSummaryDTO, ChatDTO, MessageDTO} from '~/types/api';

export class AdminService {
    // Dashboard/Overview APIs
    static async getDashboardSummary() {
        return handleApiCall(() =>
            apiClient.get<DashboardSummaryDTO>('/v1/admin/dashboard/summary', {requireAuth: true})
        );
    }

    static async getRecentActivities() {
        return handleApiCall(() =>
            apiClient.get<any[]>('/v1/admin/dashboard/recent_activities', {requireAuth: true})
        );
    }

    // Listings APIs
    static async getListingsSummary() {
        return handleApiCall(() =>
            apiClient.get<ListingsSummaryDTO>('/v1/admin/listings/summary', {requireAuth: true})
        );
    }

    static async getAllListings() {
        return handleApiCall(() => apiClient.get<ListingDTO[]>('/v1/admin/listings/all_listings', {requireAuth: true}));
    }

    // Customers APIs
    static async getCustomersSummary() {
        return handleApiCall(() =>
            apiClient.get<CustomersSummaryDTO>('/v1/admin/customers/summary', {requireAuth: true})
        );
    }

    static async getAllCustomers() {
        return handleApiCall(() => apiClient.get<any[]>('/v1/admin/customers/all_customers', {requireAuth: true}));
    }

    // Bids APIs
    static async getBidsSummary() {
        return handleApiCall(() => apiClient.get<BidsSummaryDTO>('/v1/admin/bids/summary', {requireAuth: true}));
    }

    static async getAllBids() {
        return handleApiCall(() => apiClient.get<any[]>('/v1/admin/bids/all_bids', {requireAuth: true}));
    }

    // Listing status update
    static async updateListingStatus(listingId: string, status: string) {
        return handleApiCall(() =>
            apiClient.put<any>(`/v1/admin/listings/${listingId}/status`, {status}, {requireAuth: true})
        );
    }

    // Customer blacklist / whitelist
    static async blacklistCustomer(userId: string) {
        return handleApiCall(() =>
            apiClient.put<void>(`/v1/admin/customers/${userId}/blacklist`, {}, {requireAuth: true})
        );
    }

    // Admin chats
    static async getChats() {
        return handleApiCall(() =>
            apiClient.get<ChatDTO[]>('/v1/admin/chats', {requireAuth: true})
        );
    }

    static async getChatMessages(chatId: string) {
        return handleApiCall(() =>
            apiClient.get<MessageDTO[]>(`/v1/admin/chats/${chatId}/messages`, {requireAuth: true})
        );
    }

    static async sendAdminMessage(chatId: string, message: string) {
        return handleApiCall(() =>
            apiClient.post<MessageDTO>(`/v1/admin/chats/${chatId}/message`, {message}, {requireAuth: true})
        );
    }

    static async whitelistCustomer(userId: string) {
        return handleApiCall(() =>
            apiClient.put<void>(`/v1/admin/customers/${userId}/whitelist`, {}, {requireAuth: true})
        );
    }
}

export default AdminService;
