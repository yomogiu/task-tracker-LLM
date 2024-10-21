import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [editedTask, setEditedTask] = useState(task);

  // Reset form when task prop changes
  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleSave = () => {
    onSave(editedTask);
    // Clear the form
    setEditedTask({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      status: 'Not Started'
    });
  };

  return (
    <div className="space-y-2">
      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={editedTask.title}
        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Description"
        value={editedTask.description}
        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        type="date"
        value={editedTask.dueDate}
        onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Assignee"
        value={editedTask.assignee}
        onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
      />
      <select
        className="w-full p-2 border rounded"
        value={editedTask.status}
        onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Behind Schedule">Behind Schedule</option>
      </select>
      <div className="flex justify-end space-x-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
          <X className="w-4 h-4 mr-2 inline" /> Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
          <Check className="w-4 h-4 mr-2 inline" /> Save
        </button>
      </div>
    </div>
  );
};

export default TaskForm;