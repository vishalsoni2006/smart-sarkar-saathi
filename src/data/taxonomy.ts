import { OccupationType, UserProfile } from '@/types';

export interface OccupationOption {
  id: OccupationType;
  label: string;
  hindiLabel: string;
  description: string;
  iconName: string;
}

export const OCCUPATIONS: OccupationOption[] = [
  {
    id: 'farmer',
    label: 'Farmer / Agriculturist',
    hindiLabel: 'किसान / कृषक',
    description: 'Cultivators, small/marginal landholders, agricultural operators',
    iconName: 'Sprout'
  },
  {
    id: 'fisherman',
    label: 'Fisherman / Aquaculture',
    hindiLabel: 'मछुआरा / मत्स्य पालक',
    description: 'Traditional marine fishers, inland fish farmers, fish workers',
    iconName: 'Fish'
  },
  {
    id: 'student',
    label: 'Student',
    hindiLabel: 'छात्र / विद्यार्थी',
    description: 'School, college, diploma, undergraduate or postgraduate students',
    iconName: 'GraduationCap'
  },
  {
    id: 'teacher',
    label: 'Teacher / Educator',
    hindiLabel: 'शिक्षक / प्राध्यापक',
    description: 'School teachers, headmasters, principals in recognized schools',
    iconName: 'Award'
  },
  {
    id: 'government_employee',
    label: 'Government Employee / Pensioner',
    hindiLabel: 'सरकारी कर्मचारी / पेंशनभोगी',
    description: 'Central or State government staff, civil service retirees',
    iconName: 'Building2'
  },
  {
    id: 'defence_personnel',
    label: 'Army / Defence Personnel & Veterans',
    hindiLabel: 'सैनिक / पूर्व सैनिक',
    description: 'Armed forces veterans, ex-servicemen, military pensioners',
    iconName: 'Shield'
  },
  {
    id: 'unorganized_worker',
    label: 'Unorganized Sector Worker / Labourer',
    hindiLabel: 'असंगठित क्षेत्र का मजदूर',
    description: 'Construction workers, maids, drivers, daily wage earners',
    iconName: 'HardHat'
  },
  {
    id: 'street_vendor',
    label: 'Self-Employed / Street Vendor',
    hindiLabel: 'स्ट्रीट वेंडर / फेरीवाला',
    description: 'Hawkers, roadside vendors, carts, micro-sellers',
    iconName: 'Store'
  },
  {
    id: 'entrepreneur',
    label: 'Entrepreneur / Small Business Owner',
    hindiLabel: 'उद्यमी / छोटा व्यापारी',
    description: 'Shopkeepers, artisans, manufacturers, MSME owners',
    iconName: 'Briefcase'
  },
  {
    id: 'senior_citizen',
    label: 'Senior Citizen (60+)',
    hindiLabel: 'वरिष्ठ नागरिक (60+ वर्ष)',
    description: 'Elderly citizens seeking pension and healthcare support',
    iconName: 'Users'
  },
  {
    id: 'person_with_disability',
    label: 'Person with Disability (Divyangjan)',
    hindiLabel: 'दिव्यांगजन',
    description: 'Individuals with 40% or more certified benchmark disability',
    iconName: 'Accessibility'
  },
  {
    id: 'unemployed',
    label: 'Unemployed / Job-Seeker',
    hindiLabel: 'बेरोजगार / नौकरी की तलाश में',
    description: 'Youth and individuals seeking self-employment subsidies',
    iconName: 'Zap'
  },
  {
    id: 'other',
    label: 'Other (Type your own occupation)',
    hindiLabel: 'अन्य (अपना व्यवसाय लिखें)',
    description: 'Free-text entry with AI synonym fuzzy matching',
    iconName: 'HelpCircle'
  }
];

