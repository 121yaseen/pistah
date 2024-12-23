"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        alert("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 bg-white text-[#001464] shadow-md">
        <div className="flex items-center gap-4">
          <Image
            src="/icon-small.png"
            alt="Pistah Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-semibold">Pistah</span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#001464] text-white font-medium rounded-full hover:bg-[#002080]"
        >
          Log in
        </button>
      </header>

      <div className="min-h-screen bg-[#001464] flex flex-col justify-center items-center px-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="bg-[#001464] text-white p-8 md:w-1/2 flex flex-col justify-center items-center text-center ">
            <div>
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Advertise with us
              </h1>
              <p className="mb-12 text-lg">
                Access to thousands of billboards and displays
              </p>
              <Image
                src="/signup-page-art-large.png"
                alt="Signup Art"
                width={350}
                height={350}
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Sign up now
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1 text-gray-800"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1 text-gray-800"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium mb-1 text-gray-800"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-gray-800"
                >
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1 text-gray-800"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1 text-gray-800"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  By creating an account, I agree to the{" "}
                  <a href="/terms" className="text-blue-500 hover:underline">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-blue-500 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
              >
                Sign up
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-500 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
