import api from './api';
import {
    Subscriber,
    CreateSubscriberRequest,
    UpdateSubscriberRequest,
    SubscriberResponse,
    SubscribersResponse,
    Skill,
    Meta
} from '../types/subscriber';

export const subscriberService = {
    // Kiểm tra email đã tồn tại
    async checkEmailExists(email: string): Promise<boolean> {
        try {
            const response = await api.get(`/subscribers/check-email?email=${email}`);
            return response.data.data;
        } catch (error) {
            return false;
        }
    },

    // Tạo subscriber mới
    async createSubscriber(data: CreateSubscriberRequest): Promise<Subscriber> {
        const response = await api.post<SubscriberResponse>('/subscribers', data);
        return response.data.data;
    },

    // Cập nhật subscriber
    async updateSubscriber(data: UpdateSubscriberRequest): Promise<Subscriber> {
        const response = await api.put<SubscriberResponse>('/subscribers', data);
        return response.data.data;
    },

    // Lấy thông tin subscriber theo email (cho user hiện tại)
    async getCurrentSubscriber(): Promise<Subscriber | null> {
        try {
            const response = await api.get<SubscriberResponse>('/subscribers/skills');
            return response.data.data;
        } catch (error) {
            return null;
        }
    },

    // Lấy thông tin subscriber theo ID
    async getSubscriberById(id: number): Promise<Subscriber | null> {
        try {
            const response = await api.get<SubscriberResponse>(`/subscribers/${id}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    },

    // Lấy tất cả subscribers (cho admin) - cập nhật để gọi đúng endpoint
    async getAllSubscribers(params?: any): Promise<{ subscribers: Subscriber[], meta: Meta }> {
        const response = await api.get<SubscribersResponse>('/subscribers', { params });
        return {
            subscribers: response.data.data.result,
            meta: response.data.data.meta
        };
    },

    // Xóa subscriber
    async deleteSubscriber(id: number): Promise<void> {
        await api.delete(`/subscribers/${id}`);
    },

    // Lấy danh sách skills
    async getSkills(): Promise<Skill[]> {
        const response = await api.get('/skills');
        return response.data.data.result;
    },

    // Gửi email thông báo việc làm cho tất cả subscribers (cho admin)
    async sendJobNotifications(): Promise<string> {
        const response = await api.get('/email');
        return response.data?.data || response.data?.message || "Đã gửi email thành công!";
    },

    // Gửi email cho subscriber cụ thể theo ID
    async sendEmailToSubscriberById(subscriberId: number): Promise<string> {
        const response = await api.get(`/email/subscriber/${subscriberId}`);
        return response.data?.data || response.data?.message || "Đã gửi email thành công!";
    },

    // Gửi email cho subscriber cụ thể theo email
    async sendEmailToSubscriberByEmail(email: string): Promise<string> {
        const response = await api.get(`/email/subscriber/email/${email}`);
        return response.data?.data || response.data?.message || "Đã gửi email thành công!";
    }
}; 