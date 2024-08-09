import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  profile: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    pictures: string[];
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  console.log("ProfileCard");
  return (
    <div className="p-2 rounded-lg bg-white shadow-xl">
      <Swiper
        className="w-full rounded-xl"
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {profile.pictures ? (
          profile.pictures.map(
            (image, index) =>
              image && (
                <SwiperSlide key={index}>
                  <img
                    className="aspect-square rounded-md object-cover"
                    src={image}
                    alt="profile image"
                  />
                </SwiperSlide>
              )
          )
        ) : (
          <SwiperSlide>
            <img
              className="aspect-square rounded-md object-cover"
              src={`${import.meta.env.VITE_APP_IMAGES_URL}/default.jpg`}
              alt="profile img"
            />
          </SwiperSlide>
        )}
      </Swiper>
      <div className="mt-2 px-1 flex justify-between">
        <Link to={`/profile/${profile.id}`}>
          <div className="max-w-[80%]">
            <h1 className="text-sm text-gray-600 font-semibold">
              {profile.first_name} {profile.last_name}
            </h1>
            <h1 className="text-sm text-gray-600">@{profile.username}</h1>
          </div>
        </Link>
        <div className="text-red-400">
          <FaHeart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
