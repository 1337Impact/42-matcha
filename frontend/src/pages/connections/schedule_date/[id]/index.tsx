import { useEffect, useState } from "react";

export default function RespondToScheduleRequest() {
  // State for handling user's response
  const [response, setResponse] = useState("");
  const [comment, setComment] = useState("");
  const [event, setEvent] = useState<any>({});
  const parms = new URLSearchParams(window.location.search);
  const eventId = parms.get("event_id");

  useEffect(() => {
    try {
      const token = window.localStorage.getItem("token");
      fetch(
        `${
          import.meta.env.VITE_APP_API_URL
        }/profile/events/?event_id=${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setEvent(data);
        });
    } catch (error) {
      console.error("Error getting event data: ", error);
    }
  }, [eventId]);


  const submitResponse = () => {
    const responseData = {
      eventId: eventId,
      response: response,
      comment,
    };
    try{
      const token = window.localStorage.getItem("token");
      fetch(
        `${import.meta.env.VITE_APP_API_URL}/profile/events/respond-request-date`,
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
        .then(() => {
          // Redirect user to the events page
          window.location.href = "/connections/";
        });
    }
    catch (error) {
      console.error("Error responding to date request: ", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-gray-800 pb-4">
        Respond to Schedule Request
      </h1>

      {/* Event details */}
      <div className="border p-4 rounded-lg shadow-lg bg-gray-50 mb-6">
        <h2 className="text-xl font-bold text-gray-700">
          {event.eventName || "Scheduled Date"}
        </h2>
        <p className="text-gray-700">
          <strong>Date:</strong> {event.date} <br />
          <strong>Time:</strong> {event.time} <br />
          <strong>Location:</strong> {event.location} <br />
          {event.message && (
            <>
              <strong>Message:</strong> {event.message}
            </>
          )}
        </p>
      </div>

      {/* Response buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`w-1/2 bg-green-500 text-white py-2 rounded-lg ${
            response === "accepted" ? "bg-green-700" : "hover:bg-green-600"
          }`}
          onClick={() => setResponse("accepted")}
        >
          Accept
        </button>

        <button
          className={`w-1/2 bg-red-500 text-white py-2 rounded-lg ${
            response === "declined" ? "bg-red-700" : "hover:bg-red-600"
          }`}
          onClick={() => setResponse("declined")}
        >
          Decline
        </button>
      </div>

      {/* Optional comment section */}
      {response === "declined" && (
        <div>
          <label
            htmlFor="comment"
            className="block text-gray-700 font-medium mb-2"
          >
            Add a comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-gray-300 p-2 rounded-lg shadow-sm"
            placeholder="You can explain why you're declining..."
            rows={4}
          />
        </div>
      )}

      {/* Submit button */}
      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        onClick={submitResponse}
      >
      </button>
    </div>
  );
}


