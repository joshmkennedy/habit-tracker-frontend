import React, { useState, useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import { navigate } from "@reach/router";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { ME_QUERY } from "../App";
import Habit from "./Habit";
import HabitList from "./HabitList";
export const isCompletedToday = timeStamp => {
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
          <h2>your habits</h2>
          <div>
            <p>viewing</p>
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
            {(viewingHabitType === "all" || viewingHabitType === "undone") && (
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
            )}
            {(viewingHabitType === "all" || viewingHabitType === "done") && (
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
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dash;
