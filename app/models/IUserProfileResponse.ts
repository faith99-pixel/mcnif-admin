type UserProfile = {
  firstName: string;
  phoneNumber: string;
  lastName: string;
  email: string;
}

export type UserProfileUpdateRequest = UserProfile & {
  newPassword: string;
  currentPassword: string;
  imageBase64Url: string
}


export type UserProfileResponse = UserProfile & {
  id: string;
  imageUrl: string | null;
  role: string;
};