export const SPECIAL_CONDITIONS = [
  { id: 'has_land', label: 'Owns Agricultural Land (Landholder)', category: 'Agriculture' },
  { id: 'bpl_card', label: 'Holds Below Poverty Line (BPL) / Antyodaya Ration Card', category: 'Income' },
  { id: 'student_enrolled', label: 'Currently Enrolled in Recognized School/College', category: 'Education' },
  { id: 'disability_40_plus', label: 'Certified Disability (40% or above / UDID Card)', category: 'Health' },
  { id: 'registered_fisherman', label: 'Registered with State Fisheries Department', category: 'Fisheries' },
  { id: 'vendor_id_or_recommendation', label: 'Holds ULB Vending Certificate or Recommendation Letter', category: 'Business' },
  { id: 'central_govt_employee_or_pensioner', label: 'Central Govt Employee / Drawing Civil Pension', category: 'Government' },
  { id: 'ex_serviceman_pensioner', label: 'Ex-Servicemen Drawing Defence Pension', category: 'Defence' },
  { id: 'teaching_service_10yrs', label: '10+ Years Continuous Regular Teaching Service', category: 'Teaching' },
  { id: 'savings_bank_account', label: 'Active Aadhaar-linked Bank Account', category: 'Banking' }
];

export const INDIAN_STATES = [
  'All India',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry'
];

export const DEMO_PERSONAS: { id: string; name: string; subtitle: string; profile: UserProfile }[] = [
  {
    id: 'demo-farmer',
    name: 'Ramesh Kumar',
    subtitle: 'Small Farmer, 46 yrs (Maharashtra)',
    profile: {
      id: 'demo-farmer-1',
      name: 'Ramesh Kumar',
      email: 'ramesh.farmer@demo.gov.in',
      age: 46,
      annual_income: 140000,
      occupation: 'farmer',
      occupation_raw: null,
      state: 'Maharashtra',
      gender: 'male',
      category: 'obc',
      special_conditions: ['has_land', 'savings_bank_account'],
      land_holding_acres: 3,
      monthly_income: 11600,
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-student',
    name: 'Priya Sharma',
    subtitle: 'OBC College Student, 20 yrs (Uttar Pradesh)',
    profile: {
      id: 'demo-student-1',
      name: 'Priya Sharma',
      email: 'priya.student@demo.gov.in',
      age: 20,
      annual_income: 180000, // family income
      occupation: 'student',
      occupation_raw: null,
      state: 'Uttar Pradesh',
      gender: 'female',
      category: 'obc',
      special_conditions: ['student_enrolled', 'savings_bank_account'],
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-vendor',
    name: 'Sunita Devi',
    subtitle: 'Street Vendor, 34 yrs (Delhi)',
    profile: {
      id: 'demo-vendor-1',
      name: 'Sunita Devi',
      email: 'sunita.vendor@demo.gov.in',
      age: 34,
      annual_income: 95000,
      occupation: 'street_vendor',
      occupation_raw: null,
      state: 'Delhi',
      gender: 'female',
      category: 'sc',
      special_conditions: ['vendor_id_or_recommendation', 'savings_bank_account'],
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-senior',
    name: 'Bhimrao Gaikwad',
    subtitle: 'Senior Citizen, 68 yrs (BPL Cardholder)',
    profile: {
      id: 'demo-senior-1',
      name: 'Bhimrao Gaikwad',
      email: 'bhimrao.senior@demo.gov.in',
      age: 68,
      annual_income: 45000,
      occupation: 'senior_citizen',
      occupation_raw: null,
      state: 'Maharashtra',
      gender: 'male',
      category: 'sc',
      special_conditions: ['bpl_card', 'savings_bank_account'],
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'demo-needs-info',
    name: 'Anil Deshmukh',
    subtitle: 'Farmer with Land Size Unspecified (Needs More Info Demo)',
    profile: {
      id: 'demo-needs-info-1',
      name: 'Anil Deshmukh',
      email: 'anil.deshmukh@demo.gov.in',
      age: 38,
      annual_income: 120000,
      occupation: 'farmer',
      occupation_raw: null,
      state: 'Maharashtra',
      gender: 'male',
      category: 'general',
      special_conditions: ['savings_bank_account'], // MISSING 'has_land' & land_holding_acres!
      land_holding_acres: null,
      updated_at: new Date().toISOString()
    }
  }
];
