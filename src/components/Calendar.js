import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { format } from "date-fns";

function CycleCalendar() {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/periods").then((response) => {
      setDates(response.data.map((period) => format(new Date(period.date), "yyyy-MM-dd")));
    });
  }, []);

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Menstrual Cycle Calendar</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <Calendar
          tileClassName={({ date }) =>
            dates.includes(format(date, "yyyy-MM-dd")) ? "bg-blue-400 text-white rounded-full" : ""
          }
        />
      </div>
    </div>
  );
}

export default CycleCalendar;
