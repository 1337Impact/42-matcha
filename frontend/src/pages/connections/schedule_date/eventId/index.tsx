import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RespondToScheduleRequest() {
  const [event, setEvent] = useState<any>({});
  const [error, setError] = useState("");
  const params = useParams();
  const eventId = params.eventId;

  useEffect(() => {
    const getEventData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/profile/events/?eventId=${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${
                window.localStorage.getItem("token") || ""
              }`,
            },
          }
        );
        const data = response.data;
        setEvent({
          eventName: data.event_name,
          date: new Date(data.event_date).toDateString(),
          time:
            new Date(data.event_date).getHours() +
            ":" +
            new Date(data.event_date).getMinutes(),
          location: data.event_location,
          message: data.event_message,
        });
      } catch (error: any) {
        console.error("Error getting event: ", error);
        setError(`Error :  ${error.response.data.message}`);
      }
    };
    getEventData();
  }, [eventId]);

  const submitResponse = (response: string) => {
    const responseData = {
      eventId: eventId,
      response: response,
    };
    try {
      const token = window.localStorage.getItem("token");
      fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/profile/events/respond-request-date`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(responseData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data) window.location.href = "/connections/";
        });
    } catch (error) {
      console.error("Error responding to date request: ", error);
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 pb-6 text-center">
          Respond to Schedule Request
        </h1>
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 pb-6 text-center">
        Respond to Schedule Request
      </h1>

      {/* Event details */}
      <div className="border p-6 rounded-lg shadow-lg bg-white mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {event.eventName || "Scheduled Date"}
        </h2>
        <p className="text-gray-700">
          <strong>Date:</strong> {event.date || "N/A"} <br />
          <strong>Time:</strong> {event.time || "N/A"} <br />
          <strong>Location:</strong> {event.location || "N/A"} <br />
          {event.event_description && (
            <div className="mt-2">
              <strong>Message:</strong> {event.event_description}
            </div>
          )}
        </p>
      </div>

      {/* Response buttons */}
      <div className="flex gap-4 mb-8">
        <button
          className={
            "w-1/2 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out bg-green-600 text-white"
          }
          onClick={() => submitResponse("accepted")}
        >
          Accept
        </button>

        <button
          className={
            "w-1/2 py-3 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out bg-red-600 text-white"
          }
          onClick={() => submitResponse("rejected")}
        >
          Decline
        </button>
      </div>
    </div>
  );
}
