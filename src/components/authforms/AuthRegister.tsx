"use client";

import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { GenderEnum } from "@/types/auth";

const AuthRegister = () => {
  const router = useRouter();
  const { register, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    age: "",
    gender: GenderEnum.MALE,
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        ...formData,
        age: parseInt(formData.age, 10),
      });
      router.push("/auth/login");
    } catch (err) {
      console.error("Registration failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput
            id="name"
            name="name"
            type="text"
            sizing="md"
            className="form-control form-rounded-xl"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email Address" />
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            sizing="md"
            className="form-control form-rounded-xl"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="age" value="Age" />
          </div>
          <TextInput
            id="age"
            name="age"
            type="number"
            sizing="md"
            className="form-control form-rounded-xl"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="gender" value="Gender" />
          </div>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control form-rounded-xl w-full"
            required
          >
            {Object.values(GenderEnum).map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="address" value="Address" />
          </div>
          <TextInput
            id="address"
            name="address"
            type="text"
            sizing="md"
            className="form-control form-rounded-xl"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            name="password"
            type="password"
            sizing="md"
            className="form-control form-rounded-xl"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}
        <Button
          type="submit"
          color={'primary'}
          className="w-full"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </>
  );
};

export default AuthRegister;
