import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import {
  EffectCards,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import LikeDislikeButton from "../like-button/like-button";
import AdvancedSearchMenu from "../search";
import FilterDropdown from "./filter-dropdown";
import SortDropdown from "./sort-dropdown";

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
  age: number;
}

const ProfileSwiper = () => {
  const initialSortCriteria = {
    age: "",
    interests: false,
    distance: false,
    fameRating: false,
  };
  const initialFilterCriteria = {
    distance: 20,
    sexual_preferences: "",
    interests: [] as string[],
    agerange: [18, 99],
    fameRating: [0, 10],
  };

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortCriteria, setSortCriteria] = useState(initialSortCriteria);
  const [filterCriteria, setFilterCriteria] = useState(initialFilterCriteria);

  useEffect(() => {
    const applyFilters = async () => {
      const token = window.localStorage.getItem("token");
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_APP_BACKEND_URL
          }/api/profile/FilteredProfiles`,
          {
            ProfilesFilter: {
              distance: filterCriteria.distance,
              sexual_preferences: filterCriteria.sexual_preferences,
              interests: filterCriteria.interests,
              min_age: filterCriteria.agerange[0],
              max_age: filterCriteria.agerange[1],
              age: sortCriteria.age,
              common_interests: sortCriteria.interests,
              distance_sort: sortCriteria.distance,
              fame_rating: sortCriteria.fameRating,
              min_fame_rating: filterCriteria.fameRating[0],
              max_fame_rating: filterCriteria.fameRating[1],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfiles(
          response.data.map((profile: any) => {
            const pictures = JSON.parse(profile.pictures);
            return {
              id: profile.id,
              first_name: profile.first_name,
              last_name: profile.last_name,
              username: profile.username,
              bio: profile.bio,
              tags: profile.interests,
              pictures,
              age: profile.age,
              gender: profile.gender,
            };
          })
        );
      } catch (err) {
        setProfiles([]);
        toast.error("Error fetching profiles");
      }
    };
    applyFilters();
  }, [sortCriteria, filterCriteria]);


  const handleSwipe = (direction: string) => {
    if (profiles.length === 0) return;

    if (direction === "like" || direction === "dislike") {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentIndex(0);
      }
      profiles.shift();
    }
  };

  return (
    <div className="max-w-lg mx-auto h-full w-full flex flex-col justify-between overflow-hidden">
      <div className="flex-end gap-4 text-end items-end pl-3 pr-3 pb-1 pt-1 w-full">
        <SortDropdown
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
        />
        <FilterDropdown
          ProfilesFilter={filterCriteria}
          setProfilesFilter={setFilterCriteria}
        />
        <AdvancedSearchMenu
          searchCriteria={filterCriteria}
          setSearchCriteria={setFilterCriteria}
        />
      </div>

      {/* Outer Swiper for Profiles */}
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        allowTouchMove={false}
        modules={[EffectCoverflow]}
        className="h-5/6 flex flex-col items-center border-2 rounded-xl border-gray-200 shadow-lg bg-white justify-center w-full"
      >
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <SwiperSlide
              key={profile.id}
              className="h-full w-full flex items-center justify-center"
            >
              {/* Inner Swiper for Profile Pictures */}
              <Swiper
                slidesPerView={1}
                className="shadow-md h-full flex w-full overflow-hidden relative"
                allowTouchMove={true}
              >
                {profile.pictures && profile.pictures.length > 0 ? (
                  profile.pictures
                    .filter((picture) => picture !== "") // Filter out any null pictures
                    .map((picture, index) => (
                      <SwiperSlide key={index} className="h-full relative">
                        <Link to={`/profile/${profile.id}`}>
                          <img
                            src={picture}
                            alt={`Profile of ${profile.first_name}`}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </Link>
                        <div className="absolute bottom-0 left-0 flex flex-col items-start w-full backdrop-blur-xl p-3">
                          <div className="flex items-center gap-2 w-[1/3] justify-between">
                            <h3 className="text-xl text-white text-start font-extrabold">
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
                            <h4 className="text-xl text-white text-start font-extrabold">
                              {profile.age} yrs
                            </h4>
                          </div>
                          <p className="text-gray-200 p-1">
                            {profile.bio.length > 100
                              ? profile.bio.substring(0, 80) + " ..."
                              : profile.bio}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-4">
                            {profile.tags.length < 4 ? (
                              profile.tags.map((tag, index) => (
                                <div
                                  key={index}
                                  className="bg-red-400 rounded-full px-3 py-1 text-xs font-medium text-white"
                                >
                                  {tag}
                                </div>
                              ))
                            ) : (
                              <>
                                {profile.tags.slice(0, 3).map((tag, index) => (
                                  <div
                                    key={index}
                                    className="bg-red-400 rounded-full px-3 py-1 text-xs font-medium text-white"
                                  >
                                    {tag}
                                  </div>
                                ))}
                                <div className="bg-red-400 rounded-full px-3 py-1 text-xs font-medium text-white">
                                  +{profile.tags.length - 3}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                ) : (
                  <SwiperSlide className="h-full relative">
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <p>No pictures available</p>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="h-full w-full flex items-center justify-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Placeholder"
              className="w-full h-full rounded-lg object-fit"
            />
          </SwiperSlide>
        )}
      </Swiper>

      <div className="flex justify-around items-center text-center h-1/6 ">
        <LikeDislikeButton
          profileId={profiles[currentIndex]?.id}
          handleSwipe={handleSwipe}
          disabled={profiles.length === 0}
        />
        <button
          onClick={() => handleSwipe("dislike")}
          disabled={profiles.length === 0}
          className="bg-white text-white rounded-full p-4 transition-transform transform hover:scale-105 shadow-xl"
        >
          <ChevronRight className="w-8 h-8 text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default ProfileSwiper;
