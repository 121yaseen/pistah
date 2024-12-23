"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (!result?.error) {
      router.push("/dashboard");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      {/* Header */}
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
          onClick={() => router.push("/register")}
          className="px-4 py-2 bg-[#001464] text-white font-medium rounded-full hover:bg-[#002080]"
        >
          Sign Up
        </button>
      </header>

      {/* Login Page */}
      <div className="min-h-screen bg-[#001464] flex flex-col justify-center items-center px-4">
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden p-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Sign in
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-800"
              >
                Email or mobile phone number
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-800"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms and Login Button */}
            <p className="text-sm text-gray-600">
              By continuing, you agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                Terms of use
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
            <button
              type="submit"
              className="w-full px-5 py-3 bg-gray-400 text-white font-medium rounded hover:bg-secondaryBlue hover:text-white "
            >
              Log in
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-between text-sm mt-6">
            <a
              href="/support"
              className="text-gray-500 hover:underline focus:underline"
            >
              Other issue with sign in
            </a>
            <a
              href="/forgot-password"
              className="text-gray-500 hover:underline focus:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Create Account Button */}
        <button
          onClick={() => router.push("/register")}
          className="w-full max-w-lg mt-6 px-6 py-4 bg-white text-[#001464] font-medium rounded-full hover:bg-secondaryBlue hover:text-white hover:border hover:border-white"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

export default Login;
