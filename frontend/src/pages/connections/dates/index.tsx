import axios from "axios";
import { useEffect, useState } from "react";

interface Event {
  event_name: string;
  date: any;
  time: any;
  event_location: string;
  event_message: string;
}

export default function Dates() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getEventData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/profile/events/all`,
          {
            headers: {
              Authorization: `Bearer ${
                window.localStorage.getItem("token") || ""
              }`,
            },
          }
        );
        const data = response.data;
        setEvents(
          data.map((event: any) => ({
            event_name: event.event_name,
            date: new Date(event.event_date).toLocaleDateString(),
            time:
              new Date(event.event_date).getHours() +
              ":" +
              new Date(event.event_date).getMinutes(),
            event_location: event.event_location,
            event_message: event.event_description,
          }))
        );
      } catch (error: any) {
        console.error("Error getting events: ", error);
        setError(
          `Error :  ${error.response?.data?.message || "Unknown error"}`
        );
      }
    };
    getEventData();
  }, []);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-700 pt-2 pb-2 text-start">
        Your Dates
      </h1>
      {error && <p className="text-red-500 text-start mb-4">{error}</p>}
      {events.length === 0 && !error ? (
        <p className="text-gray-600">No events available.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 mt-4">
          {events.map((event, index) => (
            <li
              key={index}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold text-gray-700">
                {event.event_name}
              </h2>
              <p className="text-gray-500">
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-500">
                <strong>Time:</strong> {event.time}
              </p>
              <p className="text-gray-500">
                <strong>Location:</strong> {event.event_location}
              </p>
              <p className="text-gray-500">
                <strong>Message:</strong> {event.event_message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
