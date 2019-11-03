import React from "react";

const NoHabitMessage = ({ habits, habitType }) => {
  if (habits && habits.length > 0) {
    if (habitType === "done") {
      return <p>Start completing some habits today!!</p>;
    } else {
      return <p>Great Job! You completed all your habits</p>;
    }
  } else {
    return <p>Add some habits to get started</p>;
  }
};

export default NoHabitMessage;
