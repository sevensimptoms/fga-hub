
export interface Signup {
  username: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  country: string;
  role: string
}

export interface Login {
  email: string;
  password: string;
}
