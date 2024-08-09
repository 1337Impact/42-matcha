import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileData, UserProfile } from "./utils";
import { FaCalendarAlt } from "react-icons/fa";
import { BsSearchHeart } from "react-icons/bs";

import { IoMaleFemale } from "react-icons/io5";
import EditProfile from "../../components/edit-profile";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import LikeButton from "../../components/like-button/like-button";

export default function Profile() {
  const params = useParams();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    getProfileData(params.profileId as string)
      .then((data) => {
        console.log("data: ", data);
        setProfileData(data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [params]);

  if (!profileData) {
    return (
      <div>
        <h1>User Not Found (404)</h1>
      </div>
    );
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  return (
    <>
      {openModal && (
        <EditProfile
          initialData={profileData}
          handleClose={() => setOpenModal(false)}
        />
      )}
      <div className="w-full max-w-5xl md:mx-auto pb-16">
        <div className="bg-muted rounded-t-lg p-6">
          <div className="flex items-center gap-6">
            <div className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32">
              <img
                className="aspect-square object-cover h-full w-full"
                alt={profileData.username}
                src={
                  profileData.pictures
                    ? profileData.pictures[0]
                    : `${import.meta.env.VITE_APP_IMAGES_URL}/default.jpg`
                }
              />
            </div>
            <div className="grid gap-1">
              <h2 className="text-2xl font-bold">
                {profileData.first_name} {profileData.last_name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>@{profileData.username}</span>
                <span className="text-red-400">{profileData.fame_rating}</span>
              </div>
              {user?.id === profileData.id ? (
                <button
                  onClick={handleOpenModal}
                  className="border-2 border-red-400 rounded-md py-[2px] px-2 text-red-400 hover:bg-red-50"
                >
                  Edit Profile
                </button>
              ) : (
                <LikeButton profileId={profileData.id} />
              )}
            </div>
          </div>
        </div>
        <div className="bg-background rounded-b-lg p-6 grid gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FaCalendarAlt className="text-red-400" />
            <span>28 years old</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IoMaleFemale className="text-red-400" />
            <span>I'm a {profileData.gender}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BsSearchHeart className="text-red-400" />
            <span>I'm looking for {profileData.sexual_preferences}</span>
          </div>
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {profileData.bio}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {profileData.interests &&
              profileData.interests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-red-300 rounded-full px-3 py-1 text-xs font-medium text-white"
                >
                  {interest}
                </div>
              ))}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 mt-4">
            {profileData.pictures &&
              profileData.pictures.map(
                (image, index) =>
                  image && (
                    <img
                      key={index}
                      src={image}
                      alt="Profile Picture"
                      className="aspect-square rounded-md object-cover"
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </>
  );
}
