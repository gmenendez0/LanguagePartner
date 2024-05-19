export default interface User {
  id: string;
  city: string;
  name: string;
  email: string;
  password: string;
  approved: string[];
  rejected: string[];
  matched: string[];
  known_languages: string[];
  wanted_languages: string[];
}