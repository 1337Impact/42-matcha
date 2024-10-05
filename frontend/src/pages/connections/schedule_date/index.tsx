import { useState } from "react";

export default function ScheduleDate() {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const parms = new URLSearchParams(window.location.search);
  const userId = parms.get("user_id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = window.localStorage.getItem("token");
    const date_time = new Date(`${date}`);
    date_time.setHours(Number(time.split(":")[0]));
    date_time.setMinutes(Number(time.split(":")[1]));

    setDisabled(true);
    try {
      const eventForm = {
        user_id: userId,
        event_name: eventName,
        event_date: date_time,
        event_location: location,
        event_description: message,
      };
      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/api/profile/events/request-date/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventForm),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to schedule date");
      }
      window.location.href = "/connections";
    } catch (error) {
      console.error("Error scheduling date: ", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-gray-800 py-4">
        Schedule a Date
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div>
          <label
            htmlFor="eventName"
            className="block text-gray-700 font-medium mb-2"
          >
            Event Name (Optional)
          </label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            placeholder="Coffee date, Movie night, etc."
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-gray-700 font-medium mb-2"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label
            htmlFor="time"
            className="block text-gray-700 font-medium mb-2"
          >
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-gray-700 font-medium mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            placeholder="Enter a location"
            required
          />
        </div>

        {/* Optional Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 font-medium mb-2"
          >
            Message (Optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            rows={4}
            placeholder="You can add a message here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Schedule Date
        </button>
      </form>
    </div>
  );
}
