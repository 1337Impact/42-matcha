interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  profilePicture: string;
  is_verified: boolean;
}

interface Profile {
  gender: string;
  sexual_preferences: string;
  biography: string;
  tags: string;
  images: string;
  new_password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  latitude?: string;
  longitude?: string;
  address?: string;
}

interface Filter {
  distance?: number;
  sexual_preferences?: string;
  interests?: string[];
  min_age?: number;
  max_age?: number;
}

export { User, Profile, Filter };
