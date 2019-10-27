import React, { useState, useEffect } from "react";
import { Router, Link, Redirect } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";
import Login from "./components/Login";
import HabitDetails from "./components/HabitDetails";
import Dash from "./components/Dash";
import "./App.css";
import gql from "graphql-tag";

const ME_QUERY = gql`
  {
    Me {
      user_name
      user_id
      habits {
        habit_id
        habit_name
        habit_created_at
        times_completed {
          time
        }
      }
    }
  }
`;

function App() {
  const { data, loading, error } = useQuery(ME_QUERY);
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (data) {
      setIsLoggedIn(true);
    }
  }, [data]);

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
          </nav>
        </div>
      </header>

      {/*//? Routes */}
      <Router>
        <Login path='/' />
        <Dash path='/dashboard'>
          <HabitDetails path='habits/:habit_id' />
        </Dash>
      </Router>
    </>
  );
}

export default App;
export { ME_QUERY };
