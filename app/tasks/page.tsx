"use client";

import React, { useEffect, useState } from "react";
import { differenceInDays, addDays, format } from "date-fns";
import PlannificationPage from "@/app/components/PlannificationPage";
import axios from "axios";
import { generateTableDates } from "../utils";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "../components/ProtectedRoute";
import Logout from "../components/logout";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]); // State for storing tasks
  const [dailyTaskTables, setDailyTaskTables] = useState<any>({}); // Store daily task tables by taskId
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true); // Track loading state for tasks
  const [loadingDailyTaskTables, setLoadingDailyTaskTables] = useState<boolean>(false); // Track loading state for daily task tables
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
      const fetchTasks = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/users/${userId}/tasks`, {
            withCredentials: true,
          });
          console.log(res.data);
          setTasks(res.data);

          // Fetch daily task tables after fetching tasks
          setLoadingDailyTaskTables(true);
          for (const task of res.data) {
            await fetchDailyTaskTables(task.id, userId); // Wait for each daily task table to be fetched
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setError("Failed to load tasks.");
        } finally {
          setLoadingTasks(false); // Stop loading once data is fetched
        }
      };

      fetchTasks();
    }
  }, [userId]);

  // Function to fetch daily task tables for each task
  const fetchDailyTaskTables = async (taskId: string, userId: string) => {
    try {
      const dailyTaskRes = await axios.get(
        `http://localhost:3000/users/${userId}/tasks/${taskId}/daily_task_tables`,
        {
          withCredentials: true,
        }
      );

      console.log(dailyTaskRes);

      setDailyTaskTables((prev: any) => ({
        ...prev,
        [taskId]: dailyTaskRes.data, // Store daily task tables by taskId
      }));
    } catch (error) {
      console.error("Error fetching daily task tables:", error);
      setError("Failed to load daily task tables.");
    } finally {
      setLoadingDailyTaskTables(false); // Stop loading for daily task tables
    }
  };

  const handleStatusChange = async (
    taskId: string,
    checked: boolean,
    date: string,
    user_id: string,
  ) => {
    if (!user_id) {
      console.error("User ID is undefined");
      return;
    }

    const dailyStatusData = {
      daily_task: {
        status: checked,
        date: date,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:3000/users/${user_id}/tasks/${taskId}/daily_task_tables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dailyStatusData),
        }
      );
      window.location.reload();

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting task:", errorData);
        setError("Failed to update task status.");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      setError("Error submitting task status.");
    }
  };

  const generateEmptyTable = (
    taskId: string,
    startDate: string,
    endDate: string,
  ) => {
    let cols: any = [];
    if (!startDate || !endDate) return cols;

    const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

    for (let i = 0; i < colsNumber; i++) {
      const date = addDays(new Date(startDate), i);
      const taskDate = format(date, "yyyy-MM-dd");

      const taskStatus = dailyTaskTables[taskId]?.find(
        (task: any) => task.date === taskDate
      )?.status;

      cols.push(
        <td
          key={i}
          className="border border-gray-300 px-10 py-5 bg-gray-50 hover:bg-gray-200 transition-all duration-200 rounded-md min-w-48">
          <div className="flex justify-center items-center">
            <label className="flex justify-center items-center">
              <input
                type="checkbox"
                checked={taskStatus || false}
                onChange={(e) => {
                  if (userId) {
                    handleStatusChange(
                      taskId,
                      e.target.checked,
                      taskDate,
                      userId,
                    );
                  } else {
                    console.error("User not found");
                  }
                }}
              />
            </label>
          </div>
        </td>
      );
    }

    return cols;
  };

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
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : tasks.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto overflow-x-scroll z-50 mt-10">
            {tasks.map((task: any) => (
              <ul key={task.id}>
                <li className="my-10">
                  Task {task.id}: {task.title}
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

                {/* Render daily task tables if available */}
                {dailyTaskTables[task.id] && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Daily Task Tables</h2>
                    <table className="w-full border-collapse bg-gray-100 rounded-lg overflow-hidden mt-2">
                      <thead>
                        <tr>
                          <th className="border p-2">Date</th>
                          <th className="border p-2">Task Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyTaskTables[task.id].map((dailyTask: any) => (
                          <tr key={dailyTask.id}>
                            <td className="border p-2">{dailyTask.date}</td>
                            <td className="border p-2">{dailyTask.status ? "completed" : "not completed"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

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
    </ProtectedRoute>
  );
};

export default Tasks;
