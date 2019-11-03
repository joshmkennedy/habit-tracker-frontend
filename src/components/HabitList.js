/* 
how to send a

*/

import React from "react";
import Habit from "./Habit";
import isCompletedToday from "./Dash";

const HabitList = ({ showDone, habits, loading, filterFn }) => {
  return (
    <ul
      className={`habit-list__list habit-list__list--${
        showDone ? "done" : "undone"
      }`}
    >
      {loading && <p>loading...</p>}
      {habits &&
        habits
          .filter(habit => {
            return filterFn(habit);

            //if there are times completed check to see if they are today if so ignore
            // if there are no times include
          })
          .sort((a, b) =>
            parseInt(a.habit_created_at) > parseInt(b.habit_created_at) ? 1 : -1
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
  );
};

export default HabitList;
