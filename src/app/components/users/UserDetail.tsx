
"use client";
import React from "react";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Badge } from "flowbite-react";
import { User, GenderEnum } from "@/types/user";

interface UserDetailProps {
    user: User | null;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({
    user, isOpen, onOpen, onClose,
}) => {

    return (
        <>
            <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full p-10">
                <DrawerHeader title="UserDetail" />
                <DrawerItems>
                    {user ? (
                        <div className="space-y-4">
                            <div>
                                <Label value="ID" className="font-semibold" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">:   {user.id}</span>
                            </div>
                            <div>
                                <Label value="Email" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                            </div>
                            <div>
                                <Label value="Name" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Gender" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user?.gender || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Address" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.address || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Age" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.age || "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Created At" className="font-semibold" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.createAt
                                        ? new Date(user.createAt).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <Label value="Role" className="font-semibold" />
                                <span>
                                    <Badge
                                        color={user.role ? "lightsuccess" : "lightsecondary"}
                                        className={user.role ? "text-success" : "text-secondary"}
                                    >
                                        {user.role?.name || "None"}
                                    </Badge>
                                </span>

                            </div>
                        </div>
                    ) : (

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No user selected
                        </p>
                    )}
                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <Button color="gray" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DrawerItems>
            </Drawer>
        </>
    );
}
export default UserDetail;