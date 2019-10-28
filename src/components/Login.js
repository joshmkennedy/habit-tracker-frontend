import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Redirect, navigate } from "@reach/router";

const Login = ({ loggedIn }) => {
  const [formValue, setFormValue] = useState({ email: "", password: "" });
  const handleInputChange = e => {
    console.log(formValue, e.target.name);
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const [login, { data, loading, error }] = useMutation(
    gql`
      mutation LOGIN($user_email: String!, $user_password: String!) {
        Login(user_email: $user_email, user_password: $user_password)
      }
    `,
    {
      variables: {
        user_email: formValue.email,
        user_password: formValue.password,
      },
      onCompleted({ Login }) {
        if (Login === "oops") {
          return null;
        } else {
          localStorage.setItem("token", Login);
          navigate("/dashboard");
        }
      },
    }
  );
  if (data) console.log(data);
  if (loggedIn) return <Redirect noThrow to='dashboard' />;

  const handleLogin = e => {
    e.preventDefault();
    login();
  };
  return (
    <div className='login__wrapper wrapper'>
      <div className='login__card'>
        {loading ? (
          <h2>Loading...</h2>
        ) : data && data.Login === "oops" ? (
          <>
            <h2 className='error'>Wrong Password</h2>
            <p>retry entering in your password</p>
          </>
        ) : error ? (
          error.message ===
          "GraphQL error: No data returned from the query." ? (
            <>
              <h2 className='error'>No User Found.</h2>
              <p>Check your email</p>
            </>
          ) : (
            error.message
          )
        ) : (
          <h2>Login</h2>
        )}
        <form action=''>
          <input
            type='text'
            name='email'
            value={formValue.email}
            onChange={handleInputChange}
          />
          <input
            type='password'
            name='password'
            value={formValue.password}
            onChange={handleInputChange}
          />
          <button type='submit' onClick={handleLogin}>
            submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default Login;
