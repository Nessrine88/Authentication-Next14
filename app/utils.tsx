/* eslint-disable */

import { differenceInDays, addDays, format } from "date-fns";
import { jwtDecode } from "jwt-decode";

// Decode the JWT token to extract the user ID
const getUserFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode<{ sub: string }>(token);
      return decodedToken.sub; // Return the user ID
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null; // Return null if no token exists
};

// Handle form submission for updating daily task status
const handleStatusChange = async (
  taskId: string,
  checked: boolean,
  date: string,  // Add the date to the request payload
  user_id: string, // Use the user ID passed directly
) => {
  if (!user_id) {
    console.error("User ID is undefined");
    return;
  }

  const dailyStatusData = {
    daily_task: {
      status: checked, // Send 'status' (based on your backend)
      date: date, // Send the date of the task
    },
  };

  try {
    const response = await fetch(
      `http://localhost:3000/users/${user_id}/tasks/${taskId}/daily_task_tables`, // POST endpoint for new task status
      {
        method: "POST", // Change PUT to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dailyStatusData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error submitting task:", errorData);
    } 
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};

// Generate table dates for header
export const generateTableDates = (startDate: string, endDate: string) => {
  let cols: any= [];
  if (!startDate || !endDate) return cols;

  const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  for (let i = 0; i < colsNumber; i++) {
    const date = addDays(new Date(startDate), i);
    cols.push(
      <th
        key={i}
        className="border border-gray-300 px-6 py-3 text-center bg-white hover:bg-gray-100 rounded-md"
      >
        {format(date, "MM-dd-yyyy")}
      </th>
    );
  }
  return cols;
};



// Generate table with checkboxes and task statuses
export const generateEmptyTable = (
  taskId: string,
  startDate: string,
  endDate: string,
) => {
  const status = async( )=> {
    const user_id = getUserFromToken()
    const res = fetch(`http://localhost:3000/users/${user_id}/tasks/${taskId}/daily_task_tables`)
    console.log(res);
    
    return res
  }
  status()
  let cols: any = [];
  if (!startDate || !endDate) return cols;

  const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

  const userId = getUserFromToken(); // Get user ID from token directly

  for (let i = 0; i < colsNumber; i++) {
    const date = addDays(new Date(startDate), i);
    const taskDate = format(date, "yyyy-MM-dd"); // Format the date for the task

    cols.push(
      <td
        key={i}
        className="border border-gray-300 px-10 py-5 bg-gray-50 hover:bg-gray-200 transition-all duration-200 rounded-md min-w-48">
        <div className="flex justify-center items-center">
          <label className="flex justify-center items-center">
            <input
              type="checkbox"
              onChange={(e) => {
                if (userId) {
                  handleStatusChange(
                    taskId,
                    e.target.checked,
                    taskDate,  // Pass the formatted date to the handler
                    userId,
                  ); // Use the decoded user ID and update the status
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
