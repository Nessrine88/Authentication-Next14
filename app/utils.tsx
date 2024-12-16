import { differenceInDays, addDays, format } from "date-fns";

// Handle form submission for updating daily task status
const handleStatusChange = async (taskId: string, checked: boolean, id: string) => {
  // Wrap the checked value inside a 'daily_task' object
  const dailyStatusData = {
    daily_task: {
      checked: checked, // Send 'checked' instead of 'status'
    }
  };

  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}/daily_tasks/${id}`, {
      method: "PUT", // Use 'PUT' correctly in uppercase
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dailyStatusData), // Send data inside daily_task
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      alert("There was an error submitting the form.");
    } else {
      alert("Task status updated successfully!");
    }
  } catch (error) {
    console.error("Error submitting task:", error);
  }
};


// Generate table dates for header
export const generateTableDates = (startDate: string, endDate: string) => {
  let cols: JSX.Element[] = [];
  if (!startDate || !endDate) return cols;

  const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  for (let i = 0; i < colsNumber; i++) {
    const date = addDays(new Date(startDate), i);
    cols.push(
      <td
        key={i}
        className="border border-gray-300 px-6 py-3 text-center bg-white hover:bg-gray-100 rounded-md"
      >
        {format(date, "MM-dd-yyyy")}
      </td>
    );
  }
  return cols;
};

// Generate table with checkboxes and task statuses
export const generateEmptyTable = (
  taskId: string,
  startDate: string,
  endDate: string,
  statuses: boolean[] = []  // Default to an empty array if statuses are missing
) => {
  let cols: JSX.Element[] = [];
  if (!startDate || !endDate) return cols;

  const colsNumber = differenceInDays(new Date(endDate), new Date(startDate)) + 1;

  // Ensure statuses array is the same length as columns, fill missing with 'false'
  while (statuses.length < colsNumber) {
    statuses.push(false);
  }

  for (let i = 0; i < colsNumber; i++) {
    const date = addDays(new Date(startDate), i);
    const dailyTaskId = `${taskId}-${i + 1}`; // Unique daily task ID

    cols.push(
      <td
        key={i}
        className="border border-gray-300 px-10 py-5 bg-gray-50 hover:bg-gray-200 transition-all duration-200 rounded-md min-w-48">
        <div className="flex justify-center items-center">
          <label className="flex justify-center items-center">
            <input
              type="checkbox"
              checked={statuses[i]}  // Use status for checkbox state
              onChange={(e) => handleStatusChange(taskId, e.target.checked, dailyTaskId)}  // Pass taskId and dailyTaskId
            />
          </label>
        </div>
      </td>
    );
  }

  return cols;
};
