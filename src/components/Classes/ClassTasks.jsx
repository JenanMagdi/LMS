/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/Firebase";

function ClassTasks({ classId, isClassCreator }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksRef = collection(db, "Classes", classId, "Tasks");
        const querySnapshot = await getDocs(tasksRef);
        const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(tasksList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [classId]);

  const handleAddTask = async () => {
    try {
      const tasksRef = collection(db, "Classes", classId, "Tasks");
      await addDoc(tasksRef, newTask);
      setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
      setNewTask({ title: "", description: "", dueDate: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, "Classes", classId, "Tasks", taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      await updateDoc(doc(db, "Classes", classId, "Tasks", taskId), updatedData);
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      ));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      {loading && <div>Loading tasks...</div>}
      {isClassCreator && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Create Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Task
          </button>
        </div>
      )}
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="border p-4 mb-2 rounded">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            {isClassCreator && (
              <div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateTask(task.id, { title: "Updated Title" })}
                  className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                >
                  Update
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClassTasks;
