"use client";
/* eslint-disable */

import React, { useEffect, useState } from "react";
import { differenceInDays, addDays, format } from "date-fns";
import PlannificationPage from "@/app/components/PlannificationPage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "../components/ProtectedRoute";
import { generateTableDates } from "../utils";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [dailyTaskTables, setDailyTaskTables] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [loadingDailyTaskTables, setLoadingDailyTaskTables] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [taskId: string]: number }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode<{ sub: string }>(token);
        setUserId(decodedToken.sub);
      } catch (error) {
        console.error("Invalid token or failed to decode", error);
        setError("Failed to decode token.");
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchTasks = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/users/${userId}/tasks`, {
            withCredentials: true,
          });
          setTasks(res.data);
          setLoadingDailyTaskTables(true);
          for (const task of res.data) {
            await fetchDailyTaskTables(task.id, userId);
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setError("Failed to load tasks.");
        } finally {
          setLoadingTasks(false);
        }
      };

      fetchTasks();
    }
  }, [userId]);

  const fetchDailyTaskTables = async (taskId: string, userId: string) => {
    try {
      const dailyTaskRes = await axios.get(
        `http://localhost:3000/users/${userId}/tasks/${taskId}/daily_task_tables`,
        {
          withCredentials: true,
        }
      );
      setDailyTaskTables((prev: any) => ({
        ...prev,
        [taskId]: dailyTaskRes.data,
      }));
    } catch (error) {
      console.error("Error fetching daily task tables:", error);
      setError("Failed to load daily task tables.");
    } finally {
      setLoadingDailyTaskTables(false);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    checked: boolean,
    date: string,
    user_id: string
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
    endDate: string
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
        <th
          key={i}
          className="border border-gray-300 px-4 py-4 bg-gray-50 hover:bg-gray-200 transition-all duration-200 rounded-md min-w-48"
        >
          <div className="flex justify-center items-center">
            <form action="submit">
            <label className="flex justify-center items-center relative cursor-pointer">
              <input
                id="check-box-1"
                className={`w-10 h-10 peer appearance-none rounded-sm border border-gray-900 ${taskStatus ? 'border-none' : 'border'}`}
                type="checkbox"
                checked={taskStatus || false}
                onChange={(e) => {
                  if (userId) {
                    handleStatusChange(taskId, e.target.checked, taskDate, userId);
                  } else {
                    console.error("User not found");
                  }
                }}
              />
              <img
                src="https://img.icons8.com/?size=100&id=AefXIkx4A693&format=png&color=000000"
                alt="Icon"
                width={50}
                height={50}
                className="absolute hidden peer-checked:block peer-checked:animate-check"
              />
            </label>
            </form>
           
          </div>
        </th>
      );
    }

    return cols;
  };

  // Calculate progress for each task (useEffect)
  useEffect(() => {
    const calculateProgress = (taskId: string, startDate: string, endDate: string) => {
      const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
      const dailyTasks = dailyTaskTables[taskId];

      if (!dailyTasks || dailyTasks.length === 0) return;

      const completedTasks = dailyTasks.filter((task: any) => task.status === true).length;

      const progressPercentage = (completedTasks / colsNumber) * 100;
      const progressValue = Math.round(progressPercentage);

      // Update progress state
      setProgress((prevProgress) => ({
        ...prevProgress,
        [taskId]: progressValue,
      }));
    };

    // Call calculateProgress when tasks or dailyTaskTables change
    tasks.forEach((task) => {
      if (task.startDate && task.endDate) {
        calculateProgress(task.id, task.startDate, task.endDate);
      }
    });
  }, [tasks, dailyTaskTables]);

  const handleRemove = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to remove task.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <PlannificationPage />
        <h1 className="text-3xl font-bold text-center uppercase mt-10">Your Tasks</h1>

        {loadingTasks ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : tasks.length > 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto mt-10 overflow-x-auto">
{tasks.map((task: any) => {
  const cols = generateEmptyTable(task.id, task.startDate, task.endDate);

  return (
    <ul key={task.id}>
      <li className="my-6   text-2xl text-gray-600 font-mono font-bold">
        Task {task.title} ({cols.length} days)
      </li>

      {/* Grid Header */}


      {/* Grid Content */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 bg-gray-50 p-2 rounded-md">
        {cols.map((col: any, index: number) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center bg-white p-2 rounded-md shadow"
          >
            {/* Date Title */}
            <div className="text-center font-semibold mb-2">
              {format(addDays(new Date(task.startDate), index), "yyyy-MM-dd")}
            </div>

            {/* Input Below the Date */}
            {col.props.children}
          </div>
        ))}
      </div>
      <h1 className="text-center font-mono font-bold text-3xl py-5">Your Progress </h1>

      {/* Progress Bar */}
      <div className="flex justify-center py-5">
        
        <div className="w-[50rem] rounded-full bg-gray-200 h-10">
          <div
            className="bg-green-600 w-full h-full rounded-full text-white flex items-center justify-center"
            style={{ width: `${progress[task.id] || 0}%` }}
          >
            <div className="w-fit">{progress[task.id]}%</div>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => handleRemove(task.id)}
        className="mt-4 bg-gradient-to-b from-red-400 via-red-600 to-red-700 text-white hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-md py-2 px-6 text-sm font-semibold transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 active:scale-95"
      >
        Remove Task
      </button>
    </ul>
  );
})}

          </div>
        ) : (
          <p className="text-center text-gray-500">No tasks available</p>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Tasks;
