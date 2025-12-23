export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  role: string;
}
export interface newUser {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNo: string;
  role: string;
}

export interface UserResponse {
  
}