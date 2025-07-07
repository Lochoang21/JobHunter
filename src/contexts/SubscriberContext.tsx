"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { subscriberService } from '@/services/subscriber.service';
import { Subscriber, Skill } from '@/types/subscriber';
import { useAuth } from './AuthContext';

interface SubscriberContextType {
    subscriber: Subscriber | null;
    skills: Skill[];
    loading: boolean;
    error: string | null;
    isSubscriber: boolean;
    createSubscriber: (data: any) => Promise<void>;
    updateSubscriber: (data: any) => Promise<void>;
    refreshSubscriber: () => Promise<void>;
    loadSkills: () => Promise<void>;
}

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

export function SubscriberProvider({ children }: { children: React.ReactNode }) {
    const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadSubscriberData();
            loadSkills();
        } else {
            setSubscriber(null);
            setLoading(false);
        }
    }, [user]);

    const loadSubscriberData = async () => {
        try {
            setLoading(true);
            setError(null);
            const subscriberData = await subscriberService.getCurrentSubscriber();
            setSubscriber(subscriberData);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load subscriber data');
        } finally {
            setLoading(false);
        }
    };

    const loadSkills = async () => {
        try {
            const skillsData = await subscriberService.getSkills();
            setSkills(skillsData);
        } catch (err) {
            console.error('Failed to load skills:', err);
        }
    };

    const createSubscriber = async (data: any) => {
        try {
            setError(null);
            const newSubscriber = await subscriberService.createSubscriber(data);
            setSubscriber(newSubscriber);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create subscriber');
            throw err;
        }
    };

    const updateSubscriber = async (data: any) => {
        try {
            setError(null);
            const updatedSubscriber = await subscriberService.updateSubscriber(data);
            setSubscriber(updatedSubscriber);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update subscriber');
            throw err;
        }
    };

    const refreshSubscriber = async () => {
        await loadSubscriberData();
    };

    const isSubscriber = !!subscriber;

    return (
        <SubscriberContext.Provider
            value={{
                subscriber,
                skills,
                loading,
                error,
                isSubscriber,
                createSubscriber,
                updateSubscriber,
                refreshSubscriber,
                loadSkills,
            }}
        >
            {children}
        </SubscriberContext.Provider>
    );
}

export function useSubscriber() {
    const context = useContext(SubscriberContext);
    if (context === undefined) {
        throw new Error('useSubscriber must be used within a SubscriberProvider');
    }
    return context;
} 