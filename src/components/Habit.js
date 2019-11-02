import React, { useState, useEffect } from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { useDrag } from "react-use-gesture";
import { navigate } from "@reach/router";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { ME_QUERY } from "../App";
import { isCompletedToday } from "./Dash";
import Icon from "./Icon";

const DELETE_HABIT_MUTATION = gql`
  mutation DELETE_HABIT_MUTATION($habit_id: ID!) {
    DeleteHabit(habit_id: $habit_id) {
      habit_id
    }
  }
`;

const COMPLETE_HABIT_MUTATION = gql`
  mutation COMPLETE_HABIT_MUTATION($habit_id: ID!) {
    CompleteAHabit(habit_id: $habit_id) {
      habit_id
      habit_name
      habit_created_at
      times_completed {
        time
      }
    }
  }
`;

const Habit = ({
  id,
  name,
  habit_created_at,
  completed_last,
  times_completed,
}) => {
  //* DELETE THE HABIT
  const [deleteHabit, { error, loading }] = useMutation(DELETE_HABIT_MUTATION, {
    variables: {
      habit_id: id,
    },
    update(cache, payload) {
      const data = cache.readQuery({ query: ME_QUERY });
      const newData = data.Me.habits.filter(({ habit_id }) => habit_id !== id);
      data.Me.habits = newData;
      cache.writeQuery({
        query: ME_QUERY,
        data,
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      DeleteHabit: {
        __typename: Habit,
        habit_id: id,
      },
    },
  });

  //* IS THE HABIT COMPLETED
  const [isCompleted, setIsCompleted] = useState(false);
  useEffect(() => {
    setIsCompleted(isCompletedToday(completed_last));
  }, [completed_last]);
  //* COMPLETE THE HABIT
  const [isShowingOptions, setIsShowingOptions] = useState(false);
  const [completeAHabit] = useMutation(COMPLETE_HABIT_MUTATION, {
    variables: {
      habit_id: id,
    },
    update(cache, payload) {
      const data = cache.readQuery({ query: ME_QUERY });
      const removeOldData = data.Me.habits.filter(
        ({ habit_id }) => habit_id !== payload.data.CompleteAHabit.habit_id
      );
      const newData = [...removeOldData, payload.data.CompleteAHabit];
      data.Me.habits = newData;

      cache.writeQuery({
        query: ME_QUERY,
        data,
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      CompleteAHabit: {
        __typename: Habit,
        habit_id: id,
        habit_name: name,
        habit_created_at,
        times_completed,
      },
    },
  });
  function handleCompleteHabit() {
    completeAHabit();
  }
  const [{ x }, set] = useSpring(() => ({
    x: 0,
  }));

  // 1. Define the gesture
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    set({
      x: down ? mx : 0,
    });

    if (mx >= 100 && !down) {
      set({ x: 0 });
      return handleCompleteHabit();
    }
  });
  function handleDeleteHabit() {}

  return (
    <animated.li
      {...bind()}
      style={{
        background: x.interpolate({
          range: [0, 100],
          output: ["white", "green"],
          extrapolate: "clamp",
        }),
      }}
    >
      <animated.div {...bind()} style={{ left: x }} className='habit-single'>
        <button
          className='habit-single__name'
          onClick={() => navigate(`/dashboard/${id}`)}
          style={{ background: "transparent" }}
        >
          <span className='habit-single__name'>{name}</span>
        </button>
        <div
          className='options'
          onMouseEnter={() => setIsShowingOptions(true)}
          onMouseLeave={() => setIsShowingOptions(false)}
        >
          {!isShowingOptions && (
            <span className='options-icon-wrapper'>
              <Icon color='#000' name='options' />
            </span>
          )}
          {isShowingOptions && (
            <ul className='options-list'>
              <li className='complete'>
                <button onClick={handleCompleteHabit}>
                  <Icon name='checkmark' color='#484b5e' />
                </button>
              </li>
              <li className='delete'>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    deleteHabit();
                  }}
                >
                  delete
                </button>
              </li>
              <li className='edit'>
                <button onClick={() => navigate(`/dashboard/${id}`)}>
                  edit
                </button>
              </li>
            </ul>
          )}
        </div>
      </animated.div>
    </animated.li>
  );
};

export default Habit;
