export interface User {
  token: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  avatar: string;
  email: string;
  name: string;
  password: string;
  __v: number;
  _id: string;
}
