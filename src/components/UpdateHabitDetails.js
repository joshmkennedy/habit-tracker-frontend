import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { ME_QUERY } from "../App";

const UPDATE_HABIT_MUTATION = gql`
  mutation UPDATE_HABIT_MUTATION($habit_id: ID!, $habit_name: String!) {
    UpdateHabit(habit_id: $habit_id, habit_name: $habit_name) {
      habit_id
      habit_name
      habit_created_at
      times_completed {
        time
      }
    }
  }
`;

const UpdateHabitDetails = ({ habit_id }) => {
  const [habitInput, setHabitInput] = useState("");
  const { data } = useQuery(ME_QUERY);

  const [updateHabit] = useMutation(UPDATE_HABIT_MUTATION, {
    variables: {
      habit_id: habit_id,
      habit_name: habitInput,
    },
    update(cache, payload) {
      const data = cache.readQuery({ query: ME_QUERY });
      const removeOldData = data.Me.habits.filter(
        ({ habit_id }) => habit_id !== payload.data.UpdateHabit.habit_id
      );
      const newData = [...removeOldData, payload.data.UpdateHabit];

      data.Me.habits = newData;
      cache.writeQuery({
        query: ME_QUERY,
        data,
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      UpdateHabit: {
        __typename: "Habit",
        habit_id: habit_id,
        habit_name: habitInput,
        times_completed: data
          ? data.Me.habits.filter(habit => habit.habit_id === habit_id)[0]
              .times_completed
          : null,
        habit_created_at:
          data &&
          data.Me.habits.filter(habit => habit.habit_id === habit_id)[0]
            .habit_created_at,
      },
    },
  });

  const handleUpdateHabit = () => {
    updateHabit();
    //setIsBeingEdited(false);
  };

  return (
    <div>
      Updating old Habit
      <span>
        <input
          type='text'
          value={habitInput}
          onChange={e => setHabitInput(e.target.value)}
        />
        <button onClick={handleUpdateHabit}> Save</button>
      </span>
    </div>
  );
};

export default UpdateHabitDetails;
