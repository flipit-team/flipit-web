import {apiClient, handleApiCall} from '~/lib/api-client';
import {DashboardSummaryDTO, ListingsSummaryDTO, ListingDTO, CustomersSummaryDTO, BidsSummaryDTO} from '~/types/api';

export class AdminService {
    // Dashboard/Overview APIs
    static async getDashboardSummary() {
        return handleApiCall(() =>
            apiClient.get<DashboardSummaryDTO>('/v1/admin/dashboard/summary', {requireAuth: true})
        );
    }

    static async getRecentActivities() {
        return handleApiCall(() =>
            apiClient.get<string[]>('/v1/admin/dashboard/recent_activities', {requireAuth: true})
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
        return handleApiCall(() => apiClient.get<string[]>('/v1/admin/customers/all_customers', {requireAuth: true}));
    }

    // Bids APIs
    static async getBidsSummary() {
        return handleApiCall(() => apiClient.get<BidsSummaryDTO>('/v1/admin/bids/summary', {requireAuth: true}));
    }

    static async getAllBids() {
        return handleApiCall(() => apiClient.get<string[]>('/v1/admin/bids/all_bids', {requireAuth: true}));
    }
}

export default AdminService;
