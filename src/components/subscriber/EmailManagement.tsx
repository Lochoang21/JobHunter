"use client";

import React, { useState } from 'react';
import { Button, Modal, Alert, Spinner, TextInput, Label } from 'flowbite-react';
import { subscriberService } from '@/services/subscriber.service';
import { HiOutlineMail, HiOutlineUser, HiOutlineUsers } from 'react-icons/hi';
import { useSimpleNotification } from '@/hooks/useNotification';

interface EmailManagementProps {
    subscribers: Array<{ id: number; name: string; email: string; skills: Array<{ name: string }> }>;
    onEmailSent?: (result: string) => void;
}

const EmailManagement: React.FC<EmailManagementProps> = ({ subscribers, onEmailSent }) => {
    const [showBulkEmailModal, setShowBulkEmailModal] = useState(false);
    const [showIndividualEmailModal, setShowIndividualEmailModal] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
    const [sendingIndividualEmail, setSendingIndividualEmail] = useState(false);

    // Sử dụng hook quản lý thông báo
    const { success, error, showSuccess, showError, clearAll } = useSimpleNotification(5000);

    const handleSendBulkEmail = async () => {
        setSendingBulkEmail(true);
        clearAll();

        try {
            const result = await subscriberService.sendJobNotifications();
            showSuccess(`Đã gửi email thành công cho ${subscribers.length} subscribers`);
            onEmailSent?.(result);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to send bulk emails');
        } finally {
            setSendingBulkEmail(false);
            setShowBulkEmailModal(false);
        }
    };

    const handleSendIndividualEmail = async () => {
        if (!selectedEmail.trim()) {
            showError('Vui lòng nhập email');
            return;
        }

        setSendingIndividualEmail(true);
        clearAll();

        try {
            const result = await subscriberService.sendEmailToSubscriberByEmail(selectedEmail);
            showSuccess(`Đã gửi email thành công cho ${selectedEmail}`);
            onEmailSent?.(result);
            setSelectedEmail('');
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to send email');
        } finally {
            setSendingIndividualEmail(false);
            setShowIndividualEmailModal(false);
        }
    };

    const handleSendEmailToSubscriber = async (subscriberId: number, subscriberName: string) => {
        setSendingIndividualEmail(true);
        clearAll();

        try {
            const result = await subscriberService.sendEmailToSubscriberById(subscriberId);
            showSuccess(`Đã gửi email thành công cho ${subscriberName}`);
            onEmailSent?.(result);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to send email');
        } finally {
            setSendingIndividualEmail(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    color="blue"
                    onClick={() => setShowBulkEmailModal(true)}
                    disabled={sendingBulkEmail || subscribers.length === 0}
                >
                    {sendingBulkEmail ? (
                        <>
                            <Spinner size="sm" className="mr-2" />
                            Đang gửi...
                        </>
                    ) : (
                        <>
                            <HiOutlineUsers className="mr-2 h-4 w-4" />
                            Gửi cho tất cả ({subscribers.length})
                        </>
                    )}
                </Button>
                <Button
                    color="green"
                    onClick={() => setShowIndividualEmailModal(true)}
                    disabled={sendingIndividualEmail}
                >
                    <HiOutlineUser className="mr-2 h-4 w-4" />
                    Gửi theo email
                </Button>
            </div>

            {error && (
                <Alert color="failure" onDismiss={() => clearAll()}>
                    <div className="flex items-center">
                        <span className="mr-2">❌</span>
                        {error}
                    </div>
                </Alert>
            )}

            {success && (
                <Alert color="success" onDismiss={() => clearAll()}>
                    <div className="flex items-center">
                        <span className="mr-2">✅</span>
                        {success}
                    </div>
                </Alert>
            )}

            {/* Bulk Email Modal */}
            <Modal
                show={showBulkEmailModal}
                onClose={() => setShowBulkEmailModal(false)}
                size="md"
            >
                <Modal.Header>Gửi email cho tất cả subscribers</Modal.Header>
                <Modal.Body>
                    <p>
                        Bạn có chắc chắn muốn gửi email thông báo việc làm cho tất cả {subscribers.length} subscribers?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Email sẽ được gửi đến tất cả subscribers với thông tin việc làm phù hợp với kỹ năng của họ.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue" onClick={handleSendBulkEmail} disabled={sendingBulkEmail}>
                        {sendingBulkEmail ? 'Đang gửi...' : 'Xác nhận'}
                    </Button>
                    <Button color="gray" onClick={() => setShowBulkEmailModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Individual Email Modal */}
            <Modal
                show={showIndividualEmailModal}
                onClose={() => setShowIndividualEmailModal(false)}
                size="md"
            >
                <Modal.Header>Gửi email theo địa chỉ email</Modal.Header>
                <Modal.Body>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" value="Email subscriber" />
                            <TextInput
                                id="email"
                                type="email"
                                value={selectedEmail}
                                onChange={(e) => setSelectedEmail(e.target.value)}
                                placeholder="Nhập email subscriber"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Nhập email của subscriber để gửi thông báo việc làm phù hợp với kỹ năng của họ.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue" onClick={handleSendIndividualEmail} disabled={sendingIndividualEmail}>
                        {sendingIndividualEmail ? 'Đang gửi...' : 'Gửi email'}
                    </Button>
                    <Button color="gray" onClick={() => setShowIndividualEmailModal(false)}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmailManagement; 