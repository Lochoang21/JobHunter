"use client";

import React, { useState, useEffect } from 'react';
import { Button, Table, Badge, Modal, Alert, Spinner, Tooltip } from 'flowbite-react';
import { subscriberService } from '@/services/subscriber.service';
import { Subscriber, Meta } from '@/types/subscriber';
import { HiOutlineMail, HiOutlineTrash, HiOutlineRefresh, HiOutlineUser } from 'react-icons/hi';
import { useSimpleNotification } from '@/hooks/useNotification';

const SubscriberManagement: React.FC = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const [sendingEmails, setSendingEmails] = useState(false);
    const [sendingIndividualEmail, setSendingIndividualEmail] = useState<number | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showIndividualEmailModal, setShowIndividualEmailModal] = useState(false);

    // Sử dụng hook quản lý thông báo
    const { success, error, showSuccess, showError, clearAll } = useSimpleNotification(5000);

    useEffect(() => {
        loadSubscribers();
    }, []);

    const loadSubscribers = async () => {
        try {
            setLoading(true);
            clearAll();
            const { subscribers, meta } = await subscriberService.getAllSubscribers();
            setSubscribers(subscribers);
            setMeta(meta);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedSubscriber) return;

        try {
            await subscriberService.deleteSubscriber(selectedSubscriber.id);
            setSubscribers(prev => prev.filter(sub => sub.id !== selectedSubscriber.id));
            setShowDeleteModal(false);
            setSelectedSubscriber(null);
            showSuccess(`Đã xóa subscriber ${selectedSubscriber.name} thành công`);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to delete subscriber');
        }
    };

    const handleSendEmails = async () => {
        setSendingEmails(true);
        clearAll();
        try {
            const result = await subscriberService.sendJobNotifications();
            showSuccess(result);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to send emails');
        } finally {
            setSendingEmails(false);
            setShowConfirmModal(false);
        }
    };

    const handleSendIndividualEmail = async () => {
        if (!selectedSubscriber) return;

        setSendingIndividualEmail(selectedSubscriber.id);
        clearAll();
        try {
            const result = await subscriberService.sendEmailToSubscriberById(selectedSubscriber.id);
            showSuccess(`Email đã được gửi thành công cho ${selectedSubscriber.name} (${selectedSubscriber.email})`);
        } catch (err: any) {
            showError(err.response?.data?.message || 'Failed to send email');
        } finally {
            setSendingIndividualEmail(null);
            setShowIndividualEmailModal(false);
            setSelectedSubscriber(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Spinner size="lg" />
            </div>
        );
    }

    const safeSubscribers = Array.isArray(subscribers) ? subscribers : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Quản lý Subscribers
                    </h2>
                    {meta && (
                        <p className="text-sm text-gray-600 mt-1">
                            Hiển thị {subscribers.length} trong tổng số {meta.total} subscribers
                            (Trang {meta.page}/{meta.pages})
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        color="blue"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={sendingEmails || subscribers.length === 0}
                    >
                        {sendingEmails ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <HiOutlineMail className="mr-2 h-4 w-4" />
                                Gửi thông báo việc làm
                            </>
                        )}
                    </Button>
                    <Button
                        color="gray"
                        onClick={loadSubscribers}
                    >
                        <HiOutlineRefresh className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </div>
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

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Tên</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Kỹ năng</Table.HeadCell>
                        <Table.HeadCell>Ngày đăng ký</Table.HeadCell>
                        <Table.HeadCell>Người tạo</Table.HeadCell>
                        <Table.HeadCell>Thao tác</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {safeSubscribers.map((subscriber) => (
                            <Table.Row key={subscriber.id}>
                                <Table.Cell>{subscriber.id}</Table.Cell>
                                <Table.Cell className="font-medium">
                                    {subscriber.name}
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex items-center">
                                        <HiOutlineMail className="mr-1 h-4 w-4 text-gray-400" />
                                        {subscriber.email}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex flex-wrap gap-1">
                                        {subscriber.skills && subscriber.skills.length > 0 ? (
                                            subscriber.skills.map((skill) => (
                                                <Badge key={skill.id} color="blue" size="sm">
                                                    {skill.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-sm">Không có kỹ năng</span>
                                        )}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    {new Date(subscriber.createAt).toLocaleDateString('vi-VN')}
                                </Table.Cell>
                                <Table.Cell>
                                    <span className="text-sm text-gray-600">
                                        {subscriber.createBy}
                                    </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="flex gap-2">
                                        <Tooltip content="Gửi email cho subscriber này">
                                            <Button
                                                color="blue"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSubscriber(subscriber);
                                                    setShowIndividualEmailModal(true);
                                                }}
                                                disabled={sendingIndividualEmail === subscriber.id}
                                            >
                                                {sendingIndividualEmail === subscriber.id ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <HiOutlineUser className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Xóa subscriber">
                                            <Button
                                                color="failure"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedSubscriber(subscriber);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <HiOutlineTrash className="h-4 w-4" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                {subscribers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Không có subscriber nào.
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                size="md"
            >
                <Modal.Header>
                    Xác nhận xóa
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Bạn có chắc chắn muốn xóa subscriber{' '}
                        <strong>{selectedSubscriber?.name}</strong> ({selectedSubscriber?.email})?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Hành động này không thể hoàn tác.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        color="failure"
                        onClick={handleDelete}
                    >
                        Xóa
                    </Button>
                    <Button
                        color="gray"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Send Email to All Confirmation Modal */}
            <Modal
                show={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                size="md"
            >
                <Modal.Header>Xác nhận gửi email</Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn gửi email thông báo việc làm cho tất cả {subscribers.length} subscriber?</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Email sẽ được gửi đến tất cả subscribers với thông tin việc làm phù hợp với kỹ năng của họ.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue" onClick={handleSendEmails}>Xác nhận</Button>
                    <Button color="gray" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                </Modal.Footer>
            </Modal>

            {/* Send Individual Email Confirmation Modal */}
            <Modal
                show={showIndividualEmailModal}
                onClose={() => setShowIndividualEmailModal(false)}
                size="md"
            >
                <Modal.Header>Gửi email cho subscriber</Modal.Header>
                <Modal.Body>
                    <p>
                        Bạn có chắc chắn muốn gửi email thông báo việc làm cho{' '}
                        <strong>{selectedSubscriber?.name}</strong> ({selectedSubscriber?.email})?
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Email sẽ chứa thông tin việc làm phù hợp với kỹ năng: {selectedSubscriber?.skills?.map(s => s.name).join(', ')}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="blue" onClick={handleSendIndividualEmail}>Gửi email</Button>
                    <Button color="gray" onClick={() => setShowIndividualEmailModal(false)}>Hủy</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SubscriberManagement; 