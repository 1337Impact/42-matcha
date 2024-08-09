import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaHeart } from "react-icons/fa";

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
                    alt="profile img"
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
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="text-gray-600 font-semibold">
            {profile.first_name} {profile.last_name}
          </h1>
          <h1 className="text-sm text-gray-600">@{profile.username}</h1>
        </div>
        <FaHeart className="text-2xl text-red-400" />
      </div>
    </div>
  );
};

export default ProfileCard;
