import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Link, navigate } from "@reach/router";

import { ME_QUERY } from "../App";
import HabitAdditionalSettings from "./HabitAdditionalSettings";
import Icon from "./Icon";

const UPDATE_HABIT_MUTATION = gql`
  mutation UPDATE_HABIT_MUTATION(
    $habit_id: ID!
    $habit_name: String!
    $habit_should_remind: Boolean
    $habit_reoccur_time: String!
  ) {
    UpdateHabit(
      habit_id: $habit_id
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

const HabitDetails = ({ habit_id }) => {
  const { data } = useQuery(ME_QUERY);
  const [habitDetails, setHabitDetails] = useState({
    habit_name: "",
    habit_should_remind: false,
    habit_reoccur_time: "daily",
  });
  useEffect(() => {
    if (habit_id !== undefined) {
      data &&
        data.Me.habits.find(habit => habit.habit_id === habit_id) &&
        setHabitDetails({
          habit_name: data.Me.habits.find(habit => habit.habit_id === habit_id)
            .habit_name,
          habit_should_remind: data.Me.habits.find(
            habit => habit.habit_id === habit_id
          ).habit_should_remind,
          habit_reoccur_time: data.Me.habits.find(
            habit => habit.habit_id === habit_id
          ).habit_reoccur_time,
        });
    } else {
      setHabitDetails({
        habit_name: "",
        habit_should_remind: false,
        habit_reoccur_time: "daily",
      });
    }
  }, [habit_id, data]);

  const [updateHabit] = useMutation(UPDATE_HABIT_MUTATION, {
    variables: {
      habit_id: habit_id,
      habit_name: habitDetails.habit_name,
      habit_should_remind: habitDetails.habit_should_remind,
      habit_reoccur_time: habitDetails.habit_reoccur_time,
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
        habit_name: habitDetails.habit_name,
        times_completed: data
          ? data.Me.habits.filter(habit => habit.habit_id === habit_id)[0] &&
            data.Me.habits.filter(habit => habit.habit_id === habit_id)[0]
              .times_completed
          : null,
        habit_created_at:
          data &&
          data.Me.habits.filter(habit => habit.habit_id === habit_id)[0] &&
          data.Me.habits.filter(habit => habit.habit_id === habit_id)[0]
            .habit_created_at,
      },
    },
  });

  const handleUpdateHabit = () => {
    updateHabit();
  };

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
      <Link className='habit-details__close' to='/dashboard'>
        <Icon name='close' color='#484b5e' />
      </Link>
      {habit_id === undefined ? <h3>New Habit</h3> : <h3> Update Habit</h3>}
      <span className='habit-details__name'>
        <input
          type='text'
          value={habitDetails.habit_name}
          onChange={e =>
            setHabitDetails({ ...habitDetails, habit_name: e.target.value })
          }
        />
        <HabitAdditionalSettings
          habitDetails={habitDetails}
          setHabitDetails={setHabitDetails}
        />
        <button
          onClick={habit_id === undefined ? addNewHabit : handleUpdateHabit}
        >
          Save
        </button>
      </span>
    </div>
  );
};

export default HabitDetails;
