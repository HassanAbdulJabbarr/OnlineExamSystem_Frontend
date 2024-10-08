import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Alert } from "react-bootstrap";

import { initialValue } from "./Auth-state.service";
import { endpoints } from "../../endpoints/endpoints";
import axiosInstance from "../../interceptors/interceptor";
import {
  UserRole,
  token,
  LoggedUserRole,
} from "../../services/userState.service";
import "./Auth.css";

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [login, setLogin] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const submit = async (values) => {
    const apiEndpoint = login ? endpoints.auth.signin : endpoints.auth.signup;

    try {
      const response = await axiosInstance.post(apiEndpoint, {
        ...values,
        UserRole,
      });

      if (login) {
        localStorage.setItem("id", response.data.existingUser._id);
        localStorage.setItem("name", response.data.existingUser.name);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.existingUser.userType);

        if (
          UserRole === "Teacher" &&
          LoggedUserRole === "Teacher" &&
          token !== null
        ) {
          navigate("/welcome-teacher");
        } else if (
          UserRole === "Student" &&
          LoggedUserRole === "Student" &&
          token !== null
        ) {
          navigate("/welcome-student");
        } else {
          navigate("/welcome-admin");
        }
      } else {
        reset(initialValue);
        setSignupSuccess(true);

        setTimeout(() => {
          setSignupSuccess(false);

          setLogin(true);
          navigate("/login");
        }, 2000);
      }

      setEmailError("");
      setPasswordError("");
    } catch (error) {
      console.error("Error logging in user: ", error.response.data.message);
    }
  };

  return (
    <div className="login-background">
      <div className="inner-div">
        <div className="left-side mt-1"></div>
        <div className="right-side">
          {login ? (
            <form className="login-form" onSubmit={handleSubmit(submit)}>
              <h1 className="mb-3 header">Sign In</h1>
              <span className="text-center">
                <span>
                  Don't have an account, no worries <br />
                </span>
                <Link to="/Login" onClick={() => setLogin(false)}>
                  click here
                </Link>
                <span> to register</span>
              </span>{" "}
              <br />
              <input
                type="email"
                placeholder="Email"
                className="mt-5 text-fields"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.email && errors.email.message}
              </p>
              <input
                type="password"
                placeholder="Password"
                className="mt-2 text-fields"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.password && errors.password.message}
              </p>
              <p className="warnings">{passwordError}</p>
              <button
                type="submit"
                className="btn btn-primary judtify-content-end"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleSubmit(submit)}>
              <h1 className="mb-2 header">Sign Up</h1>
              <span className="text-center">
                <span>
                  Please enter your information or <br />
                </span>
                <Link to="/Login" onClick={() => setLogin(true)}>
                  Click here
                </Link>
                <span>&nbsp; if you already have an account :)</span>
              </span>
              <input
                type="text"
                placeholder="Name"
                className="mt-4 text-fields"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.name && errors.name.message}
              </p>
              <input
                type="email"
                placeholder="Email"
                className="mt-2 text-fields"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.email && errors.email.message}
                {!errors.email && emailError}
              </p>
              <input
                type="password"
                placeholder="Password"
                className="mt-2 text-fields"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.password && errors.password.message}
              </p>
              <input
                type="password"
                placeholder="Confirm Password"
                className="mt-2 text-fields"
                {...register("confirmPassword", {
                  required: "",
                })}
              />
              <p className="ms-2 mt-2 warnings">
                {errors.confirmPassword && errors.confirmPassword.message}
                {!errors.confirmPassword && passwordError}
              </p>
              <button
                type="submit"
                className="mt-1 login-button btn btn-primary"
              >
                Sign Up
              </button>
              {signupSuccess && (
                <Alert variant="success" className="mt-3">
                  Successfully signed up! Redirecting to login page...
                </Alert>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
