"use client";

import React, { useState, useEffect } from 'react';
import { Button, Label, TextInput, Checkbox, Alert } from 'flowbite-react';
import { useSubscriber } from '@/contexts/SubscriberContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skill } from '@/types/subscriber';

const SubscribeForm: React.FC = () => {
    const { user } = useAuth();
    const { subscriber, skills, loading, error, createSubscriber, isSubscriber } = useSubscriber();
    const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (subscriber?.skills) {
            setSelectedSkills(subscriber.skills.map(skill => skill.id));
        }
    }, [subscriber]);

    const handleSkillChange = (skillId: number, checked: boolean) => {
        if (checked) {
            setSelectedSkills(prev => [...prev, skillId]);
        } else {
            setSelectedSkills(prev => prev.filter(id => id !== skillId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setFormLoading(true);
        setSuccess(false);

        try {
            await createSubscriber({
                name: user.name || user.email,
                email: user.email,
                skills: selectedSkills.map(skillId => ({ id: skillId }))
            });
            setSuccess(true);
        } catch (err) {
            console.error('Failed to subscribe:', err);
        } finally {
            setFormLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isSubscriber) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                    🎉 Bạn đã đăng ký thành công!
                </h3>
                <p className="text-green-700 mb-4">
                    Chúng tôi sẽ gửi thông báo việc làm phù hợp với kỹ năng của bạn qua email.
                </p>
                <div className="space-y-2">
                    <p className="text-sm text-green-600">
                        <strong>Email:</strong> {subscriber?.email}
                    </p>
                    <p className="text-sm text-green-600">
                        <strong>Kỹ năng:</strong> {subscriber?.skills.map(s => s.name).join(', ')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Đăng ký nhận thông báo việc làm
            </h3>

            {error && (
                <Alert color="failure" className="mb-4">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert color="success" className="mb-4">
                    Đăng ký thành công! Bạn sẽ nhận được thông báo việc làm phù hợp.
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="name" value="Họ tên" />
                    <TextInput
                        id="name"
                        value={user?.name || user?.email || ''}
                        disabled
                        className="mt-1"
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="mt-1"
                    />
                </div>

                <div className="mb-6">
                    <Label value="Chọn kỹ năng của bạn" className="mb-2 block" />
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                        {Array.isArray(skills) && skills.length > 0 ? (
                            skills.map((skill) => (
                                <div key={skill.id} className="flex items-center p-2">
                                    <Checkbox
                                        id={`skill-${skill.id}`}
                                        checked={selectedSkills.includes(skill.id)}
                                        onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                                    />
                                    <Label htmlFor={`skill-${skill.id}`} className="ml-2 text-sm">
                                        {skill.name}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">Không có kỹ năng nào được tìm thấy.</p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    color="blue"
                    className="w-full"
                    disabled={formLoading || selectedSkills.length === 0}
                >
                    {formLoading ? 'Đang đăng ký...' : 'Đăng ký nhận thông báo'}
                </Button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
                Bằng cách đăng ký, bạn đồng ý nhận email thông báo việc làm phù hợp với kỹ năng của mình.
            </p>
        </div>
    );
};

export default SubscribeForm; 