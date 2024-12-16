"use client";

import React, { useEffect, useState } from "react";
import PlannificationPage from "@/app/components/PlannificationPage";
import axios from "axios";
import { generateTableDates, generateEmptyTable } from "../utils";
import {jwtDecode} from "jwt-decode";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]); // State for storing tasks
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = jwtDecode<{ sub: string }>(token); // Adjusting to match the `sub` field in the JWT
        setUserId(decodedToken.sub); // Set userId based on the 'sub' field
        console.log("User ID:", decodedToken.sub);
      } catch (error) {
        console.error("Invalid token or failed to decode", error);
      }
    }
  }, []); 

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/users/${userId}/tasks`, {
            withCredentials: true, // This will include cookies in the request
          });
          setTasks(res.data); // Set tasks from the response
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
      fetchData();
    }
  }, [userId]);
  
  // Remove task handler
  const handleRemove = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove the task from state
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <PlannificationPage />
      <h1 className="text-center pt-10 uppercase">Your Tasks</h1>
      {tasks.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto overflow-x-scroll z-50 mt-10">
          {tasks.map((task: any) => (
            <ul key={task.id}>
              <li className="my-10">
                Task {task.id}: {task.title}
              </li>
              <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                <thead>
                  <tr>{generateTableDates(task.start_date, task.end_date)}</tr>
                </thead>
                <tbody>
                  <tr>
                    {generateEmptyTable(task.id, task.start_date, task.end_date)}
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => handleRemove(task.id)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Remove Task
              </button>
            </ul>
          ))}
        </div>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default Tasks;
