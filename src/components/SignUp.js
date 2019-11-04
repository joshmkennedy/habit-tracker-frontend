import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Redirect, navigate } from "@reach/router";

const SignUp = () => {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
    name: "",
  });
  const handleInputChange = e => {
    console.log(formValue, e.target.name);
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const [signup, { data, loading, error }] = useMutation(
    gql`
      mutation SIGNUP(
        $user_email: String!
        $user_password: String!
        $user_name: String!
      ) {
        SignUp(
          user_email: $user_email
          user_password: $user_password
          user_name: $user_name
        ) {
          token
        }
      }
    `,
    {
      variables: {
        user_email: formValue.email,
        user_password: formValue.password,
        user_name: formValue.name,
      },
      onCompleted({ SignUp }) {
        if (SignUp === "oops") {
          return null;
        } else {
          localStorage.setItem("token", SignUp.token);
          navigate("/dashboard");
        }
      },
    }
  );
  if (data) console.log(data);

  const handleSignUp = e => {
    e.preventDefault();
    signup();
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
          <h2>Sign Up</h2>
        )}
        <form action=''>
          <input
            type='text'
            placeholder='name'
            name='name'
            value={formValue.name}
            onChange={handleInputChange}
          />
          <input
            type='text'
            placeholder='email'
            name='email'
            value={formValue.email}
            onChange={handleInputChange}
          />
          <input
            type='password'
            placeholder='password'
            name='password'
            value={formValue.password}
            onChange={handleInputChange}
          />
          <button type='submit' onClick={handleSignUp}>
            submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
