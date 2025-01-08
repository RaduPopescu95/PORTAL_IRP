"use client";
import { useEffect, useState } from "react";

// Funcție pentru a ajusta datele sărbătorilor publice prin scăderea unei zile
const adjustHolidays = (holidays) => {
  return new Set(
    Array.from(holidays).map((holiday) => {
      const date = new Date(holiday);
      date.setDate(date.getDate() - 1); // Scădem o zi
      return date.toISOString().split("T")[0];
    })
  );
};

// Inițializăm zilele libere din România pentru anul curent
const initialPublicHolidays = adjustHolidays(
  new Set([
    "2024-01-01",
    "2024-01-02",
    "2024-01-24",
    "2024-04-14",
    "2024-04-15",
    "2024-05-01",
    "2024-06-01",
    "2024-06-17",
    "2024-08-15",
    "2024-11-30",
    "2024-12-01",
    "2024-12-25",
    "2024-12-26",
  ])
);

// Funcție care verifică dacă o dată este o zi lucrătoare
const isWorkingDay = (date, customHolidays) => {
  const day = date.getDay();
  const dateString = date.toISOString().split("T")[0];
  return day !== 0 && day !== 6 && !customHolidays.has(dateString);
};

// Funcție care generează calendarul pentru întregul an
const generateFullYearCalendar = (
  currentYear,
  customHolidays,
  fixedOZUNumbers
) => {
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31);
  const allDays = [];

  let currentOZU = 0;

  // Generăm numerele OZU pentru fiecare zi din an
  for (
    let date = startOfYear;
    date <= endOfYear;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0];
    let ozuNumber = null;

    if (fixedOZUNumbers[dateString]) {
      currentOZU = fixedOZUNumbers[dateString];
      ozuNumber = currentOZU;
    } else if (isWorkingDay(date, customHolidays)) {
      currentOZU += 1;
      ozuNumber = currentOZU;
    }

    allDays.push({ date: new Date(date), ozuNumber });
  }

  return allDays;
};

const generateCalendarForMonth = (calendarData, currentMonth, currentYear) => {
  return calendarData.filter(
    ({ date }) =>
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
  );
};

const OZUCalendar = () => {
  const [customHolidays, setCustomHolidays] = useState(() => {
    // Încărcăm zilele libere din localStorage sau folosim valorile inițiale
    const savedHolidays = localStorage.getItem("customHolidays");
    return savedHolidays
      ? new Set(JSON.parse(savedHolidays))
      : new Set(initialPublicHolidays);
  });

  const [fixedOZUNumbers, setFixedOZUNumbers] = useState(() => {
    // Încărcăm numerele OZU din localStorage sau folosim un obiect gol
    const savedOZUNumbers = localStorage.getItem("fixedOZUNumbers");
    return savedOZUNumbers ? JSON.parse(savedOZUNumbers) : {};
  });

  const [calendarDays, setCalendarDays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [fullYearCalendar, setFullYearCalendar] = useState([]);

  useEffect(() => {
    const fullCalendar = generateFullYearCalendar(
      currentYear,
      customHolidays,
      fixedOZUNumbers
    );
    setFullYearCalendar(fullCalendar);

    const calendar = generateCalendarForMonth(
      fullCalendar,
      currentMonth,
      currentYear
    );
    setCalendarDays(calendar);
  }, [currentMonth, currentYear, customHolidays, fixedOZUNumbers]);

  const toggleHoliday = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const newHolidays = new Set(customHolidays);

    if (newHolidays.has(dateString)) {
      newHolidays.delete(dateString);
    } else {
      newHolidays.add(dateString);
    }

    setCustomHolidays(newHolidays);
    localStorage.setItem(
      "customHolidays",
      JSON.stringify(Array.from(newHolidays))
    ); // Salvăm în localStorage
  };

  const handleOZUChange = (date, event) => {
    const dateString = date.toISOString().split("T")[0];
    const value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      setFixedOZUNumbers((prev) => {
        const newOZUNumbers = { ...prev, [dateString]: value };
        localStorage.setItem("fixedOZUNumbers", JSON.stringify(newOZUNumbers)); // Salvăm în localStorage
        return newOZUNumbers;
      });
    } else {
      setFixedOZUNumbers((prev) => {
        const newOZUNumbers = { ...prev };
        delete newOZUNumbers[dateString];
        localStorage.setItem("fixedOZUNumbers", JSON.stringify(newOZUNumbers)); // Salvăm în localStorage
        return newOZUNumbers;
      });
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  useEffect(() => {
    const calendar = generateCalendarForMonth(
      fullYearCalendar,
      currentMonth,
      currentYear
    );
    setCalendarDays(calendar);
  }, [fullYearCalendar, currentMonth, currentYear]);

  let today = new Date(); // Get today's date
  today.setDate(today.getDate() - 1); // Subtract one day
  today = today.toISOString().split("T")[0]; // Convert to string format

  const isToday = (date) => {
    // date.setDate(date.getDate() - 1);
    return date.toISOString().split("T")[0] === today;
  };

  return (
    <>
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>←</button>
        <h2>
          Calendar OZU -{" "}
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
          })}{" "}
          {currentYear}
        </h2>
        <button onClick={handleNextMonth}>→</button>
      </div>
      <div className="calendar">
        {calendarDays.map(({ date, ozuNumber }, index) => (
          <div
            key={index}
            className={`calendar-day ${
              isWorkingDay(date, customHolidays)
                ? "working-day"
                : "non-working-day"
            } ${isToday(date) ? "today" : ""}`}
            onClick={() => toggleHoliday(date)}
          >
            <div className="date">{date.getDate()}</div>
            {isWorkingDay(date, customHolidays) && (
              <input
                type="number"
                value={ozuNumber || ""}
                onChange={(event) => handleOZUChange(date, event)}
                className="ozu-input"
                onClick={(e) => e.stopPropagation()} // Previene propagarea click-ului la elementul părinte
              />
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .calendar-header button {
          background-color: #f0f0f0;
          border: none;
          padding: 10px;
          cursor: pointer;
        }
        .calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }
        .calendar-day {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: center;
          background-color: #f9f9f9;
          cursor: pointer;
        }
        .calendar-day:hover {
          background-color: #e0e0e0;
        }
        .working-day {
          background-color: #e0ffe0;
        }
        .non-working-day {
          background-color: #ffe0e0;
        }
        .ozu-input {
          margin-top: 5px;
          width: 100%;
          text-align: center;
          font-weight: bold;
          cursor: text;
        }
        .today {
          border: 2px solid darkblue; /* Dark blue border for today */
        }
      `}</style>
    </>
  );
};

export default OZUCalendar;
