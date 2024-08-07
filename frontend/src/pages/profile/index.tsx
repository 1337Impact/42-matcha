import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileData, UserProfile } from "./utils";

export default function Profile() {
  const params = useParams();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
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

  if (!profileData) {
    return (
      <div>
        <h1>User Not Found (404)</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl md:mx-auto pb-16">
      <div className="bg-muted rounded-t-lg p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32">
            <img
              className="aspect-square h-full w-full"
              alt={profileData.username}
              src={profileData.pictures[0]}
            />
          </div>
          <div className="grid gap-1">
            <h2 className="text-2xl font-bold">John Doe</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>@{profileData.username}</span>
              <span>{profileData.gender}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background rounded-b-lg p-6 grid gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-4 h-4"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
              <path d="M8 14h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M16 18h.01"></path>
            </svg>
            <span>28 years old</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {profileData.bio}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="w-4 h-4 fill-primary"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Fame Rating: 8/10</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profileData.interests.map((interest, index) => (
            <div
              key={index}
              className="bg-muted rounded-full px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {interest}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
          {profileData.pictures.map((image) => (
            <img
              src={image}
              alt="Profile Picture"
              className="aspect-square rounded-md object-cover"
            />
          ))}
          {profileData.pictures.map((image) => (
            <img
              src={image}
              alt="Profile Picture"
              className="aspect-square rounded-md object-cover"
            />
          ))}
          {profileData.pictures.map((image) => (
            <img
              src={image}
              alt="Profile Picture"
              className="aspect-square rounded-md object-cover"
            />
          ))}
          {profileData.pictures.map((image) => (
            <img
              src={image}
              alt="Profile Picture"
              className="aspect-square rounded-md object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
