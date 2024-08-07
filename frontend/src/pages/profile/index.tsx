import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileData } from "./utils";

export default function Profile() {
  const params = useParams();
  const [profileData, setProfileData] = useState(null);
  useEffect(() => {
    getProfileData(params.profileId as string)
      .then((data) => {
        console.log(data);
        setProfileData(data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  return (
    <div className="">
      {profileData ? (
        <h1>profile: {params.profileId}</h1>
      ) : (
        <div>
          <h1>User Not Found (404)</h1>
        </div>
      )}
    </div>
  );
}
