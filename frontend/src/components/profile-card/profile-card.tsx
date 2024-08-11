import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import LikeButton from "../like-button/like-button";

interface ProfileCardProps {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    pictures: string[];
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <div className="p-2 rounded-lg bg-white shadow-xl">
      <Swiper
        className="w-full rounded-xl"
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
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
          <div className="">
            <h1 className="text-gray-600 font-semibold">
              {profile.first_name} {profile.last_name}
            </h1>
            <h1 className="text-sm text-gray-600">@{profile.username}</h1>
          </div>
        </Link>
        <LikeButton profileId={profile.id} />
      </div>
    </div>
  );
};

export default ProfileCard;
