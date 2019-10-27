import React, { useState } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { ME_QUERY } from "../App";
import Habit from "./Habit";

const NEW_HABIT_MUTATION = gql`
  mutation NEW_HABIT_MUTATION($habit_name: String!) {
    CreateHabit(habit_name: $habit_name) {
      habit_id
      habit_name
      habit_created_at
      times_completed {
        time
      }
    }
  }
`;

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
  const [newHabitInput, setNewHabitInput] = useState("");

  const [addNewHabit, { newHabit }] = useMutation(NEW_HABIT_MUTATION, {
    variables: {
      habit_name: newHabitInput,
    },
    update(cache, payload) {
      const data = cache.readQuery({ query: ME_QUERY });
      const { habits } = data.Me;
      const newHabit = payload.data.CreateHabit;
      const newHabitList = [...habits, newHabit];
      data.Me.habits = newHabitList;
      cache.writeQuery({ query: ME_QUERY, data });
    },
  });

  return (
    <div className='wrapper'>
      <div className='container'>
        <h2>your habits</h2>

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
