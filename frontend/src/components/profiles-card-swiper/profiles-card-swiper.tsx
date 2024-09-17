import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import SwiperCore from "swiper";
import { EffectCards, Navigation, Pagination } from "swiper/modules";
import TuneIcon from "@mui/icons-material/Tune";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotInterestedIcon from "@mui/icons-material/NotInterested";

SwiperCore.use([Navigation, Pagination, EffectCards]);

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  gender: string;
  bio: string;
  tags: string[];
  pictures: string[];
}

const ProfileSwiper = ({ profiles }: { profiles: Profile[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: string) => {
    if (direction === "like") {
      console.log(`Liked profile ${profiles[currentIndex].username}`);
    } else {
      console.log(`Disliked profile ${profiles[currentIndex].username}`);
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="max-w-lg mx-auto h-full w-full flex flex-col justify-between overflow-hidden">
      <div className="flex-end text-end items-end ">
        <button
          onClick={() => handleSwipe("dislike")}
          className="p-2 transition-transform transform hover:scale-105 justify-end"
        >
          <TuneIcon
            sx={{
              width: 32,
              height: 32,
              color: "red",
              fontWeight: "bold",
            }}
          />
        </button>
      </div>
      {/* Outer Swiper for Profiles */}
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="h-5/6 flex flex-col items-center border-2 rounded-xl border-gray-200 shadow-lg bg-white justify-center w-full "
      >
        {profiles.map((profile) => (
          <SwiperSlide
            key={profile.id}
            className="h-full w-full flex items-center justify-center  "
          >
            {/* Inner Swiper for Profile Pictures */}
            <Swiper
              slidesPerView={1}
              className=" shadow-md h-full flex w-full overflow-hidden relative"
            >
              {profile.pictures.map((picture, index) => (
                <SwiperSlide key={index} className="h-full relative">
                  <img
                    src={picture || "https://via.placeholder.com/150"}
                    alt={`Profile of ${profile.first_name}`}
                    className="w-full h-full rounded-lg object-fit"
                  />
                  <div className="absolute bottom-0 left-0 flex flex-col items-start w-full backdrop-blur-sm p-3 h-1/5">
                    {/* here show the user gender if it male show up an  male icon from mui icons  */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl text-gray-700 text-start  font-extrabold">
                        {profile.username}
                      </h3>
                      {profile.gender === "male" ? (
                        <MaleIcon className="w-8 h-8 " color="info" />
                      ) : (
                        <FemaleIcon
                          sx={{
                            width: 32,
                            height: 32,
                            color: "pink",
                            fontWeight: "bold",
                          }}
                          color="info"
                        />
                      )}
                    </div>
                    <p className="text-gray-600 pt-2">{profile.bio} </p>
                    <div className="flex flex-wrap gap-2 pt-3">
                      {profile.tags &&
                        profile.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="bg-red-300 rounded-full px-3 py-1 text-xs font-medium text-white"
                          >
                            {tag}
                          </div>
                        ))}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Like/Dislike Buttons */}
      <div className="flex justify-around items-center text-center h-1/6 ">
        <button
          onClick={() => handleSwipe("dislike")}
          className="bg-white rounded-full p-4 transition-transform transform hover:scale-105"
        >
          <FavoriteIcon
            sx={{
              width: 32,
              height: 32,
              color: "red",
              fontWeight: "bold",
            }}
          />
        </button>
        <button
          onClick={() => handleSwipe("like")}
          className="bg-white text-white rounded-full p-4 transition-transform transform hover:scale-105"
        >
          <NotInterestedIcon
            sx={{
              width: 32,
              height: 32,
              color: "green",
              fontWeight: "bold",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default ProfileSwiper;
