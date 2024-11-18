import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Calendar, Clock, UserCircle, Edit2, Trash2, Mail, X, Copy, CheckSquare, Send, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import MonthlyCalendar from './MonthlyCalendar';
import TaskSummaryTable from './TaskSummaryTable';
import TaskForm from './TaskForm';
import OllamaRequestHandler from './OllamaRequestHandler';
import { useRouter } from 'next/router';
import { Settings as SettingsIcon } from 'lucide-react';

const TaskDashboard = () => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: '',
    status: 'Not Started'
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredTask, setHoveredTask] = useState(null);

  const [emailContent, setEmailContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [emailVersions, setEmailVersions] = useState([]);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const chatEndRef = useRef(null);
  const router = useRouter();

  
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;

    const newMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    const context = chatMessages.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const fullContext = `${emailVersions[currentEmailIndex]}\n\nChat history:\n${context}\n\nUser: ${chatInput}`;
    let prompt = "Continue the conversation based on the email content and chat history:";
    
    if (chatInput.toLowerCase().includes("rewrite the email")) {
      prompt = "Rewrite the email based on the user's request. Format the response as a proper email:";
    }

    const response = await OllamaRequestHandler(prompt, fullContext);

    setChatMessages(prev => [...prev, { 
      role: 'assistant', 
      content: response,
      isEmail: chatInput.toLowerCase().includes("rewrite the email")
    }]);

    if (chatInput.toLowerCase().includes("rewrite the email")) {
      setEmailVersions(prev => [...prev, response]);
      setCurrentEmailIndex(prev => prev + 1);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const navigateEmail = (direction) => {
    setCurrentEmailIndex(prev => {
      const newIndex = prev + direction;
      return Math.max(0, Math.min(newIndex, emailVersions.length - 1));
    });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (emailContent) {
      setEmailVersions([emailContent]);
      setCurrentEmailIndex(0);
    }
  }, [emailContent]);

  const handleEmailGeneration = async (task) => {
    const context = `Task Title: ${task.title}\nDescription: ${task.description}\nDue Date: ${task.dueDate}\nAssignee: ${task.assignee}\nStatus: ${task.status}`;
    const prompt = "Generate a concise email about the following task, including its key details and any necessary actions:";
    
    const content = await OllamaRequestHandler(prompt, context);
    setEmailContent(content);
    setIsModalOpen(true);
  };

  const copyToClipboard = () => {
    const currentEmailContent = emailVersions[currentEmailIndex];
    navigator.clipboard.writeText(currentEmailContent).then(() => {
      alert('Current email version copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignee: '',
      status: 'Not Started'
    });
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskField = (taskId, field, value) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, [field]: value } : task
    ));
  };

  const startEditing = (taskId) => {
    setEditingTaskId(taskId);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
  };

  const saveEdit = (editedTask) => {
    setTasks(tasks.map(task => task.id === editedTask.id ? editedTask : task));
    setEditingTaskId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-200';
      case 'In Progress': return 'bg-blue-200';
      case 'Completed': return 'bg-green-200';
      case 'Behind Schedule': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthlyTasks = () => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getMonth() === currentMonth.getMonth() &&
             taskDate.getFullYear() === currentMonth.getFullYear();
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const handleMonthChange = (change) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + change, 1));
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleBulkEmailGeneration = async () => {
    const selectedTasksData = tasks.filter(task => selectedTasks.includes(task.id));
    const context = selectedTasksData.map(task => 
      `Task Title: ${task.title}\nDescription: ${task.description}\nDue Date: ${task.dueDate}\nAssignee: ${task.assignee}\nStatus: ${task.status}`
    ).join('\n\n');
    
    const prompt = "Generate a concise email summarizing the following tasks, including their key details and any necessary actions:";
    
    const content = await OllamaRequestHandler(prompt, context);
    setEmailContent(content);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Task Dashboard</h1>
            {/* Settings Button */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  console.log('Settings button clicked');
                  router.push('/settings');
                }}
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-lg"
              >
                <SettingsIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </div>
        </div>

        {/* Calendar and Task Summary */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <MonthlyCalendar
              month={currentMonth}
              tasks={tasks}
              getStatusColor={getStatusColor}
              setHoveredTask={setHoveredTask}
              onMonthChange={handleMonthChange}
            />
          </div>
          <TaskSummaryTable tasks={tasks} />
        </div>

        {/* Tasks and Add New Task Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tasks for the Month */}
          <div className="col-span-2 bg-white p-4 rounded shadow">
            {/* Tasks Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">
                Tasks for{' '}
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={handleBulkEmailGeneration}
                disabled={selectedTasks.length === 0}
                className={`flex items-center px-4 py-2 rounded ${
                  selectedTasks.length > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Generate Email for Selected Tasks
              </button>
            </div>

            {/* Tasks List */}
            {getMonthlyTasks().length > 0 ? (
              getMonthlyTasks().map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg mb-2 ${getStatusColor(task.status)} flex items-center`}
                >
                  {/* Task Selection Checkbox */}
                  <div className="mr-2">
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </div>
                  {/* Task Details */}
                  <div className="flex-grow">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p>{task.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{task.dueDate}</span>
                      </div>
                      <div className="flex items-center">
                        <UserCircle className="w-4 h-4 mr-2" />
                        <span>{task.assignee}</span>
                      </div>
                      <button
                        onClick={() => handleEmailGeneration(task)}
                        className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Generate Email
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks for this month.</p>
            )}
          </div>

          {/* Add New Task Form */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-2 text-primary">Add New Task</h2>
            <TaskForm
              task={newTask}
              onSave={addTask}
              onCancel={() =>
                setNewTask({
                  title: '',
                  description: '',
                  dueDate: '',
                  assignee: '',
                  status: 'Not Started',
                })
              }
            />
          </div>
        </div>

        {/* All Tasks */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-primary">All Tasks</h2>
          {tasks.map((task) => (
            <div
              id={`task-${task.id}`}
              key={task.id}
              className={`p-4 rounded-lg mb-4 ${getStatusColor(task.status)}`}
            >
              {editingTaskId === task.id ? (
                <TaskForm task={task} onSave={saveEdit} onCancel={cancelEditing} />
              ) : (
                <>
                  {/* Task Header */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{task.title}</h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskField(task.id, 'status', e.target.value)}
                        className="p-1 border rounded"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Behind Schedule">Behind Schedule</option>
                      </select>
                      <input
                        type="date"
                        value={task.dueDate}
                        onChange={(e) => updateTaskField(task.id, 'dueDate', e.target.value)}
                        className="p-1 border rounded"
                      />
                      <button
                        onClick={() => startEditing(task.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 hover:bg-red-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  {/* Task Details */}
                  <p>{task.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{task.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{getDaysRemaining(task.dueDate)} days left</span>
                    </div>
                    <div className="flex items-center">
                      <UserCircle className="w-4 h-4 mr-2" />
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* End of Main Container */}

      {/* Hovered Task Tooltip */}
      {hoveredTask && (
        <div
          className="fixed bg-white border p-2 rounded shadow-lg z-10"
          style={hoveredTask.style}
        >
          {hoveredTask.content}
        </div>
      )}

      {/* Modal for Email Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl h-5/6 flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-primary">Generated Email Content</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="flex-grow flex flex-col overflow-hidden">
              {/* Email Versions */}
              <div className="bg-gray-100 p-4 rounded mb-4 overflow-y-auto flex-shrink-0 max-h-1/2">
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => navigateEmail(-1)}
                    disabled={currentEmailIndex === 0}
                    className={`p-1 rounded ${
                      currentEmailIndex === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span>
                    Version {currentEmailIndex + 1} of {emailVersions.length}
                  </span>
                  <button
                    onClick={() => navigateEmail(1)}
                    disabled={currentEmailIndex === emailVersions.length - 1}
                    className={`p-1 rounded ${
                      currentEmailIndex === emailVersions.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-500 hover:bg-blue-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <pre className="whitespace-pre-wrap">
                  {emailVersions[currentEmailIndex]}
                </pre>
              </div>
              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto mb-4 border rounded p-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.isEmail ? (
                      <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-left">
                        {msg.content}
                      </pre>
                    ) : (
                      <span
                        className={`inline-block p-2 rounded ${
                          msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        {msg.content}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              {/* Chat Input and Actions */}
              <div className="flex justify-between items-center mb-2">
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Clear Chat
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Current Email
                </button>
              </div>
              <form onSubmit={handleChatSubmit} className="flex">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow border rounded-l p-2"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDashboard;