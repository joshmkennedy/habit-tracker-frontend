import React from "react";

const HabitAdditionalSettings = ({ habitDetails, setHabitDetails }) => {
  const { habit_should_remind, habit_reoccur_time } = habitDetails;
  const options = ["daily", "weekly", "monthly"];
  return (
    <>
      <label htmlFor='reoccur-time'>
        How Often
        <select
          value={habit_reoccur_time}
          onChange={e =>
            setHabitDetails({
              ...habitDetails,
              habit_reoccur_time: e.target.value,
            })
          }
        >
          <option value={options[0]}>daily</option>
          <option value={options[1]}>weekly</option>
          <option value={options[2]}>monthly</option>
        </select>
      </label>
      <label htmlFor='should-remind'>
        Should Be Reminded Of
        <input
          type='checkbox'
          name='should-remind'
          id='should-remind'
          checked={habit_should_remind}
          onChange={() =>
            setHabitDetails({
              ...habitDetails,
              habit_should_remind: !habit_should_remind,
            })
          }
        />
      </label>
    </>
  );
};

export default HabitAdditionalSettings;
