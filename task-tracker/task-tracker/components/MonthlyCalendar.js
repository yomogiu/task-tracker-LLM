import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthlyCalendar = ({ month, tasks, getStatusColor, setHoveredTask, onMonthChange }) => {
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = [...Array(daysInMonth).keys()].map(i => i + 1);
  const paddedDays = [...Array(firstDayOfMonth).fill(null), ...days];

  const getTasksForDay = (day) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getUTCDate() === day &&
             taskDate.getUTCMonth() === month.getMonth() &&
             taskDate.getUTCFullYear() === month.getFullYear();
    });
  };

  const handleTaskHover = (e, tasks) => {
    const rect = e.target.getBoundingClientRect();
    setHoverPosition({ x: rect.left, y: rect.bottom });
    setHoveredTask({
      content: (
        <div>
          {tasks.map(task => (
            <p key={task.id}><strong>{task.title}</strong>: {task.dueDate}</p>
          ))}
        </div>
      ),
      style: { 
        position: 'fixed', 
        left: `${rect.left}px`, 
        top: `${rect.bottom}px` 
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange(-1)} className="p-2 bg-gray-200 rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold">
          {month.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => onMonthChange(1)} className="p-2 bg-gray-200 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {paddedDays.map((day, index) => (
          <div key={index} className="h-20 border p-1 relative">
            {day && <span>{day}</span>}
            {day && getTasksForDay(day).length > 0 && (
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(getTasksForDay(day)[0].status)} absolute bottom-1 right-1 cursor-pointer`}
                onMouseEnter={(e) => handleTaskHover(e, getTasksForDay(day))}
                onMouseLeave={() => setHoveredTask(null)}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendar;