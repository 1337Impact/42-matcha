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
  }

export { User, Profile };