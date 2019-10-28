import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { ME_QUERY } from "../App";

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

const NewHabit = () => {
  const [habitInput, setHabitInput] = useState("");

  const [addNewHabit, { newHabit }] = useMutation(NEW_HABIT_MUTATION, {
    variables: {
      habit_name: habitInput,
    },
    update(cache, payload) {
      const data = cache.readQuery({ query: ME_QUERY });
      const { habits } = data.Me;
      const newHabit = payload.data.CreateHabit;
      const newHabitList = [...habits, newHabit];
      data.Me.habits = newHabitList;
      cache.writeQuery({ query: ME_QUERY, data });
    },
    optimisticResponse: {
      __typename: "Mutation",
      CreateHabit: {
        __typename: "Habit",
        habit_id: 0,
        habit_name: habitInput,
        habit_created_at: new Date(),
        times_completed: [],
      },
    },
  });

  return (
    <>
      <h2>Creating new Habit</h2>
      <div>
        <input
          type='text'
          name='habit_name'
          value={habitInput}
          onChange={e => setHabitInput(e.target.value)}
        />
        <button
          onClick={() => {
            addNewHabit();
            setHabitInput("");
          }}
        >
          submit
        </button>
      </div>
    </>
  );
};

export default NewHabit;
