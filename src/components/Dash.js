import React, { useState } from "react";

import { navigate } from "@reach/router";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { ME_QUERY } from "../App";
import Habit from "./Habit";

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

  return (
    <div className='wrapper'>
      <div className='container'>
        <h2>your habits</h2>
        <button onClick={() => navigate("/dashboard/new")}>new*</button>
        <ul>
          {user.loading && <p>loading...</p>}
          {user.data &&
            user.data.Me.habits
              .filter(habit =>
                //if there are times completed check to see if they are today if so ignore
                // if there are no times include
                habit.times_completed[0]
                  ? !isCompletedToday(parseInt(habit.times_completed[0].time)) //false if today true if not
                  : true
              )
              .sort((a, b) =>
                parseInt(a.habit_created_at) > parseInt(b.habit_created_at)
                  ? 1
                  : -1
              )
              .map(habit => {
                const {
                  habit_id,
                  habit_name,
                  habit_created_at,
                  times_completed,
                } = habit;

                return (
                  <Habit
                    key={habit_id}
                    name={habit_name}
                    habit_created_at={habit_created_at}
                    id={habit_id}
                    times_completed={habit.times_completed}
                    completed_last={
                      times_completed[0] && parseInt(times_completed[0].time)
                    }
                  />
                );
              })}
        </ul>

        <ul>
          {user.data &&
            user.data.Me.habits
              .filter(habit =>
                //if there are times completed check to see if they are today if so include
                habit.times_completed[0]
                  ? isCompletedToday(parseInt(habit.times_completed[0].time)) //true if today false if not
                  : false
              )
              .sort((a, b) =>
                parseInt(a.habit_created_at) > parseInt(b.habit_created_at)
                  ? 1
                  : -1
              )
              .map(habit => {
                const { habit_id, habit_name, times_completed } = habit;
                return (
                  <Habit
                    key={habit_id}
                    name={habit_name}
                    id={habit_id}
                    {...habit}
                    completed_last={
                      times_completed[0] && parseInt(times_completed[0].time)
                    }
                  />
                );
              })}
        </ul>
      </div>

      {children}
    </div>
  );
};

export default Dash;
