import { useEffect, useState } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { FaCalendarAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { UserProfile, getProfileData, handleViewProfile } from "./utils";
import { IoMaleFemale } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LikeButton from "../../components/like-button/like-button";
import { RootState } from "../../store";

export default function Profile() {
  const params = useParams();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfileData(params.profileId as string)
      .then((data) => {
        setProfileData(data);
        console.log("data 000000000  : ", data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, [params]);

  useEffect(() => {
    const viewProfile = async () => {
      if (profileData) {
        try {
          const token = localStorage.getItem("token");
          await handleViewProfile(profileData.id, token);
        } catch (error) {
          console.log("error: ", error);
        }
      }
    };
    viewProfile();
  }, [profileData]);

  if (!profileData) {
    return (
      <div>
        <h1>User Not Found (404)</h1>
      </div>
    );
  }

  return (
    <div className="w-full relative h-2/3 bg-gray-100">
      <div className="w-full h-full relative marker:overflow-hidden">
        <img
          src={profileData.pictures[0]}
          alt="Profile"
          className="w-full h-full object-fill aspect-square"
        />
      </div>
      <div className="absolute top-3/4 w-full z-10 bg-white h-full rounded-t-[2.5rem] p-4 flex">
        <div className="p-4 justify-between flex-col w-full h-full">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold text-gray-800 text-center">
              {profileData.first_name} {profileData.last_name}
            </h1>
            {user?.id === profileData.id ? (
              <Link to="/settings">
                <button
                  className="border-2 border-red-400 rounded-md py-[2px] px-2 text-red-400 hover:bg-red-50"
                >
                  Edit Profile
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to={`/chat/${profileData.id}`}>
                  <button className="border-2 border-red-400 rounded-md py-[2px] px-2 text-red-400 hover:bg-red-50">
                    Message
                  </button>
                </Link>
                <button className="border-2 border-red-400 rounded-md py-[2px] px-2 text-red-400 hover:bg-red-50">
                  Report
                </button>
                <LikeButton
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    alignItems: "center",
                    backgroundColor: "#faf7ef",
                    justifyContent: "center",
                    display: "flex",
                  }}
                  profileId={profileData.id}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 pl-1">
            <span>@{profileData.username}</span>
          </div>
          <div className="flex items-center gap-2 text-lg text-gray-500 mt-5">
            <FaCalendarAlt className="text-red-400 text-xl" />
            <span>{profileData.age} years old</span>
          </div>
          <div className="flex items-center gap-2 text-lg mt-2 text-gray-500">
            <IoMaleFemale className="text-red-400 text-xl" />
            <span>I'm a {profileData.gender}</span>
          </div>
          <div className="flex items-center gap-2 text-lg mt-2 text-gray-500">
            <BsSearchHeart className="text-red-400 text-xl" />
            <span>I'm looking for {profileData.sexual_preferences}</span>
          </div>
          <div className="grid gap-1">
            <h2 className="text-lg text-gray-600 font-semibold mt-2">
              About me
            </h2>
            <p className="text-gray-600">{profileData.bio}</p>
          </div>
          <div className="flex-col gap-2 mt-1">
            <h2 className="text-lg text-gray-600 font-semibold mt-2">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {profileData.interests &&
                profileData.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="bg-red-400 rounded-full px-3 py-2 text-xs font-medium text-white "
                  >
                    {interest}
                  </div>
                ))}
            </div>
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
                      className="aspect-square rounded-md object-fill w-60 h-60 mb-4 shadow-lg border-[0.01rem] border-gray-200"
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
