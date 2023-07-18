import './App.css';
import TaskForm from './TaskForm';
import Task from './Task';
import ThemeToggle from './ThemeToggle';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function addTask(name) {
    if (name.trim() === '') {
      setErrorMessage('Por favor, preencha o nome da tarefa.');
      return;
    }

    setTasks(prevTasks => {
      const newTask = { id: Date.now(), name: name, done: false };
      const updatedTasks = [...prevTasks, newTask];
      setShowPopup(true);
      setErrorMessage('');
      return updatedTasks;
    });
  }

  function removeTask(taskId) {
    setTasks(prev => {
      return prev.filter(task => task.id !== taskId);
    });
  }

  function updateTaskDone(taskId, newDone) {
    setTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.id === taskId) {
          return { ...task, done: newDone };
        }
        return task;
      });
      return newTasks;
    });
  }

  const numberComplete = tasks.filter(t => t.done).length;
  const numberTotal = tasks.length;

  function getMessage() {
    const percentage = (numberComplete / numberTotal) * 100;
    if (percentage === 0) {
      return 'Não se esqueça de completar suas tarefas!';
    }
    if (percentage === 100) {
      return 'Você completou todas as suas tarefas!';
    }
    return 'Gerenciador de tarefas';
  }

  function renameTask(taskId, newName) {
    setTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.id === taskId) {
          return { ...task, name: newName };
        }
        return task;
      });
      return newTasks;
    });
  }

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showPopup]);

  return (
    <main>
      <h1>
        {numberComplete}/{numberTotal} Tarefas realizadas
      </h1>
      <h2>{getMessage()}</h2>
      <TaskForm onAdd={addTask} />
      {tasks.map(task => (
        <Task
          key={task.id}
          {...task}
          onRename={newName => renameTask(task.id, newName)}
          onTrash={() => removeTask(task.id)}
          onToggle={done => updateTaskDone(task.id, done)}
        />
      ))}

      {showPopup && (
        <div className="popup">
          Tarefa adicionada com sucesso!
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <footer className="footer">
        <div className="footer-icons">
          <a
            href="https://www.linkedin.com/in/samuel-allan-nues-cunha/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/SAMUKISZHSD"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </div>
      </footer>
    </main>
  );
}

export default App;
