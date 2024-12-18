"use client";

import React, { useEffect, useState } from "react";
import PlannificationPage from "@/app/components/PlannificationPage";
import axios from "axios";
import { generateTableDates, generateEmptyTable } from "../utils";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "../components/ProtectedRoute";
import Logout from "../components/logout";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]); // State for storing tasks
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true); // Track loading state for tasks
  const [error, setError] = useState<string | null>(null); // Error state

  // Decode the JWT and fetch tasks
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the JWT token
        const decodedToken = jwtDecode<{ sub: string }>(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error("Invalid token or failed to decode", error);
        setError("Failed to decode token.");
      }
    }
  }, []);

  // Fetch tasks for the user after userId is set
  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/users/${userId}/tasks`, {
            withCredentials: true, // Include credentials in request
          });
          setTasks(res.data); // Set tasks from the response
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setError("Failed to load tasks.");
        } finally {
          setLoadingTasks(false); // Stop loading once data is fetched
        }
      };
      fetchData();
    }
  }, [userId]);

  // Handle task removal
  const handleRemove = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}/tasks/${taskId}`);
      
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove task from state
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to remove task.");
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <PlannificationPage />
        <h1 className="text-center pt-10 uppercase">Your Tasks</h1>

        {loadingTasks ? (
          <p>Loading tasks...</p> // Show loading message while tasks are being fetched
        ) : error ? (
          <p className="text-red-500">{error}</p> // Show error message if there's an issue
        ) : tasks.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto overflow-x-scroll z-50 mt-10">
            {tasks.map((task: any) => (
              <ul key={task.id}>
                <li className="my-10">
                  Task {task.id}: {task.title}
                  <p>Status: {task.status ? "Active" : "Completed"}</p> {/* Display status */}
                </li>
                <table className="w-full border-collapse bg-gray-50 rounded-lg overflow-hidden">
                  <thead>
                    <tr>{generateTableDates(task.startDate, task.endDate)}</tr>
                  </thead>
                  <tbody>
                    <tr>
                      {generateEmptyTable(task.id, task.startDate, task.endDate)}
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
          <p>No tasks available</p> // Show this if no tasks exist
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Tasks;
