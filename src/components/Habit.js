import React, { useState, useEffect } from "react";
import { useSpring, animated, interpolate, useTransition } from "react-spring";
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
      x: down && mx > 0 ? mx : 0,
    });

    if (mx >= 150 && !down) {
      set({ x: 0 });
      return handleCompleteHabit();
    }
  });

  const slide = useTransition(isShowingOptions, null, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(100%)" },
  });

  return (
    <animated.li
      {...bind()}
      style={{
        background: x.interpolate({
          range: [0, 150],
          output: ["white", "green"],
          extrapolate: "clamp",
        }),
      }}
    >
      {<span className='habit-single__bg-text'>complete</span>}
      <animated.div {...bind()} style={{ left: x }} className='habit-single'>
        <span
          className='habit-single__name'
          style={{ background: "transparent" }}
        >
          <span className='habit-single__name'>{name}</span>
        </span>
        <div
          className='options'
          onMouseEnter={() => setIsShowingOptions(true)}
          onMouseLeave={() => setIsShowingOptions(false)}
          /* onTouchStart={() => setIsShowingOptions(true)}
          onTouchEnd={() => setIsShowingOptions(false)} */
        >
          {!isShowingOptions && (
            <span className='options-icon-wrapper'>
              <Icon color='#000' name='options' />
            </span>
          )}
          {slide.map(
            ({ item, key, props }) =>
              item && (
                <animated.ul key={key} style={props} className='options-list'>
                  <li className='complete'>
                    <button onClick={handleCompleteHabit}>
                      <Icon name='checkmark' color='#fff' />
                    </button>
                  </li>
                  <li className='edit'>
                    <button onClick={() => navigate(`/dashboard/${id}`)}>
                      <Icon name='edit' color='#fff' />
                    </button>
                  </li>
                  <li className='delete'>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        deleteHabit();
                      }}
                    >
                      <Icon name='delete' color='#fff' />
                    </button>
                  </li>
                </animated.ul>
              )
          )}
        </div>
      </animated.div>
    </animated.li>
  );
};

export default Habit;
