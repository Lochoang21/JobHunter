import { useState, useEffect } from 'react';

interface NotificationState {
    message: string | null;
    type: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
}

interface UseNotificationOptions {
    autoHide?: boolean;
    duration?: number;
    onHide?: () => void;
}

/**
 * Custom hook để quản lý thông báo với tính năng tự động ẩn
 */
export const useNotification = (options: UseNotificationOptions = {}) => {
    const { autoHide = true, duration = 5000, onHide } = options;

    const [notification, setNotification] = useState<NotificationState>({
        message: null,
        type: 'info',
        visible: false
    });

    // Tự động ẩn thông báo
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (notification.visible && autoHide) {
            timeoutId = setTimeout(() => {
                hideNotification();
            }, duration);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [notification.visible, autoHide, duration]);

    const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setNotification({
            message,
            type,
            visible: true
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            visible: false
        }));

        // Delay để animation có thể chạy
        setTimeout(() => {
            setNotification({
                message: null,
                type: 'info',
                visible: false
            });
            onHide?.();
        }, 300);
    };

    const showSuccess = (message: string) => showNotification(message, 'success');
    const showError = (message: string) => showNotification(message, 'error');
    const showWarning = (message: string) => showNotification(message, 'warning');
    const showInfo = (message: string) => showNotification(message, 'info');

    return {
        notification,
        showNotification,
        hideNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};

/**
 * Hook đơn giản hơn cho thông báo nhanh
 */
export const useSimpleNotification = (duration: number = 5000) => {
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let successTimeoutId: NodeJS.Timeout;
        let errorTimeoutId: NodeJS.Timeout;

        if (success) {
            successTimeoutId = setTimeout(() => {
                setSuccess(null);
            }, duration);
        }

        if (error) {
            errorTimeoutId = setTimeout(() => {
                setError(null);
            }, duration);
        }

        return () => {
            if (successTimeoutId) clearTimeout(successTimeoutId);
            if (errorTimeoutId) clearTimeout(errorTimeoutId);
        };
    }, [success, error, duration]);

    const showSuccess = (message: string) => {
        setError(null);
        setSuccess(message);
    };

    const showError = (message: string) => {
        setSuccess(null);
        setError(message);
    };

    const clearAll = () => {
        setSuccess(null);
        setError(null);
    };

    return {
        success,
        error,
        showSuccess,
        showError,
        clearAll
    };
}; 