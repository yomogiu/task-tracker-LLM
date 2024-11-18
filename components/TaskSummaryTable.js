import React from 'react';

const TaskSummaryTable = ({ tasks }) => {
    const tasksByMonth = tasks.reduce((acc, task) => {
      const month = new Date(task.dueDate).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2 text-primary">Task Summary</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Month</th>
              <th className="border p-2">Number of Tasks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tasksByMonth).map(([month, count]) => (
              <tr key={month}>
                <td className="border p-2">{month}</td>
                <td className="border p-2">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default TaskSummaryTable;