import React from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const [ setAuthUser] = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    const userInfo = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };

    await axios
      .post("/api/user/signup", userInfo)
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          toast.success("User created successfully!");
        }
        localStorage.setItem("chatApp", JSON.stringify(response.data));
        setAuthUser(response.data);
      })
      .catch((error) => {
        if (error.response) {
          toast.error("Error : " + error.response.data.error);
        }
      });
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-900">
      {/* CREATIVE HEADING */}
      <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-lg mb-8">
        MY Chat App
      </h1>

      {/* CENTERED GLASS FORM */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="relative">
            <AiOutlineUser
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
              size={20}
            />
            <input
              type="text"
              className="w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Full Name"
              {...register("fullName", { required: true })}
            />
            {errors.fullname && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <AiOutlineMail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
              size={20}
            />
            <input
              type="email"
              className="w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Email Address"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <AiOutlineLock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
              size={20}
            />
            <input
              type="password"
              className="w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                This field is required
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <AiOutlineLock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
              size={20}
            />
            <input
              type="password"
              className="w-full pl-10 px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            Sign Up
          </button>

          {/* Login Link */}
          <p className="text-center text-sm mt-3 text-white/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 cursor-pointer hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
