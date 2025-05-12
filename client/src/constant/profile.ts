// =======================
// User Interface
// =======================
export interface IUser {
  name: string;
  email: string;
  title?: string;
  description?: string;
  role: string;
  avatar?: string;
  password: string;
  status: string;
  address?: string;
  phone?: string;
  city?: string;
  country?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

// =======================
// Profile Keys for Mapping
// =======================
export const profileKeys = [
  { keyName: 'name' },
  { keyName: 'email' },
  { keyName: 'title' },
  { keyName: 'description' },
  { keyName: 'status' },
  { keyName: 'address' },
  { keyName: 'phone' },
  { keyName: 'city' },
  { keyName: 'country' },
  { keyName: 'facebook' },
  { keyName: 'twitter' },
  { keyName: 'linkedin' },
  { keyName: 'instagram' },
];

// =======================
// Profile Input Fields with Placeholders
// =======================
export const profileInputFields = [
  {
    id: 1,
    name: 'name',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    type: 'text',
  },
  {
    id: 2,
    name: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    type: 'email',
  },
  {
    id: 3,
    name: 'title',
    label: 'Professional Title',
    placeholder: 'e.g. Software Engineer, Manager',
    type: 'text',
  },
  {
    id: 4,
    name: 'description',
    label: 'Short Bio',
    placeholder: 'Write a short description about yourself',
    type: 'text',
  },
  {
    id: 7,
    name: 'address',
    label: 'Street Address',
    placeholder: '123 Main St, Apt 4B',
    type: 'text',
  },
  {
    id: 8,
    name: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    type: 'tel',
  },
  {
    id: 9,
    name: 'city',
    label: 'City',
    placeholder: 'Enter your city',
    type: 'text',
  },
  {
    id: 10,
    name: 'country',
    label: 'Country',
    placeholder: 'Enter your country',
    type: 'text',
  },
  {
    id: 11,
    name: 'facebook',
    label: 'Facebook Profile',
    placeholder: 'Paste your Facebook profile link',
    type: 'url',
  },
  {
    id: 12,
    name: 'twitter',
    label: 'Twitter Handle',
    placeholder: 'Paste your Twitter profile link',
    type: 'url',
  },
  {
    id: 13,
    name: 'linkedin',
    label: 'LinkedIn Profile',
    placeholder: 'Paste your LinkedIn profile link',
    type: 'url',
  },
  {
    id: 14,
    name: 'instagram',
    label: 'Instagram Profile',
    placeholder: 'Paste your Instagram profile link',
    type: 'url',
  },
];
