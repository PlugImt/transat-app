import type { User } from "@/dto";

type HeroAvatarType = {
  user: User;
  position: {
    top: number;
    left: number;
  };
};

export const useHeroAvatars = (): HeroAvatarType[] => [
  {
    user: {
      first_name: "John",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.doe6@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: 55,
      left: 52,
    },
  },
  {
    user: {
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.doe5@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: 64,
      left: 73,
    },
  },
  {
    user: {
      first_name: "John",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.doe4@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: 147,
      left: 65,
    },
  },
  {
    user: {
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.do3@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: 69,
      left: 148,
    },
  },
  {
    user: {
      first_name: "John",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.doe2@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: -14,
      left: 243,
    },
  },
  {
    user: {
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "1234567890",
      email: "john.doe1@example.com",
      graduation_year: 2025,
      profile_picture: "https://picsum.photos/32",
    },
    position: {
      top: 90,
      left: 239,
    },
  },
];
