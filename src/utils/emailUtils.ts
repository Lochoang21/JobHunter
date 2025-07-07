import { Subscriber, Skill } from '@/types/subscriber';

/**
 * Utility functions cho email operations
 */

export interface EmailJobData {
    name: string;
    salary: number;
    company: string;
    description: string;
    level: string;
    skills: string[];
}

/**
 * Kiểm tra subscriber có kỹ năng phù hợp với job không
 */
export const hasMatchingSkills = (subscriberSkills: Skill[], jobSkills: string[]): boolean => {
    const subscriberSkillNames = subscriberSkills.map(skill => skill.name.toLowerCase());
    return jobSkills.some(jobSkill =>
        subscriberSkillNames.some(subSkill =>
            subSkill.includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(subSkill)
        )
    );
};

/**
 * Lấy danh sách skills phù hợp giữa subscriber và job
 */
export const getMatchingSkills = (subscriberSkills: Skill[], jobSkills: string[]): Skill[] => {
    return subscriberSkills.filter(skill =>
        jobSkills.some(jobSkill =>
            skill.name.toLowerCase().includes(jobSkill.toLowerCase()) ||
            jobSkill.toLowerCase().includes(skill.name.toLowerCase())
        )
    );
};

/**
 * Tính điểm phù hợp giữa subscriber và job (0-100)
 */
export const calculateSkillMatchScore = (subscriberSkills: Skill[], jobSkills: string[]): number => {
    if (jobSkills.length === 0) return 0;

    const matchingSkills = getMatchingSkills(subscriberSkills, jobSkills);
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
};

/**
 * Lọc subscribers phù hợp với job
 */
export const filterSubscribersByJob = (subscribers: Subscriber[], jobSkills: string[]): Subscriber[] => {
    return subscribers.filter(subscriber =>
        hasMatchingSkills(subscriber.skills, jobSkills)
    );
};

/**
 * Sắp xếp subscribers theo mức độ phù hợp với job
 */
export const sortSubscribersByMatch = (subscribers: Subscriber[], jobSkills: string[]): Subscriber[] => {
    return [...subscribers].sort((a, b) => {
        const scoreA = calculateSkillMatchScore(a.skills, jobSkills);
        const scoreB = calculateSkillMatchScore(b.skills, jobSkills);
        return scoreB - scoreA; // Sắp xếp giảm dần
    });
};

/**
 * Tạo danh sách subscribers phù hợp với job và sắp xếp theo mức độ phù hợp
 */
export const getBestMatchingSubscribers = (subscribers: Subscriber[], jobSkills: string[], limit?: number): Subscriber[] => {
    const matchingSubscribers = filterSubscribersByJob(subscribers, jobSkills);
    const sortedSubscribers = sortSubscribersByMatch(matchingSubscribers, jobSkills);

    if (limit) {
        return sortedSubscribers.slice(0, limit);
    }

    return sortedSubscribers;
};

/**
 * Tạo thông báo email cho subscriber
 */
export const createEmailNotification = (subscriber: Subscriber, jobs: EmailJobData[]): string => {
    const matchingJobs = jobs.filter(job =>
        hasMatchingSkills(subscriber.skills, job.skills)
    );

    if (matchingJobs.length === 0) {
        return `Xin chào ${subscriber.name},\n\nHiện tại chưa có việc làm phù hợp với kỹ năng của bạn. Chúng tôi sẽ thông báo khi có cơ hội mới.\n\nTrân trọng,\nJobFinder Team`;
    }

    const jobList = matchingJobs.map(job =>
        `- ${job.name} tại ${job.company} (${job.level})\n  Lương: ${job.salary.toLocaleString('vi-VN')} VNĐ\n  Kỹ năng: ${job.skills.join(', ')}`
    ).join('\n\n');

    return `Xin chào ${subscriber.name},\n\nChúng tôi tìm thấy ${matchingJobs.length} việc làm phù hợp với kỹ năng của bạn:\n\n${jobList}\n\nHãy truy cập website để ứng tuyển ngay!\n\nTrân trọng,\nJobFinder Team`;
};

/**
 * Kiểm tra email có hợp lệ không
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Tạo danh sách email từ subscribers
 */
export const extractEmailsFromSubscribers = (subscribers: Subscriber[]): string[] => {
    return subscribers.map(subscriber => subscriber.email).filter(isValidEmail);
};

/**
 * Tạo danh sách subscribers theo nhóm kỹ năng
 */
export const groupSubscribersBySkills = (subscribers: Subscriber[]): Record<string, Subscriber[]> => {
    const groups: Record<string, Subscriber[]> = {};

    subscribers.forEach(subscriber => {
        subscriber.skills.forEach(skill => {
            if (!groups[skill.name]) {
                groups[skill.name] = [];
            }
            groups[skill.name].push(subscriber);
        });
    });

    return groups;
};

/**
 * Tạo báo cáo thống kê subscribers
 */
export const generateSubscriberStats = (subscribers: Subscriber[]) => {
    const totalSubscribers = subscribers.length;
    const subscribersWithSkills = subscribers.filter(sub => sub.skills.length > 0).length;
    const skillGroups = groupSubscribersBySkills(subscribers);
    const topSkills = Object.entries(skillGroups)
        .map(([skill, subs]) => ({ skill, count: subs.length }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        totalSubscribers,
        subscribersWithSkills,
        subscribersWithoutSkills: totalSubscribers - subscribersWithSkills,
        uniqueSkills: Object.keys(skillGroups).length,
        topSkills
    };
}; 