import { useSubscriber as useSubscriberContext } from '@/contexts/SubscriberContext';
import { subscriberService } from '@/services/subscriber.service';
import { Subscriber, Skill } from '@/types/subscriber';

/**
 * Custom hook để quản lý subscriber với các utility functions
 * @returns Object chứa thông tin subscriber và các utility functions
 */
export const useSubscriber = () => {
    const context = useSubscriberContext();

    /**
     * Lấy thông tin subscriber hiện tại
     */
    const getCurrentSubscriber = (): Subscriber | null => {
        return context.subscriber;
    };

    /**
     * Kiểm tra user đã đăng ký subscriber chưa
     */
    const isSubscribed = (): boolean => {
        return context.isSubscriber;
    };

    /**
     * Lấy danh sách skills của subscriber
     */
    const getSubscriberSkills = (): Skill[] => {
        return context.subscriber?.skills || [];
    };

    /**
     * Lấy tên skills của subscriber
     */
    const getSubscriberSkillNames = (): string[] => {
        return getSubscriberSkills().map(skill => skill.name);
    };

    /**
     * Kiểm tra subscriber có skill cụ thể không
     */
    const hasSkill = (skillName: string): boolean => {
        return getSubscriberSkills().some(skill =>
            skill.name.toLowerCase() === skillName.toLowerCase()
        );
    };

    /**
     * Lấy danh sách tất cả skills có sẵn
     */
    const getAllSkills = (): Skill[] => {
        return context.skills;
    };

    /**
     * Tạo subscriber mới
     */
    const createNewSubscriber = async (data: {
        name: string;
        email: string;
        skills: number[];
    }): Promise<void> => {
        await context.createSubscriber(data);
    };

    /**
     * Cập nhật subscriber
     */
    const updateSubscriberData = async (data: {
        id: number;
        name: string;
        email: string;
        skills: number[];
    }): Promise<void> => {
        await context.updateSubscriber(data);
    };

    /**
     * Làm mới dữ liệu subscriber
     */
    const refreshSubscriberData = async (): Promise<void> => {
        await context.refreshSubscriber();
    };

    /**
     * Làm mới danh sách skills
     */
    const refreshSkills = async (): Promise<void> => {
        await context.loadSkills();
    };

    /**
     * Gửi email thông báo việc làm cho tất cả subscribers
     */
    const sendJobNotificationsToAll = async (): Promise<string> => {
        return await subscriberService.sendJobNotifications();
    };

    /**
     * Gửi email thông báo việc làm cho subscriber cụ thể theo ID
     */
    const sendJobNotificationToSubscriberById = async (subscriberId: number): Promise<string> => {
        return await subscriberService.sendEmailToSubscriberById(subscriberId);
    };

    /**
     * Gửi email thông báo việc làm cho subscriber cụ thể theo email
     */
    const sendJobNotificationToSubscriberByEmail = async (email: string): Promise<string> => {
        return await subscriberService.sendEmailToSubscriberByEmail(email);
    };

    /**
     * Kiểm tra subscriber có kỹ năng phù hợp với job không
     */
    const hasMatchingSkills = (jobSkills: string[]): boolean => {
        const subscriberSkills = getSubscriberSkillNames();
        return jobSkills.some(jobSkill =>
            subscriberSkills.some(subSkill =>
                subSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(subSkill.toLowerCase())
            )
        );
    };

    /**
     * Lấy danh sách skills phù hợp với job
     */
    const getMatchingSkills = (jobSkills: string[]): Skill[] => {
        const subscriberSkills = getSubscriberSkills();
        return subscriberSkills.filter(skill =>
            jobSkills.some(jobSkill =>
                skill.name.toLowerCase().includes(jobSkill.toLowerCase()) ||
                jobSkill.toLowerCase().includes(skill.name.toLowerCase())
            )
        );
    };

    return {
        // Context values
        subscriber: context.subscriber,
        skills: context.skills,
        loading: context.loading,
        error: context.error,
        isSubscriber: context.isSubscriber,

        // Utility functions
        getCurrentSubscriber,
        isSubscribed,
        getSubscriberSkills,
        getSubscriberSkillNames,
        hasSkill,
        getAllSkills,

        // Actions
        createNewSubscriber,
        updateSubscriberData,
        refreshSubscriberData,
        refreshSkills,

        // Email operations
        sendJobNotificationsToAll,
        sendJobNotificationToSubscriberById,
        sendJobNotificationToSubscriberByEmail,

        // Skill matching functions
        hasMatchingSkills,
        getMatchingSkills,

        // Direct context methods
        createSubscriber: context.createSubscriber,
        updateSubscriber: context.updateSubscriber,
        refreshSubscriber: context.refreshSubscriber,
        loadSkills: context.loadSkills,
    };
}; 