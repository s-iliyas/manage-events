import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

const DatePickerComponent = (props: any) => {
  let handleColor = (time: any) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };

  return (
    <DatePicker
      showTimeSelect
      selected={props.dueTime}
      onChange={(date: any) => props.setDueTime(date)}
      timeClassName={handleColor}
      className="border rounded-md p-1 w-full"
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};

export default DatePickerComponent;
