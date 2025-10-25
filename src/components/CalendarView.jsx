import { useState } from "react";

function CalendarView({ tasks, classes }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(today.setDate(diff));
  });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
  };

  const getMonthYear = () => {
    const month = currentWeekStart.toLocaleString("default", { month: "long" });
    const year = currentWeekStart.getFullYear();
    return `${month} ${year}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>{getMonthYear()}</h2>
        <div className="calendar-controls">
          <button className="btn-icon" onClick={() => navigateWeek(-1)}>
            ◀
          </button>
          <button className="btn btn-secondary" onClick={goToToday}>
            Today
          </button>
          <button className="btn-icon" onClick={() => navigateWeek(1)}>
            ▶
          </button>
        </div>
      </div>

      <div className="week-view">
        {weekDays.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          const dayNumber = date.getDate();

          return (
            <div
              key={index}
              className={`day-column ${isToday(date) ? "today" : ""}`}
            >
              <div className="day-header">
                <span className="day-name">{dayName}</span>
                <span className="day-number">{dayNumber}</span>
              </div>

              <div className="day-content">
                {dayTasks.length === 0 ? (
                  <div className="empty-day">No tasks</div>
                ) : (
                  dayTasks.map((task) => {
                    const taskClass = classes.find(
                      (c) => c.courseTitle === task.class
                    );
                    const classColor = taskClass?.color || "#667eea";

                    return (
                      <div
                        key={task.id}
                        className="task-card"
                        style={{ borderLeft: `4px solid ${classColor}` }}
                      >
                        <div className="task-card-title">{task.taskTitle}</div>
                        <div className="task-card-class">{task.class}</div>
                        {task.workload && (
                          <div className="task-card-workload">
                            Workload: {task.workload}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
