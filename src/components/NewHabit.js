///!deprecated dont use
//?just use habit details with habit_id === undefined by setting the path to new

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { navigate, Link } from "@reach/router";

import { ME_QUERY } from "../App";
import HabitAdditionalSettings from "./HabitAdditionalSettings";

const NEW_HABIT_MUTATION = gql`
  mutation NEW_HABIT_MUTATION(
    $habit_name: String!
    $habit_should_remind: Boolean!
    $habit_reoccur_time: String!
  ) {
    CreateHabit(
      habit_name: $habit_name
      habit_should_remind: $habit_should_remind
      habit_reoccur_time: $habit_reoccur_time
    ) {
      habit_id
      habit_name
      habit_should_remind
      habit_reoccur_time
      habit_created_at
      times_completed {
        time
      }
    }
  }
`;

const NewHabit = () => {
  const [habitDetails, setHabitDetails] = useState({
    habit_name: "",
    habit_should_remind: false,
    habit_reoccur_time: "daily",
  });

  const [addNewHabit, { newHabit }] = useMutation(NEW_HABIT_MUTATION, {
    variables: {
      habit_name: habitDetails.habit_name,
      habit_should_remind: habitDetails.habit_should_remind,
      habit_reoccur_time: habitDetails.habit_reoccur_time,
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
        habit_name: habitDetails.habit_name,
        habit_created_at: new Date(),
        times_completed: [],
        habit_reoccur_time: "weekly",
        habit_should_remind: false,
      },
    },
    onCompleted(data) {
      navigate(`/dashboard/${data.CreateHabit.habit_id}`);
    },
  });

  return (
    <div className='habit-single__details'>
      {console.log(
        "deprecated dont use just use habit details with habit_id === undefined by setting the path to new"
      )}
      <Link className='habit-details__close' to='/dashboard'>
        close
      </Link>
      <h2>Creating A New Habit</h2>
      <div>
        <span className='habit-details__name'>
          <input
            type='text'
            name='habit_name'
            value={habitDetails.habit_name}
            onChange={e =>
              setHabitDetails({ ...habitDetails, habit_name: e.target.value })
            }
          />
        </span>
        <HabitAdditionalSettings
          habitDetails={habitDetails}
          setHabitDetails={setHabitDetails}
        />
        <button
          onClick={() => {
            addNewHabit();
          }}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default NewHabit;
