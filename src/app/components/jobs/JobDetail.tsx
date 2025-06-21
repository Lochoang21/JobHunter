"use client";
import React from "react";
import { Drawer, DrawerHeader, DrawerItems, Label, Badge, Button } from "flowbite-react";
import { Job } from "@/types/job";

interface JobDetailProps {
  job: Job | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} position="right" className="w-96 max-w-full p-10">
      <DrawerHeader title="Job Detail" />
      <DrawerItems>
        {job ? (
          <div className="space-y-4">
            <div>
              <Label value="ID" className="font-semibold" />
              <span className="text-sm text-gray-600 dark:text-gray-400">: {job.id}</span>
            </div>
            <div>
              <Label value="Name" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.name || "N/A"}</p>
            </div>
            <div>
              <Label value="Location" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.location || "N/A"}</p>
            </div>
            <div>
              <Label value="Salary" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.salary ? `${job.salary.toLocaleString()} VND` : "N/A"}
              </p>
            </div>
            <div>
              <Label value="Quantity" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.quantity || "N/A"}</p>
            </div>
            <div>
              <Label value="Level" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.level ? (
                  <Badge color="purple">{job.level}</Badge>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div>
              <Label value="Description" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.description || "N/A"}</p>
            </div>
            <div>
              <Label value="Start Date" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.staterDate ? new Date(job.staterDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <Label value="End Date" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <Label value="Active" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Badge color={job.active ? "indigo" : "failure"}>
                  {job.active ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
            <div>
              <Label value="Skills" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill.id} color="purple">
                        {skill.name || "N/A"}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
            <div>
              <Label value="Company" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.company?.name || "N/A"}
              </p>
            </div>
            <div>
              <Label value="Created At" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.createAt ? new Date(job.createAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <Label value="Created By" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.createBy || "N/A"}</p>
            </div>
            <div>
              <Label value="Updated At" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {job.updateAt ? new Date(job.updateAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div>
              <Label value="Updated By" className="font-semibold" />
              <p className="text-sm text-gray-600 dark:text-gray-400">{job.updateBy || "N/A"}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No job selected</p>
        )}
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Button color="gray" onClick={onClose}>
            Close
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
};

export default JobDetail;