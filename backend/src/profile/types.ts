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
  age?: number;
}

interface Filter {
  distance?: number;
  sexual_preferences?: string;
  interests?: string[];
  min_age?: number;
  max_age?: number;
  age?: string;
  common_interests?: boolean;
  distance_sort?: boolean;
  fame_rating?: boolean;
  min_fame_rating?: number;
  max_fame_rating?: number;
}

interface DateEvent{
  event_id?: string;
  user_id: string;
  event_name: string;
  event_date: string;
  event_location: string;
  event_description: string;
  accepted?: boolean;
}

export { User, Profile, Filter, DateEvent };
