"use client";

import React, { useState, useEffect } from "react";
import "../../app/globals.css";
import { generateEmptyTable, generateTableDates } from "../utils";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode"; // Corrected import

const PlannificationPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Decode the JWT token to get the user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<{ sub: string }>(token);
        setUserId(decodedToken.sub); // Set userId based on 'sub'
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handlePopup = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if userId is available
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }
  
    const taskData = {
      title: title,
      startDate: startDate,
      endDate: endDate,
      user_id: userId,
    };
  
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // This is the correct way to include credentials (cookies) in fetch
        body: JSON.stringify({ task: taskData }),
      });
  
      if (!response.ok) {
        // Handle error response
        const errorData = await response.json();
        console.error(errorData);
        if (response.status === 401) {
          alert("You are not authorized. Please log in.");
        } else {
          alert("There was an error submitting the form.");
        }
      } else {
        const newTask = await response.json();
        setSubmitted(true);
        setIsModalOpen(false);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("An error occurred while submitting the task. Please try again.");
    }
  };
  

  return (
    <>
      <Navbar />
      <div className=" bg-gradient-to-br from-blue-50 to-blue-500 p-8 pt-40">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handlePopup}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create New Task
          </button>
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Task</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Task Title:
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date:
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </form>
              <button
                className="mt-4 w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PlannificationPage;
