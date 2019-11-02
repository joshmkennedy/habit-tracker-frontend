import React, { useState, useEffect } from "react";
import { Router, Link, Redirect } from "@reach/router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Login from "./components/Login";
import UpdateHabitDetails from "./components/UpdateHabitDetails";
import Dash from "./components/Dash";
import "./App.scss";
import NewHabit from "./components/NewHabit";

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
          <NewHabit path='/new' />
          <UpdateHabitDetails path='/:habit_id' />
        </Dash>
      </Router>
    </>
  );
}

export default App;
export { ME_QUERY };