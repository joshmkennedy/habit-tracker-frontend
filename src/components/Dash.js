import React, { useState } from "react";

import { navigate } from "@reach/router";
import { useQuery } from "@apollo/react-hooks";

import { ME_QUERY } from "../App";
import NoHabitsMessage from "./NoHabitMessage";
import HabitList from "./HabitList";

//TODO add reoccur time to the function
export const isCompletedToday = (timeStamp, reoccur_time) => {
  const dateCompletedLast = new Date(timeStamp);
  if (
    dateCompletedLast.getFullYear() >= new Date().getFullYear() &&
    dateCompletedLast.getMonth() >= new Date().getMonth() &&
    dateCompletedLast.getDate() >= new Date().getDate()
  ) {
    return true;
  } else {
    return false;
  }
};

const Dash = ({ children }) => {
  const user = useQuery(ME_QUERY);

  const [viewingHabitType, setViewingHabitType] = useState("undone");

  return (
    <div className='wrapper'>
      <div className='container dashboard'>
        <div className='dashboard-header'>
          <h2>Your Habits</h2>
          <div>
            <p>Viewing habits that are...</p>
            <select
              value={viewingHabitType}
              onChange={e => setViewingHabitType(e.target.value)}
            >
              <option value='undone'>undone habits</option>
              <option value='done'>done habits</option>
              <option value='all'>undone and done habits</option>
            </select>
          </div>
        </div>

        <button
          className='new-habit'
          onClick={() => navigate("/dashboard/new")}
        >
          <span>+</span>
        </button>
        <div className='habit-list__container'>
          <div className='habit-list'>
            {(viewingHabitType === "all" || viewingHabitType === "undone") &&
              (user.data &&
              user.data.Me.habits.filter(habit =>
                habit.times_completed[0]
                  ? !isCompletedToday(parseInt(habit.times_completed[0].time)) //returns done habits
                  : true
              ).length > 0 ? (
                <>
                  <h3 style={{ marginBottom: "10px" }}>Whats Next</h3>
                  <HabitList
                    showDone={false}
                    filterFn={habit =>
                      habit.times_completed[0]
                        ? !isCompletedToday(
                            parseInt(habit.times_completed[0].time)
                          ) //returns done habits
                        : true
                    }
                    habits={user.data && user.data.Me.habits}
                    loading={user.loading}
                    isCompletedToday={isCompletedToday}
                  />
                </>
              ) : (
                <NoHabitsMessage
                  habits={user.data && user.data.Me.habits}
                  habitType='undone'
                />
              ))}
            {(viewingHabitType === "all" || viewingHabitType === "done") &&
              (user.data &&
              user.data.Me.habits.filter(habit =>
                habit.times_completed[0]
                  ? isCompletedToday(parseInt(habit.times_completed[0].time)) //returns done habits
                  : false
              ).length > 0 ? (
                <>
                  <h3 style={{ marginBottom: "10px" }}>Whats Done</h3>
                  <HabitList
                    filterFn={habit =>
                      habit.times_completed[0]
                        ? isCompletedToday(
                            parseInt(habit.times_completed[0].time)
                          ) //returns done habits
                        : false
                    }
                    showDone={true}
                    habits={user.data && user.data.Me.habits}
                    loading={user.loading}
                    isCompletedToday={isCompletedToday}
                  />
                </>
              ) : (
                <NoHabitsMessage
                  habitType='done'
                  habits={user.data && user.data.Me.habits}
                />
              ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dash;
