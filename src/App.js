import { useEffect, useState } from 'react';

export default function App() {
   const [taskList, setTaskList] = useState(getListFromStorage);

   function handleAddItem(item) {
      setTaskList((list) => [...list, item]);
   }

   function handleDeleteItem(id) {
      setTaskList((list) => list.filter((item) => item.id !== id));
   }

   function handleToggleCompleted(id) {
      setTaskList((list) =>
         list.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item
         )
      );
   }

   function getListFromStorage() {
      const storedList = localStorage.getItem('taskList');
      return JSON.parse(storedList);
   }

   useEffect(() => {
      localStorage.setItem('taskList', JSON.stringify(taskList));
   }, [taskList]);

   return (
      <div>
         <TaskForm onAddItem={handleAddItem} />
         <TaskList
            taskList={taskList}
            onDeleteItem={handleDeleteItem}
            onToggleCompleted={handleToggleCompleted}
         />
      </div>
   );
}

// TaskForm Component
function TaskForm({ onAddItem }) {
   const [taskInput, setTaskInput] = useState('');

   function handleSubmit(e) {
      e.preventDefault();

      if (taskInput.trim() === '') return;

      const taskDescription = taskInput;
      const id = Date.now();

      const newItem = {
         id,
         taskDescription,
         completed: false,
      };

      onAddItem(newItem);
      setTaskInput('');
   }

   return (
      <div className='task-form-container'>
         <form className='task-form' onSubmit={handleSubmit}>
            <button className='add-task-button'>
               <i className='fas fa-plus-circle'></i>
            </button>
            <input
               className='task-input'
               type='text'
               placeholder='Enter a new task'
               value={taskInput}
               onChange={(e) => setTaskInput(e.target.value)}
            />
         </form>
      </div>
   );
}

// TaskList Component
function TaskList({ taskList, onDeleteItem, onToggleCompleted }) {
   if (taskList.length === 0) return null;

   // Sort tasks: Incomplete tasks first, then completed tasks
   const sortedTasks = taskList
      .slice()
      .sort((a, b) => a.completed - b.completed);

   const taskNum = sortedTasks.length;
   const completedNum = sortedTasks.filter((task) => task.completed).length;

   return (
      <>
         <div className='task-summary'>
            Tasks ({taskNum}) - Completed ({completedNum})
         </div>
         <ul className='task-list'>
            {sortedTasks.map((task) => (
               <TaskItem
                  task={task}
                  onDeleteItem={onDeleteItem}
                  onToggleCompleted={onToggleCompleted}
                  key={task.id}
               />
            ))}
         </ul>
      </>
   );
}

// TaskItem Component
function TaskItem({ task, onDeleteItem, onToggleCompleted }) {
   return (
      <li className='task-item'>
         <button
            className={`complete-task-button ${
               task.completed ? 'completed' : ''
            }`}
            onClick={() => onToggleCompleted(task.id)}
         ></button>
         <span className={task.completed ? 'completed' : ''}>
            {task.taskDescription}
         </span>
         <button
            className='delete-task-button'
            onClick={() => onDeleteItem(task.id)}
         >
            <i className='fas fa-trash-alt'></i>
         </button>
      </li>
   );
}
