import { ApiService } from '../api/apiService';
import { User, UserRole, AuthApiResponse, MeProfile, UpdateMyProfilePayload, ChangePasswordPayload, TeamApiResponse, AddConsultantPayload, getConsultantTeamProfileResponse, UpdateConsultantTeamManagementPayload } from '../../types/auth.types';

export const authService = {
    async signup(payload: any): Promise<any> {
        const data = await ApiService.post<any>("/auth/signup", payload);

        // Optional: store token after signup
        if (data?.token) {
            localStorage.setItem("token", data.token);
        }

        return data;
    },

    async signIn(payload: any): Promise<any> {
        const data = await ApiService.post<any>("/auth/login", payload);

        if (data?.success) {
            localStorage.setItem("token", data.token);
        }
        if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    },

    async getPostgresOrdersReservationView(): Promise<any> {
        return await ApiService.get<any>("/ibm-all-reservations");
    },

    /**
     * POST /auth/google — Sign in or sign up with Google.
     * Send the Google ID token from the frontend (e.g. Google Sign-In).
     * Request body: { idToken: string }
     */
    async signInWithGoogle(idToken: string): Promise<any> {
        const data = await ApiService.post<any>("/auth/google", { idToken });
        if (data?.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
        }
        if (data?.data?.token) {
            localStorage.setItem("token", data.data.token);
        }
        if (data?.data?.user) {
            localStorage.setItem("user", JSON.stringify(data.data.user));
            if (data.data.user.role) {
                localStorage.setItem("user_role", data.data.user.role);
            }
        }
        return data;
    },

    /**
     * POST /auth/microsoft — Sign in or sign up with Microsoft.
     * Send the Microsoft ID token from the frontend (e.g. MSAL Sign-in).
     * Request body: { idToken: string }
     */
    async signInWithMicrosoft(idToken: string): Promise<any> {
        const data = await ApiService.post<any>("/auth/microsoft", { idToken });

        if (data?.data?.accessToken) {
            localStorage.setItem("accessToken", data.data.accessToken);
        }
        if (data?.data?.token) {
            localStorage.setItem("token", data.data.token);
        }
        if (data?.data?.user) {
            localStorage.setItem("user", JSON.stringify(data.data.user));
            if (data.data.user.role) {
                localStorage.setItem("user_role", data.data.user.role);
            }
        }

        return data;
    },

    async getAllUser(userType: string): Promise<any> {
        return await ApiService.get<any>(`/auth/users?role=${userType}`);
    },

    async forgotPassword(payload: any): Promise<any> {
        return await ApiService.post<any>(`/auth/forgot-password`, payload);
    },

    async forgotPasswordOtp(payload: { email: string }): Promise<any> {
        return await ApiService.post<any>(`/auth/forgot-password/otp`, payload);
    },

    async resetPasswordOtp(payload: { email: string; otp: string; newPassword: string }): Promise<any> {
        return await ApiService.post<any>(`/auth/reset-password/otp`, payload);
    },

    async getUserProfile(userId: any): Promise<any> {
        return await ApiService.get<any>(`/auth/profile/${userId}`);
    },

    async getConsultantProfile(userId: string): Promise<any> {
        return await ApiService.get<any>(`/users/${userId}/consultant-profile`);
    },

    async updateConsultantProfile(payload: any): Promise<any> {
        return await ApiService.patch<any>(`/users/me/consultant-profile`, payload);
    },

    /**
     * PATCH /users/me/consultant-profile — Upload/Update consultant profile picture (multipart)
     * Backend supports both keys: `profilePicture` and `profile_picture`
     */
    async updateConsultantProfilePicture(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('profile_picture', file);

        return await ApiService.patch<any>(`/users/me/consultant-profile`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    async updateUserProfile(payload: any): Promise<any> {
        return await ApiService.put<any>(`/auth/profile`, payload);
    },

    /**
     * GET /users/me — Get my profile (My Account)
     */
    async getMyProfile(): Promise<MeProfile> {
        const response = await ApiService.get<AuthApiResponse<MeProfile>>('/users/me');
        return response.data;
    },

    /**
     * PATCH /users/me — Update my profile (Edit Profile)
     * Supports JSON fields and optional multipart profile image.
     */
    async updateMyProfile(payload: UpdateMyProfilePayload, profileImageFile?: File): Promise<MeProfile> {
        if (profileImageFile) {
            const formData = new FormData();
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(key, String(value));
                }
            });
            // Backend supports both keys.
            formData.append('profilePicture', profileImageFile);
            formData.append('profile_picture', profileImageFile);

            const response = await ApiService.patch<AuthApiResponse<MeProfile>>(
                '/users/me',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        }

        const response = await ApiService.patch<AuthApiResponse<MeProfile>>('/users/me', payload);
        return response.data;
    },

    /**
     * PATCH /users/me — Upload/Update profile picture (multipart)
     * Backend supports both keys: `profilePicture` and `profile_picture`
     */
    async updateMyProfilePicture(file: File): Promise<MeProfile> {
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('profile_picture', file);

        const response = await ApiService.patch<AuthApiResponse<MeProfile>>(
            '/users/me',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    },

    /**
     * PATCH /users/me/password — Change my password
     */
    async changePassword(payload: ChangePasswordPayload): Promise<AuthApiResponse<null>> {
        return await ApiService.patch<AuthApiResponse<null>>('/users/me/password', payload);
    },

    /**
     * GET /users/consultants/available/{ticketId} — Get available consultants for a ticket
     * Fallback: GET /users/consultants/team for screens without ticket context
     */
    async getTeamMembers(ticketId?: string, filters?: {
        search?: string;
        role?: string | string[];
        isActive?: boolean;
        isConsultantApprover?: boolean;
    }): Promise<TeamApiResponse> {
        const params = new URLSearchParams();
        const setParam = (key: string, val: any) => {
            if (val === undefined || val === null || val === "" || val === "All") return;
            if (Array.isArray(val)) {
                if (val.length > 0) params.set(key, val.join(','));
            } else {
                params.set(key, String(val));
            }
        };
        setParam('search', filters?.search);
        setParam('role', filters?.role);
        setParam('isActive', filters?.isActive);
        setParam('isConsultantApprover', filters?.isConsultantApprover);
        const qs = params.toString();
        if (ticketId) {
            return await ApiService.get<TeamApiResponse>(`/users/consultants/available/${ticketId}${qs ? `?${qs}` : ''}`);
        }
        return await ApiService.get<TeamApiResponse>(`/users/consultants/team${qs ? `?${qs}` : ''}`);
    },

    /**
     * POST /users/consultants — Add new consultant
     */
    async addConsultant(payload: AddConsultantPayload): Promise<AuthApiResponse<null>> {
        return await ApiService.post<AuthApiResponse<null>>('/users/consultants', payload);
    },

    /**
     * GET /users/me/constultant-profile
     */
    async getConsultantTeamProfile(id: string): Promise<getConsultantTeamProfileResponse> {
        return await ApiService.get<getConsultantTeamProfileResponse>(`/users/${id}/consultant-management`);
    },

    /**
     * PATCH /users/:id/consultant-management — update consultant team profile
     */
    async updateConsultantTeamProfile(
        id: string,
        payload: UpdateConsultantTeamManagementPayload
    ): Promise<AuthApiResponse<unknown>> {
        return await ApiService.patch<AuthApiResponse<unknown>>(`/users/${id}/consultant-management`, payload);
    },

    /**
     * PATCH /users/:id/consultant-management/deactivate — deactivate consultant
     */
    async deactivateConsultantTeamMember(id: string): Promise<AuthApiResponse<unknown>> {
        return await ApiService.patch<AuthApiResponse<unknown>>(`/users/${id}/consultant-management/deactivate`, {});
    },

    // Helper method to get current user from localStorage
    getCurrentUser(): User | null {
        try {
            const token = localStorage.getItem("accessToken");
            const userStr = localStorage.getItem("user");
            const userRole = localStorage.getItem("user_role") as UserRole;

            if (token && userStr && userRole) {
                const userData = JSON.parse(userStr);
                return {
                    ...userData,
                    token,
                    role: userRole,
                };
            }
        } catch (error) {
            console.error("Failed to get current user:", error);
        }
        return null;
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem("token");
        return !!token;
    },

    // Get current user role
    getUserRole(): UserRole | null {
        return localStorage.getItem("user_role") as UserRole | null;
    },

    // Clear all authentication data
    clearAuth(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_role");
    },
};

