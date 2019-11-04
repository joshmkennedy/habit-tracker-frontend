import React, { useState, useEffect } from "react";
import { Router, Link, navigate } from "@reach/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Login from "./components/Login";
import HabitDetails from "./components/HabitDetails";
import Dash from "./components/Dash";
import SignUp from "./components/SignUp";
import "./App.scss";

const ME_QUERY = gql`
  {
    Me {
      user_name
      user_id
      habits {
        habit_id
        habit_name
        habit_created_at
        habit_should_remind
        habit_reoccur_time
        times_completed {
          time
        }
      }
    }
  }
`;

function App() {
  const { data, error } = useQuery(ME_QUERY);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (data) {
      setIsLoggedIn(true);
    }
  }, [data]);
  if (error) {
    localStorage.removeItem("token");
    if (!error.message === "You are not logged in...") {
      navigate("/");
    }
  }
  return (
    <>
      <header className='app-header wrapper'>
        <div className='container header__container'>
          <Link className='logo' to='/'>
            <h1>Habit Tracker</h1>
          </Link>
          <nav>
            <Link
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.clear("token");
              }}
              to='/'
            >
              {isLoggedIn ? <p>logout</p> : <p>login</p>}
            </Link>
            {data && data.Me.user_name && (
              <Link to='/dashboard'>Dashboard</Link>
            )}
          </nav>
        </div>
      </header>

      {/*//? Routes */}
      <Router>
        <SignUp path='/signup' />
        <Login path='/' />
        <Dash path='/dashboard'>
          <HabitDetails path='/new' />
          <HabitDetails path='/:habit_id' />
        </Dash>
      </Router>
    </>
  );
}

export default App;
export { ME_QUERY };
