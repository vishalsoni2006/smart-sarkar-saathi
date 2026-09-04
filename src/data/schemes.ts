import { Scheme } from '@/types';

export const VERIFIED_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    short_name: 'PM-KISAN',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Agriculture',
    category_icon: 'Sprout',
    benefit_summary: '₹6,000 per year directly transferred to bank accounts in 3 equal four-monthly installments of ₹2,000.',
    benefit_details: [
      'Direct Benefit Transfer (DBT) of ₹6,000 annually in 3 installments of ₹2,000 each.',
      'Funds deposited directly into verified Aadhaar-linked bank accounts.',
      'Financial support for procurement of agricultural inputs like seeds, fertilizers, and farm equipment.',
      'Over 11 crore farmers supported across India.'
    ],
    eligibility: {
      occupation: 'farmer',
      income_max: null,
      age_min: 18,
      age_max: null,
      state: 'all',
      land_holding_max_acres: 5,
      required_conditions: ['has_land'],
      excluded_conditions: ['institutional_landholder', 'income_taxpayer', 'constitutional_post_holder']
    },
    occupation_tags: [
      'farmer',
      'agriculturist',
      'kisan',
      'cultivator',
      'landholder',
      'farm owner',
      'grower',
      'horticulturist'
    ],
    official_apply_url: 'https://pmkisan.gov.in',
    required_documents: [
      'Aadhaar Card with mobile linkage',
      'Landholding documents / Khatauni / Record of Rights (RoR)',
      'Aadhaar-seeded Active Bank Account details (IFSC, Account Number)',
      'Citizenship / Domicile proof'
    ],
    last_verified: '2026-08-20',
    source_text: `PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) is a Central Sector scheme with 100% funding from Government of India. Under the scheme an income support of 6,000/- per year in three equal installments will be provided to all land holding farmer families. Definition of family for the scheme is husband, wife and minor children. State Government and UT administration will identify the farmer families which are eligible for support as per scheme guidelines. The fund will be directly transferred to the bank accounts of the beneficiaries.
Exclusions: All Institutional Land holders; and Farmer families in which one or more of its members belong to following categories: Former and present holders of constitutional posts; Former and present Ministers/ State Ministers and former/present Members of LokSabha/ RajyaSabha/ State Legislative Assemblies/ State Legislative Councils; All serving or retired officers and employees of Central/ State Government Ministries/Offices/Departments and its field units; All Persons who paid Income Tax in last assessment year; Professionals like Doctors, Engineers, Lawyers, Chartered Accountants, and Architects registered with Professional bodies and carrying out practice by undertaking field visits.`,
    chunks: [
      {
        id: 'pm-kisan-1',
        title: 'Financial Benefit',
        section: 'Section 2.1: Financial Norms',
        content: 'Provides ₹6,000 per annum paid in three 4-monthly installments of ₹2,000 each via DBT directly into Aadhaar-linked bank accounts.',
        citation_tag: 'PM-KISAN Guidelines §2.1'
      },
      {
        id: 'pm-kisan-2',
        title: 'Eligibility Requirements',
        section: 'Section 3: Eligible Beneficiaries',
        content: 'Small and marginal landholder farmer families owning cultivable land up to 2 hectares (5 acres) with valid revenue land records in their name.',
        citation_tag: 'PM-KISAN Operational Guidelines §3'
      },
      {
        id: 'pm-kisan-3',
        title: 'Mandatory Exclusions',
        section: 'Section 4: Exclusion Criteria',
        content: 'Institutional landholders, current or former constitutional post holders, income taxpayers from the previous assessment year, and regular government employees are strictly ineligible.',
        citation_tag: 'PM-KISAN Notification §4 Exclusions'
      }
    ],
    application_steps: [
      'Visit pmkisan.gov.in and click on "Farmers Corner" -> "New Farmer Registration".',
      'Enter Aadhaar number and select Rural or Urban Farmer Registration.',
      'Enter land ownership details (Survey number, Dag/Khasra number, land area in acres).',
      'Upload land ownership title document and submit for State Nodal Officer approval.'
    ],
    official_contact: 'PM-KISAN Helpline: 155261 / 011-24300606'
  },
  {
    id: 'pmmsy',
    name: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
    short_name: 'PMMSY',
    ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
    category: 'Fisheries & Marine',
    category_icon: 'Fish',
    benefit_summary: 'Government subsidy of up to 40% (General) and 60% (Women/SC/ST) for fishing equipment, boats, nets, and aquaculture units.',
    benefit_details: [
      'Direct capital subsidy up to 60% of project cost for SC, ST, and Women beneficiaries.',
      'Direct capital subsidy up to 40% for General category beneficiaries.',
      'Assistance for deep-sea fishing vessels, motorized boats, biofloc units, and cold storage.',
      'Livelihood support during the marine fishing ban / lean period.'
    ],
    eligibility: {
      occupation: 'fisherman',
      income_max: null,
      age_min: 18,
      age_max: 65,
      state: 'all',
      required_conditions: ['registered_fisherman'],
      excluded_conditions: []
    },
    occupation_tags: [
      'fisherman',
      'fisher',
      'fish farmer',
      'aquaculturist',
      'trawler operator',
      'marine worker',
      'pisciculturist',
      'shrimp farmer'
    ],
    official_apply_url: 'https://pmmsy.dof.gov.in',
    required_documents: [
      'Aadhaar Card',
      'Fisherman Registration Certificate / Biometric Fisher ID Card',
      'Bank Account Passbook / Statement with IFSC',
      'Lease agreement or ownership proof of waterbody / pond / land',
      'Detailed Project Report (DPR) for commercial aquaculture units'
    ],
    last_verified: '2026-08-15',
    source_text: `Pradhan Mantri Matsya Sampada Yojana (PMMSY) is a flagship scheme designed to address critical gaps in fish production and productivity, quality, technology, post-harvest infrastructure and management. It provides financial assistance for individual beneficiaries including Fishers, Fish farmers, Fish workers, Fish vendors, SCs/STs/Women/Differently abled persons, Fisheries cooperatives/Federations, and SHGs.
Financial Pattern: For beneficiary-oriented activities, governmental financial assistance comprises:
- General Category: 40% of the project cost (Central Share + State Share).
- SC/ST/Women Category: 60% of the project cost (Central Share + State Share).
Beneficiary must hold a valid identity document certifying fish farming or fishing activity issued by the State Fisheries Department.`,
    chunks: [
      {
        id: 'pmmsy-1',
        title: 'Subsidy Pattern',
        section: 'Section 4.2: Financial Pattern',
        content: 'Provides up to 40% subsidy for General category and up to 60% subsidy for SC/ST and Women applicants on aquaculture projects, equipment, and biofloc.',
        citation_tag: 'PMMSY Scheme Framework §4.2'
      },
      {
        id: 'pmmsy-2',
        title: 'Eligibility for Fishers',
        section: 'Section 3: Target Beneficiaries',
        content: 'Open to registered traditional fishers, fish workers, fish vendors, and individuals with access to freshwater or coastal water resources.',
        citation_tag: 'PMMSY Guidelines §3.1'
      }
    ],
    application_steps: [
      'Register on the PMMSY portal (pmmsy.dof.gov.in) or visit the District Fisheries Office.',
      'Select scheme component (e.g., Construction of New Ponds, Motorization of Traditional Craft).',
      'Submit Detailed Project Report along with land/water rights documents and bank quotes.',
      'District Level Committee verifies and forwards for state grant sanction.'
    ],
    official_contact: 'Toll-free Fisheries Helpline: 1800-425-1660'
  },
  {
    id: 'post-matric-scholarship',
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    short_name: 'Post-Matric Scholarship',
    ministry: 'Ministry of Social Justice and Empowerment / Tribal Affairs',
    category: 'Education',
    category_icon: 'GraduationCap',
    benefit_summary: '100% compulsory non-refundable fees reimbursement plus monthly maintenance allowance up to ₹1,200/month.',
    benefit_details: [
      'Complete tuition fee reimbursement paid directly to verified educational institutions.',
      'Monthly maintenance allowance ranging from ₹230 to ₹1,200 depending on course group and hosteller/day-scholar status.',
      'Book bank grants, study tour charges, and thesis typing charges for higher degrees.',
      'Covers diploma, degree, post-graduate, doctoral, and professional courses (engineering, medicine, law).'
    ],
    eligibility: {
      occupation: 'student',
      income_max: 250000, // ₹2.5 Lakh per annum
      age_min: 15,
      age_max: 32,
      state: 'all',
      required_conditions: ['student_enrolled', 'caste_certificate'],
      excluded_conditions: []
    },
    occupation_tags: [
      'student',
      'scholar',
      'college student',
      'undergraduate',
      'postgraduate',
      'diploma student',
      'learner',
      'candidate'
    ],
    official_apply_url: 'https://scholarships.gov.in',
    required_documents: [
      'Aadhaar Card',
      'Caste Certificate issued by designated revenue authority',
      'Income Certificate showing annual family income <= ₹2.5 Lakh',
      'Previous year marksheet (passed Class 10th/12th/Semester)',
      'Current course fee receipt & College Admission Verification Letter',
      'Student Bank Passbook seeded with Aadhaar'
    ],
    last_verified: '2026-08-10',
    source_text: `The Post Matric Scholarship scheme provides financial assistance to students belonging to Scheduled Castes, Scheduled Tribes, and Other Backward Classes for studying in recognized post-matriculation or post-secondary courses.
Eligibility:
1. Student must belong to SC, ST, or OBC category.
2. The total annual income of the parents/guardians from all sources must not exceed ₹2,50,000/- per annum.
3. The student must have passed the matriculation or higher secondary examination.
4. Candidates who after passing one stage of education are studying in the same stage of education in a different subject (e.g. I.Sc. after I.A.) are not eligible.
Components of scholarship include: maintenance allowance, reimbursement of compulsory non-refundable fees, study tour charges, thesis typing/printing charges, and book allowance for student correspondence courses.`,
    chunks: [
      {
        id: 'pms-1',
        title: 'Income Limit',
        section: 'Clause 3: Income Ceiling',
        content: 'Annual parental/family income from all sources must not exceed ₹2,50,000 per annum for SC/ST and OBC students.',
        citation_tag: 'National Scholarship Portal Post-Matric Norms §3'
      },
      {
        id: 'pms-2',
        title: 'Benefits Provided',
        section: 'Clause 4: Components of Assistance',
        content: 'Provides 100% compulsory course fees reimbursement plus monthly living allowance disbursed via DBT.',
        citation_tag: 'Ministry of Social Justice Notification §4'
      }
    ],
    application_steps: [
      'Register with Aadhaar on the National Scholarship Portal (scholarships.gov.in).',
      'Select "Department of Social Justice and Empowerment" -> "Post Matric Scholarship".',
      'Provide institute code, course details, and upload caste and income certificates.',
      'Submit online application and forward hardcopy verification to the college nodal officer.'
    ],
    official_contact: 'NSP Helpdesk: 0120-6619540 / helpdesk@nsp.gov.in'
  },
  {
    id: 'pm-yasasvi',
    name: 'PM Young Achievers Scholarship Award Scheme for Vibrant India (PM-YASASVI)',
    short_name: 'PM-YASASVI',
    ministry: 'Ministry of Social Justice and Empowerment',
    category: 'Education',
    category_icon: 'BookOpen',
    benefit_summary: 'Annual scholarship of ₹75,000 for Class 9–10 and ₹1,25,000 for Class 11–12 students in identified Top Class Schools.',
    benefit_details: [
      'Scholarship of ₹75,000 per annum for Class 9 and 10 students.',
      'Scholarship of ₹1,25,000 per annum for Class 11 and 12 students.',
      'Covers tuition fees, hostel fees, books, and essential educational equipment.',
      'Merit-cum-means selection for OBC, EBC, and DNT/NT students.'
    ],
    eligibility: {
      occupation: 'student',
      income_max: 250000,
      age_min: 13,
      age_max: 19,
      state: 'all',
      required_conditions: ['student_enrolled'],
      excluded_conditions: []
    },
    occupation_tags: [
      'student',
      'school student',
      'matric student',
      'secondary student',
      'high schooler',
      'pupil'
    ],
    official_apply_url: 'https://yet.nta.ac.in',
    required_documents: [
      'Aadhaar Card',
      'Income Certificate (<= ₹2,50,000/year)',
      'Community/Caste Certificate (OBC, EBC, or Nomadic/Semi-Nomadic Tribes)',
      'Previous Class Marks Certificate (minimum 60% marks)',
      'Bonafide student certificate from recognized Top Class School'
    ],
    last_verified: '2026-08-05',
    source_text: `PM-YASASVI is a flagship scholarship scheme for school students belonging to OBC, EBC, and DNT categories studying in designated Top Class Schools across India.
Selection is made based on merit in Class 8th / 10th or through the YASASVI Entrance Test administered by National Testing Agency (NTA).
The annual parental income cap is ₹2.50 lakh. The scholarship provides:
- Class 9 and 10: Up to ₹75,000/- per student per year.
- Class 11 and 12: Up to ₹1,25,000/- per student per year.
Funds are credited directly to student bank accounts under DBT.`,
    chunks: [
      {
        id: 'yasasvi-1',
        title: 'Scholarship Amounts',
        section: 'Section 2: Scholarship Norms',
        content: 'Provides ₹75,000/year for Class 9–10 and ₹1,25,000/year for Class 11–12 covering full school fees and boarding.',
        citation_tag: 'PM-YASASVI Scheme Guidelines §2'
      },
      {
        id: 'yasasvi-2',
        title: 'Category and Income',
        section: 'Section 3: Eligibility Matrix',
        content: 'Open to OBC, EBC, and DNT students studying in Top Class Schools with annual family income not exceeding ₹2,50,000.',
        citation_tag: 'PM-YASASVI Notification §3.2'
      }
    ],
    application_steps: [
      'Register on yet.nta.ac.in or scholarships.gov.in during the national application window.',
      'Verify student details against the school UDISE+ database.',
      'Upload caste, income certificate, and previous year academic grade sheet.',
      'Disbursement processed directly via DBT upon state verification.'
    ],
    official_contact: 'NTA YASASVI Helpline: 011-40759000'
  },
  {
    id: 'national-award-teachers',
    name: 'National Award to Teachers (PMMMNMTT Framework)',
    short_name: 'National Award to Teachers',
    ministry: 'Ministry of Education',
    category: 'Teaching & Education',
    category_icon: 'Award',
    benefit_summary: 'Cash prize of ₹50,000, Silver Medal, Certificate of Merit, and national recognition by the President of India.',
    benefit_details: [
      'Prestigious Certificate of Merit signed by the President of India.',
      'Cash award of ₹50,000.',
      'Silver Medal and ceremonial felicitation on National Teachers Day (5th September).',
      'Sponsored academic sabbatical and fully funded participation in national policy roundtables.'
    ],
    eligibility: {
      occupation: 'teacher',
      income_max: null,
      age_min: 30,
      age_max: 65,
      state: 'all',
      required_conditions: ['teaching_service_10yrs'],
      excluded_conditions: ['criminal_record', 'departmental_inquiry_pending']
    },
    occupation_tags: [
      'teacher',
      'educator',
      'school teacher',
      'headmaster',
      'principal',
      'faculty',
      'instructor',
      'pedagogue'
    ],
    official_apply_url: 'https://nationalawardstoteachers.education.gov.in',
    required_documents: [
      'Aadhaar / National Identity proof',
      'Continuous 10-year Service Record certified by District Education Officer',
      'School affiliation / recognition certificate',
      'Portfolio of innovative pedagogy, ICT usage, and student learning outcome improvements',
      'No-dues and Vigilance Clearance certificate'
    ],
    last_verified: '2026-07-28',
    source_text: `The National Award to Teachers is conferred annually on Teachers' Day (5th September) to celebrate the unique contribution of some of the finest teachers in the country.
Eligibility:
1. Classroom teachers and Heads of Schools working in recognized primary, middle, high and higher secondary schools managed by State/UT Govts, Local Bodies, Central Govt (KVS, NVS, CBSE, CISCE).
2. Minimum 10 years of regular teaching service in recognized schools.
3. Teachers who have demonstrated outstanding commitment, innovative pedagogical interventions, improvement in enrollment, and community mobilization.
4. Retired teachers, educational administrators, and private tutors are strictly not eligible.
Award consists of: Certificate of Merit, Cash Award of ₹50,000/-, and Silver Medal.`,
    chunks: [
      {
        id: 'nat-1',
        title: 'Service Requirement',
        section: 'Clause 2.1: Eligibility Guidelines',
        content: 'Must have completed a minimum of 10 years of regular continuous teaching service in a recognized primary or secondary school.',
        citation_tag: 'NAT Official Selection Criteria §2.1'
      },
      {
        id: 'nat-2',
        title: 'Award Inclusions',
        section: 'Clause 1.2: Award Package',
        content: 'Recipients receive ₹50,000 cash, a Silver Medal, and a presidential Certificate of Merit.',
        citation_tag: 'Ministry of Education Gazette §1.2'
      }
    ],
    application_steps: [
      'Submit self-nomination on nationalawardstoteachers.education.gov.in.',
      'Upload video clips and documentary evidence of innovative classroom interventions.',
      'District Selection Committee (DSC) reviews and shortlists top 3 candidates per district.',
      'National Jury conducts online/in-person presentations before final presidential approval.'
    ],
    official_contact: 'Ministry of Education Teachers Desk: nat.moe@gov.in'
  },
  {
    id: 'cghs',
    name: 'Central Government Health Scheme (CGHS)',
    short_name: 'CGHS',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Healthcare & Public Service',
    category_icon: 'HeartPulse',
    benefit_summary: 'Comprehensive cashless outpatient and inpatient healthcare, consultations, and medicines across empanelled hospitals.',
    benefit_details: [
      'OPD treatment and subsidized medicines through nationwide CGHS wellness centers.',
      'Cashless inpatient treatment in empanelled private and government super-specialty hospitals.',
      'Coverage for employee, spouse, dependent children, and dependent parents.',
      'Lifelong coverage available for central government pensioners via permanent plastic card.'
    ],
    eligibility: {
      occupation: 'government_employee',
      income_max: null,
      age_min: 18,
      age_max: null,
      state: 'all',
      required_conditions: ['central_govt_employee_or_pensioner'],
      excluded_conditions: []
    },
    occupation_tags: [
      'government employee',
      'central government',
      'civil servant',
      'pensioner',
      'railway staff',
      'postal worker',
      'public servant',
      'bureaucrat'
    ],
    official_apply_url: 'https://cghs.nic.in',
    required_documents: [
      'Employee Service Identity Card or Pension Payment Order (PPO)',
      'Aadhaar Card of employee and all dependent family members',
      'Last month pay slip showing CGHS monthly subscription deduction',
      'Dependency certificate and address proof of the beneficiary'
    ],
    last_verified: '2026-08-18',
    source_text: `Central Government Health Scheme (CGHS) provides comprehensive healthcare facilities for Central Government employees and pensioners and their family members residing in CGHS-covered cities.
Coverage includes:
1. OPD Care including issue of medicines.
2. Specialist consultation at Wellness Centres and Polyclinics.
3. Cashless hospitalization in empaneled private hospitals and diagnostic centres for pensioners; reimbursement for serving employees.
4. Emergency treatment in any private or public facility.
Beneficiaries: All Central Government servants paid from Civil Estimates, MPs, Sitting and retired Judges of Supreme Court and High Courts, and Central Civil Pensioners drawing pension from civil estimates.`,
    chunks: [
      {
        id: 'cghs-1',
        title: 'Coverage Scope',
        section: 'Chapter 1: Benefits Overview',
        content: 'Provides cashless super-specialty inpatient treatment and free OPD consultations with medicines across all CGHS wellness centres.',
        citation_tag: 'CGHS Operational Manual Ch.1'
      },
      {
        id: 'cghs-2',
        title: 'Eligibility Criteria',
        section: 'Chapter 2: Beneficiary Categories',
        content: 'Serving employees of Central Government paid from Civil Estimates, Central pensioners, and their eligible dependent family members.',
        citation_tag: 'CGHS Rulebook Ch.2 §4'
      }
    ],
    application_steps: [
      'Apply online through cghs.nic.in "Apply Plastic Card" portal.',
      'Enter service book details, DDO code, and list dependent family members with photos.',
      'Get application verified by Head of Office / DDO.',
      'Download CGHS e-Card and collect physical plastic card from designated Wellness Centre.'
    ],
    official_contact: 'CGHS Toll-Free Helpline: 1800-208-8900'
  },
  {
    id: 'pm-svanidhi',
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM-SVANidhi)",
    short_name: 'PM-SVANidhi',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Livelihood & Self-Employment',
    category_icon: 'Store',
    benefit_summary: 'Collateral-free working capital loan of ₹10,000 (1st), ₹20,000 (2nd), and up to ₹50,000 (3rd tranche) with 7% interest subsidy.',
    benefit_details: [
      'Initial collateral-free working capital loan of up to ₹10,000 with 1-year tenure.',
      'Enhanced loan limit of ₹20,000 on timely repayment, followed by ₹50,000 in the 3rd tranche.',
      '7% interest subsidy per annum credited directly to bank account on quarterly basis.',
      'Cashback incentive of up to ₹1,200 per year on eligible digital transactions (UPI/QR).'
    ],
    eligibility: {
      occupation: 'street_vendor',
      income_max: null,
      age_min: 18,
      age_max: null,
      state: 'all',
      required_conditions: ['vendor_id_or_recommendation'],
      excluded_conditions: []
    },
    occupation_tags: [
      'street vendor',
      'vendor',
      'hawker',
      'thelawala',
      'rehri wala',
      'cart vendor',
      'roadside seller',
      'self employed vendor'
    ],
    official_apply_url: 'https://pmsvanidhi.mohua.gov.in',
    required_documents: [
      'Aadhaar Card linked with mobile number',
      'Vending Certificate / Identity Card issued by Urban Local Body (ULB) OR Letter of Recommendation (LoR)',
      'Active Savings Bank Account Passbook with IFSC',
      'QR Code / UPI ID for digital cashback registration'
    ],
    last_verified: '2026-08-12',
    source_text: `PM-SVANidhi is a special micro-credit facility for street vendors launched by the Ministry of Housing and Urban Affairs.
The scheme aims to empower street vendors by not only extending loans to vendor households but also for their holistic development and economic upliftment.
Key Scheme Features:
1. Initial working capital loan up to ₹10,000.
2. Second tranche loan up to ₹20,000 on timely repayment of first loan.
3. Third tranche loan up to ₹50,000 on timely repayment of second loan.
4. Interest subsidy at 7% per annum on timely/early repayment.
5. Monthly cashback of up to ₹100 for digital payments.
Eligibility: Street vendors/hawkers vending in urban areas as on or before March 24, 2020 holding a Certificate of Vending / ID card issued by Urban Local Bodies (ULBs) or possessing a Letter of Recommendation.`,
    chunks: [
      {
        id: 'svanidhi-1',
        title: 'Loan Tranches & Interest Subsidy',
        section: 'Section 4: Credit Facility',
        content: 'Collateral-free working capital loans of ₹10,000, ₹20,000, and ₹50,000 with a 7% interest subsidy for prompt repayment and ₹1,200 annual digital cashback.',
        citation_tag: 'PM-SVANidhi Scheme Guidelines §4.1'
      },
      {
        id: 'svanidhi-2',
        title: 'Urban Street Vendor Eligibility',
        section: 'Section 3: Eligibility Criteria',
        content: 'Vendors in urban and peri-urban areas who possess a ULB Vending Certificate, ID Card, or Urban Local Body Letter of Recommendation.',
        citation_tag: 'PM-SVANidhi Policy Framework §3'
      }
    ],
    application_steps: [
      'Visit pmsvanidhi.mohua.gov.in or apply through nearby Common Service Centre (CSC) or bank branch.',
      'Enter Aadhaar and Mobile number for OTP validation.',
      'Select Vending Status (Certificate of Vending or Letter of Recommendation).',
      'Select preferred lending institution and submit loan request.'
    ],
    official_contact: 'PM-SVANidhi Toll-Free: 1800-11-1979'
  },
  {
    id: 'pm-mudra',
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    short_name: 'PMMY (Mudra Loan)',
    ministry: 'Ministry of Finance (Department of Financial Services)',
    category: 'Business & MSME',
    category_icon: 'Briefcase',
    benefit_summary: 'Collateral-free micro-enterprise loans up to ₹10 Lakhs (extended up to ₹20 Lakhs) across Shishu, Kishore, and Tarun categories.',
    benefit_details: [
      'Shishu: Loans up to ₹50,000 for startup micro-enterprises.',
      'Kishore: Loans from ₹50,001 up to ₹5,00,000 for established small businesses.',
      'Tarun: Loans from ₹5,00,001 up to ₹10,00,000 (and Tarun Plus up to ₹20,00,000) for enterprise expansion.',
      'Zero collateral requirement; nominal processing fee (nil for Shishu).'
    ],
    eligibility: {
      occupation: 'entrepreneur',
      income_max: null,
      age_min: 18,
      age_max: 65,
      state: 'all',
      required_conditions: ['non_farm_enterprise'],
      excluded_conditions: ['defaulter_any_bank']
    },
    occupation_tags: [
      'entrepreneur',
      'business owner',
      'small business',
      'shopkeeper',
      'trader',
      'artisan',
      'manufacturer',
      'service provider',
      'msme owner'
    ],
    official_apply_url: 'https://www.mudra.org.in',
    required_documents: [
      'Aadhaar / Voter ID / Passport for Identity Proof',
      'Business Registration / Udyam Aadhar Registration',
      'Proof of Business Address (Utility Bill, Rent Agreement)',
      'Bank Account Statement for the last 6 months',
      'Quotation for machinery / raw material to be purchased (for Kishore/Tarun)'
    ],
    last_verified: '2026-08-14',
    source_text: `Pradhan Mantri MUDRA Yojana (PMMY) is a scheme launched by the Hon'ble Prime Minister for providing loans up to 10 lakh to the non-corporate, non-farm small/micro enterprises.
These loans are given by Commercial Banks, RRBs, Small Finance Banks, MFIs and NBFCs.
Under the aegis of PMMY, MUDRA has created three products:
1. 'Shishu' : covering loans up to ₹50,000/-
2. 'Kishor' : covering loans above ₹50,000/- and up to ₹5 lakh
3. 'Tarun' : covering loans above ₹5 lakh and up to ₹10 lakh (recently expanded to ₹20 lakh under Budget 2024 for entrepreneurs who have repaid Tarun loans).
No collateral security is required from the borrower. Credit guarantee is provided through Credit Guarantee Fund for Micro Units (CGFMU).`,
    chunks: [
      {
        id: 'mudra-1',
        title: 'Loan Categories',
        section: 'Section 2: Product Categorization',
        content: 'Three tiers of collateral-free loans: Shishu (up to ₹50k), Kishore (₹50k–₹5L), and Tarun (₹5L–₹10L/₹20L) for non-farm micro enterprises.',
        citation_tag: 'MUDRA Scheme Guidelines §2'
      },
      {
        id: 'mudra-2',
        title: 'Collateral & Guarantee',
        section: 'Section 4: Guarantee Norms',
        content: 'No collateral is required. Loans are backed by the Credit Guarantee Fund for Micro Units (CGFMU).',
        citation_tag: 'DFS PMMY Notification §4'
      }
    ],
    application_steps: [
      'Prepare business proposal and identify loan category (Shishu, Kishore, or Tarun).',
      'Apply online via udyamimitra.in portal or visit any commercial/rural bank.',
      'Submit identity proof, address proof, Udyam certificate, and equipment quotes.',
      'Bank sanctions loan and issues Mudra Debit Card for working capital withdrawals.'
    ],
    official_contact: 'National Mudra Helpline: 1800-180-1111 / 1800-11-0001'
  },
  {
    id: 'pm-sym',
    name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)',
    short_name: 'PM-SYM Pension',
    ministry: 'Ministry of Labour and Employment',
    category: 'Social Welfare & Pension',
    category_icon: 'ShieldCheck',
    benefit_summary: 'Assured minimum monthly pension of ₹3,000 after attaining age 60 with a 50:50 matching Government contribution.',
    benefit_details: [
      'Guaranteed lifelong pension of ₹3,000 per month on reaching age 60.',
      'Matching contribution: Government of India contributes an equal amount (₹55 to ₹200/month depending on entry age).',
      'Family pension: 50% of pension (₹1,500/month) transferred to spouse in the event of subscriber demise.',
      'Seamless auto-debit through savings bank account or Jan Dhan account.'
    ],
    eligibility: {
      occupation: 'unorganized_worker',
      income_max: 180000, // Monthly income <= ₹15,000 (~₹1.8L annual)
      age_min: 18,
      age_max: 40,
      state: 'all',
      required_conditions: ['unorganized_worker'],
      excluded_conditions: ['epfo_member', 'esic_member', 'nps_member', 'income_taxpayer']
    },
    occupation_tags: [
      'unorganized worker',
      'daily wager',
      'labourer',
      'mazdoor',
      'construction worker',
      'domestic worker',
      'maid',
      'auto driver',
      'rickshaw puller',
      'porter',
      'coolie',
      'rag picker'
    ],
    official_apply_url: 'https://maandhan.in',
    required_documents: [
      'Aadhaar Card',
      'Savings Bank Account Passbook / Jan Dhan Account with IFSC',
      'Active Mobile Number linked to bank',
      'Self-declaration of monthly income <= ₹15,000 and non-taxpayer status'
    ],
    last_verified: '2026-08-16',
    source_text: `PM-SYM is a central government pension scheme tailored for old age protection and social security of unorganized workers.
Eligibility Criteria:
1. For unorganized workers (home-based workers, street vendors, midday meal workers, head loaders, brick kiln workers, cobblers, rag pickers, domestic workers, washermen, rickshaw pullers, landless laborers, etc.).
2. Entry age between 18 and 40 years.
3. Monthly income should be ₹15,000/- or below.
4. Should not be engaged in organized sector (not a member of EPFO/ESIC/NPS).
5. Should not be an income taxpayer.
Benefits: Each subscriber under PM-SYM shall receive minimum assured pension of ₹3,000/- per month after attaining the age of 60 years. If the subscriber dies, the spouse of the beneficiary shall be entitled to receive 50% of the pension as family pension.`,
    chunks: [
      {
        id: 'sym-1',
        title: 'Monthly Pension & 50:50 Contribution',
        section: 'Section 3: Pension Entitlement',
        content: 'Provides ₹3,000 guaranteed monthly pension after age 60 with 50% government co-contribution during the accumulation phase.',
        citation_tag: 'PM-SYM Official Rules §3'
      },
      {
        id: 'sym-2',
        title: 'Entry Age & Wage Ceiling',
        section: 'Section 2: Eligibility Rules',
        content: 'Unorganized workers aged 18 to 40 years with monthly income not exceeding ₹15,000 who are not covered under EPFO/ESIC/NPS.',
        citation_tag: 'Ministry of Labour Notification §2.1'
      }
    ],
    application_steps: [
      'Visit nearest Common Services Centre (CSC) with Aadhaar and Bank Passbook.',
      'CSC VLE enters details on maandhan.in and calculates initial monthly subscription.',
      'Sign auto-debit mandate form allowing monthly debit from savings account.',
      'Shram Yogi Pension Card (SPAN) is generated and handed over immediately.'
    ],
    official_contact: 'PM-SYM Toll-Free Helpline: 1800-267-6888'
  },
  {
    id: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    short_name: 'Atal Pension Yojana',
    ministry: 'Ministry of Finance (PFRDA)',
    category: 'Universal Pension',
    category_icon: 'PiggyBank',
    benefit_summary: 'Guaranteed lifetime monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60, backed by sovereign guarantee.',
    benefit_details: [
      'Guaranteed monthly pension ranging from ₹1,000 to ₹5,000 chosen by subscriber upon enrollment.',
      'Sovereign government guarantee ensures pension amount even if market returns fluctuate.',
      'Spouse receives same pension amount for life upon demise of subscriber.',
      'Full accumulated pension corpus returned to designated nominee after demise of both subscriber and spouse.'
    ],
    eligibility: {
      occupation: 'universal',
      income_max: null,
      age_min: 18,
      age_max: 40,
      state: 'all',
      required_conditions: ['savings_bank_account'],
      excluded_conditions: ['income_taxpayer']
    },
    occupation_tags: [
      'citizen',
      'self employed',
      'freelancer',
      'unorganized worker',
      'shopkeeper',
      'private employee',
      'worker',
      'universal'
    ],
    official_apply_url: 'https://www.npscra.nsdl.co.in',
    required_documents: [
      'Aadhaar Card',
      'Savings Bank Account with active auto-debit facility',
      'Active Mobile Phone Number for transaction alerts',
      'Nominee details (Aadhaar and Relationship proof)'
    ],
    last_verified: '2026-08-11',
    source_text: `Atal Pension Yojana (APY) is a periodic pension scheme administered by the Pension Fund Regulatory and Development Authority (PFRDA).
APY is open to all bank account holders aged between 18 and 40 years.
Important Amendment: From 1st October 2022, any citizen who is or has been an income tax payer as per Income Tax Act shall not be eligible to join APY.
Key Benefits:
- Minimum guaranteed monthly pension of ₹1,000/-, ₹2,000/-, ₹3,000/-, ₹4,000/- or ₹5,000/- per month from age 60 years until death.
- Same pension amount continues to spouse after subscriber death.
- On death of both subscriber and spouse, the entire accumulated pension wealth is returned to the nominee.`,
    chunks: [
      {
        id: 'apy-1',
        title: 'Guaranteed Pension Tiers',
        section: 'Section 2: Pension Benefits',
        content: 'Provides sovereign-guaranteed monthly pension of ₹1,000 to ₹5,000 after reaching age 60, with spouse continuance and nominee wealth return.',
        citation_tag: 'PFRDA APY Guidelines §2'
      },
      {
        id: 'apy-2',
        title: 'Taxpayer Exclusion',
        section: 'Section 3: Eligibility & Exclusions',
        content: 'Open to all Indian citizens aged 18–40 years. Taxpayers paying income tax are excluded as per the Oct 2022 amendment.',
        citation_tag: 'Gazette of India APY Amendment §3'
      }
    ],
    application_steps: [
      'Visit your savings bank branch or netbanking portal (SBI, PNB, HDFC, etc.).',
      'Fill APY registration form, choose desired monthly pension tier (₹1,000 to ₹5,000).',
      'Authorize monthly/quarterly auto-debit mandate.',
      'Receive Permanent Retirement Account Number (PRAN) via SMS.'
    ],
    official_contact: 'PFRDA Toll Free: 1800-110-069'
  },
  {
    id: 'ignoaps-pension',
    name: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    short_name: 'Old Age Pension (IGNOAPS)',
    ministry: 'Ministry of Rural Development',
    category: 'Senior Citizen Welfare',
    category_icon: 'Users',
    benefit_summary: 'Monthly cash pension of ₹200 to ₹500 (plus state top-up up to ₹1,500–₹2,500/month) for BPL senior citizens aged 60+.',
    benefit_details: [
      'Direct monthly pension credited into beneficiary savings bank or post office account.',
      'Central contribution of ₹200/month for seniors aged 60–79; increases to ₹500/month for seniors aged 80+.',
      'States supplement this with additional monthly top-ups (e.g., Delhi adds ₹2,000, Haryana adds ₹2,750).',
      'Covers elderly citizens with no regular source of financial subsistence.'
    ],
    eligibility: {
      occupation: 'senior_citizen',
      income_max: 100000,
      age_min: 60,
      age_max: null,
      state: 'all',
      required_conditions: ['bpl_card'],
      excluded_conditions: []
    },
    occupation_tags: [
      'senior citizen',
      'elderly',
      'old age',
      'retiree',
      'aged person',
      'geriatric',
      'senior'
    ],
    official_apply_url: 'https://nsap.nic.in',
    required_documents: [
      'Age Proof (Aadhaar Card, Voter ID, or School Leaving Certificate)',
      'BPL (Below Poverty Line) Ration Card / SECC BPL Verification',
      'Bank Account Passbook or Post Office Savings Account',
      'Income Certificate issued by Revenue Authority (Tahsildar)',
      'Passport size photograph'
    ],
    last_verified: '2026-08-19',
    source_text: `Indira Gandhi National Old Age Pension Scheme (IGNOAPS) is a component of the National Social Assistance Programme (NSAP) administered by the Ministry of Rural Development.
Eligibility:
1. The applicant should be a person aged 60 years and above.
2. The applicant must belong to a household living Below the Poverty Line (BPL) according to criteria prescribed by the Government of India.
Assistance Amount:
- Age 60–79 years: Central assistance of ₹200 per month per beneficiary.
- Age 80 years and above: Central assistance of ₹500 per month per beneficiary.
State governments are strongly urged to provide matching or higher contribution, with many states providing ₹1,000 to ₹3,000 total monthly pension.`,
    chunks: [
      {
        id: 'ignoaps-1',
        title: 'Eligibility Requirements',
        section: 'Section 2.1: Eligibility Criteria',
        content: 'Citizens aged 60 years or older belonging to certified Below Poverty Line (BPL) households.',
        citation_tag: 'NSAP Guidelines IGNOAPS §2.1'
      },
      {
        id: 'ignoaps-2',
        title: 'Pension Norms',
        section: 'Section 3: Assistance Scale',
        content: 'Provides ₹200/month (ages 60–79) and ₹500/month (ages 80+) with supplementary state top-ups.',
        citation_tag: 'Ministry of Rural Development NSAP Framework §3'
      }
    ],
    application_steps: [
      'Collect Form A from local Gram Panchayat or Block Development Office / Municipal Ward Office.',
      'Attach copy of BPL card, Aadhaar, and age verification document.',
      'Submit to Block Social Welfare Officer or online via nsap.nic.in.',
      'Sanction order issued and monthly DBT pension starts within 45 days.'
    ],
    official_contact: 'NSAP Helpline: 1800-180-6127'
  },
  {
    id: 'adip-divyangjan',
    name: 'ADIP Scheme & Divyangjan Swavalamban (Assistance to PwD)',
    short_name: 'ADIP Divyangjan Yojana',
    ministry: 'Ministry of Social Justice and Empowerment (DEPwD)',
    category: 'Disability Welfare',
    category_icon: 'Accessibility',
    benefit_summary: 'Free motorized tricycles, wheelchairs, smart canes, digital hearing aids, and concessional loans up to ₹50 Lakhs.',
    benefit_details: [
      'Free distribution of certified assistive aids, high-end prosthetics, motorized tricycles, and cochlear implants.',
      '100% grant for assistive aids for individuals with monthly income up to ₹22,500; 50% grant for income up to ₹30,000.',
      'Concessional loans up to ₹50 Lakhs at 4%–8% interest rate for self-employment enterprises via NHFDC.',
      'Skill training stipends and educational scholarships for students with disabilities.'
    ],
    eligibility: {
      occupation: 'person_with_disability',
      income_max: 360000, // Monthly income <= ₹30,000
      age_min: null,
      age_max: null,
      state: 'all',
      required_conditions: ['disability_40_plus'],
      excluded_conditions: []
    },
    occupation_tags: [
      'person with disability',
      'divyang',
      'divyangjan',
      'disabled',
      'pwd',
      'handicapped',
      'visually impaired',
      'locomotor disability',
      'hearing impaired'
    ],
    official_apply_url: 'https://disabilityaffairs.gov.in',
    required_documents: [
      'Unique Disability ID (UDID) Card or Disability Certificate showing 40% or more disability',
      'Income Certificate (monthly income <= ₹30,000 for 100% subsidy)',
      'Aadhaar Card and Domicile proof',
      'Prescription / recommendation letter from ALIMCO or District Medical Board for required assistive appliance'
    ],
    last_verified: '2026-08-08',
    source_text: `The Scheme of Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP Scheme) aims to assist needy persons with disabilities in procuring durable, sophisticated and scientifically manufactured standard aids and appliances that promote their physical, social and psychological rehabilitation.
Eligibility:
1. Must be an Indian citizen of any age.
2. Must hold 40% or more disability certificate certified by competent medical authority.
3. Monthly income from all sources:
   - Up to ₹22,500/- per month: 100% cost of the aid/appliance is borne by Govt.
   - ₹22,501/- to ₹30,000/- per month: 50% cost is borne by Govt.
4. Persons who have not received similar assistance from Government in the last 3 years (1 year for children).`,
    chunks: [
      {
        id: 'adip-1',
        title: 'Income and Aid Subsidy',
        section: 'Section 4: Quantum of Assistance',
        content: 'Full 100% cost subsidy on aids/appliances for monthly income up to ₹22,500; 50% subsidy for monthly income up to ₹30,000.',
        citation_tag: 'ADIP Scheme Revised Guidelines §4'
      },
      {
        id: 'adip-2',
        title: 'Disability Benchmark',
        section: 'Section 3: Eligibility Criteria',
        content: 'Requires minimum 40% certified benchmark disability under the Rights of Persons with Disabilities Act.',
        citation_tag: 'DEPwD Gazette Notification §3.1'
      }
    ],
    application_steps: [
      'Register on the national UDID portal (swavlambancard.gov.in) to obtain verified UDID card.',
      'Apply at local ALIMCO assessment camp or District Disability Rehabilitation Centre (DDRC).',
      'Submit income certificate and medical recommendation.',
      'Collect fitted prosthetic, motorized tricycle, or digital hearing aid at distribution camp.'
    ],
    official_contact: 'ALIMCO Toll-Free: 1800-180-5129'
  },
  {
    id: 'pmegp',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    short_name: 'PMEGP Subsidy',
    ministry: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    category: 'Employment & Self-Employment',
    category_icon: 'Zap',
    benefit_summary: 'Credit-linked margin money capital subsidy of 15% to 35% on micro-enterprise projects up to ₹50 Lakhs.',
    benefit_details: [
      'Maximum project cost covered: ₹50 Lakhs for manufacturing units; ₹20 Lakhs for service sector units.',
      'Margin money subsidy: 15% to 25% for General category applicants; 25% to 35% for Special categories (SC, ST, OBC, Women, PwD, Ex-Servicemen, Rural).',
      'Bank credit finances 60%–75% of the remaining capital cost.',
      'Mandatory EDP (Entrepreneurship Development Programme) training provided free of cost.'
    ],
    eligibility: {
      occupation: 'unemployed',
      income_max: null,
      age_min: 18,
      age_max: null,
      state: 'all',
      required_conditions: ['class_8_pass_for_manufacturing'],
      excluded_conditions: []
    },
    occupation_tags: [
      'unemployed',
      'job seeker',
      'youth',
      'aspiring entrepreneur',
      'self employed',
      'graduate',
      'fresher',
      'business starter'
    ],
    official_apply_url: 'https://www.kviconline.gov.in/pmegpeportal',
    required_documents: [
      'Aadhaar Card and PAN Card',
      'Highest Educational Qualification Certificate (8th pass minimum for manufacturing > ₹10L)',
      'Detailed Project Report (DPR) detailing machinery, raw materials, and revenue projections',
      'Special Category Certificate (Caste, Ex-Serviceman, PwD) if claiming 35% higher subsidy',
      'Rural area certificate from Gram Panchayat (for rural subsidy rates)'
    ],
    last_verified: '2026-08-17',
    source_text: `Prime Minister's Employment Generation Programme (PMEGP) is a major credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in the non-farm sector by helping traditional artisans and unemployed youth.
Quantum of Margin Money Subsidy:
1. General Category: 15% (Urban), 25% (Rural). Beneficiary contribution is 10%.
2. Special Category (SC/ST/OBC/Minorities/Women/Ex-servicemen/Physically Disabled/NER/Hill areas): 25% (Urban), 35% (Rural). Beneficiary contribution is 5%.
Maximum Project Cost: ₹50 lakh for manufacturing sector; ₹20 lakh for service sector.
Eligibility: Any individual above 18 years of age. At least 8th standard pass for projects costing above ₹10 lakh in manufacturing and above ₹5 lakh in service sector.`,
    chunks: [
      {
        id: 'pmegp-1',
        title: 'Subsidy Rates',
        section: 'Section 4: Subsidy Norms',
        content: 'Provides 15% to 35% margin money subsidy on project costs up to ₹50L (manufacturing) and ₹20L (service) with beneficiary contribution of only 5% to 10%.',
        citation_tag: 'PMEGP Operational Guidelines §4'
      },
      {
        id: 'pmegp-2',
        title: 'Eligibility Criteria',
        section: 'Section 3: Eligible Borrowers',
        content: 'Any individual over 18 years of age; 8th pass certificate required only for projects exceeding ₹10L (manufacturing) or ₹5L (services).',
        citation_tag: 'KVIC PMEGP Framework §3'
      }
    ],
    application_steps: [
      'Apply online on the official KVIC portal (kviconline.gov.in/pmegpeportal).',
      'Select Sponsoring Agency (KVIC, KVIB, or DIC) and preferred financing bank.',
      'Upload DPR, Aadhaar, Caste certificate, and 8th pass marksheet.',
      'District Task Force Committee reviews and recommends to bank for loan sanction.'
    ],
    official_contact: 'PMEGP Helpdesk: 022-26711017'
  },
  {
    id: 'echs-defence',
    name: 'Ex-Servicemen Contributory Health Scheme (ECHS)',
    short_name: 'ECHS Defence Healthcare',
    ministry: 'Ministry of Defence (Department of Ex-Servicemen Welfare)',
    category: 'Defence & Veterans',
    category_icon: 'Shield',
    benefit_summary: 'Comprehensive cashless healthcare, diagnostics, and medicines for defence veterans, ex-servicemen, and their families.',
    benefit_details: [
      '100% cashless medical consultation, diagnostics, medicines, and hospitalization.',
      'Treatment available through 427 dedicated ECHS polyclinics and hundreds of empanelled private super-specialty hospitals.',
      'Full coverage for veteran, spouse, and eligible dependents without monetary cap.',
      'Emergency cashless treatment in any hospital across India.'
    ],
    eligibility: {
      occupation: 'defence_personnel',
      income_max: null,
      age_min: 18,
      age_max: null,
      state: 'all',
      required_conditions: ['ex_serviceman_pensioner'],
      excluded_conditions: []
    },
    occupation_tags: [
      'defence personnel',
      'army',
      'navy',
      'air force',
      'veteran',
      'soldier',
      'fauji',
      'ex-serviceman',
      'military',
      'war widow'
    ],
    official_apply_url: 'https://echs.gov.in',
    required_documents: [
      'Discharge Book / Service Book copy showing military service record',
      'Pension Payment Order (PPO)',
      'Aadhaar Card of veteran and dependent family members',
      'One-time contribution receipt or exemption certificate (war widows/disability pensioners)'
    ],
    last_verified: '2026-08-07',
    source_text: `Ex-Servicemen Contributory Health Scheme (ECHS) was approved by the Government on 30 Dec 2002 to provide all-inclusive healthcare to Armed Forces pensioners and their eligible dependents.
Coverage: Complete medical cover through network of ECHS Polyclinics, Service Hospitals and civil empaneled hospitals across the country.
Eligible Categories:
1. Ex-Servicemen drawing service/disability/family pension from Defence Estimates.
2. War Widows, next-of-kin, and dependent children up to 25 years of age (unmarried/unemployed).
3. Pre-1996 retirees are covered with complete exemption of contribution for war disabled and gallantry awardees.`,
    chunks: [
      {
        id: 'echs-1',
        title: 'Comprehensive Medical Cover',
        section: 'Chapter 1: Scheme Charter',
        content: 'Provides comprehensive cashless medical cover for ex-servicemen pensioners and their eligible dependents across military and empaneled hospitals.',
        citation_tag: 'ECHS Charter of Care Ch.1 §2'
      },
      {
        id: 'echs-2',
        title: 'Eligibility Verification',
        section: 'Chapter 2: Eligibility Rules',
        content: 'Armed forces personnel drawing pension from Defence estimates, war widows, and registered dependents.',
        citation_tag: 'MOD ECHS Regulation Ch.2 §5'
      }
    ],
    application_steps: [
      'Apply online on echs.gov.in for the 64KB Smart Card.',
      'Enter PPO details, service number, and upload family photographs.',
      'Record Office verifies service antecedents and validates application.',
      'Collect 64KB chip card from parent station polyclinic.'
    ],
    official_contact: 'ECHS Toll-Free: 1800-114-115'
  },
  {
    id: 'ab-pmjay',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    short_name: 'Ayushman Bharat (PM-JAY)',
    ministry: 'Ministry of Health and Family Welfare (National Health Authority)',
    category: 'Universal Healthcare',
    category_icon: 'Activity',
    benefit_summary: 'Cashless health insurance coverage of ₹5,00,000 per family per year, now including all seniors aged 70+ regardless of income.',
    benefit_details: [
      '₹5,00,000 health insurance cover per eligible family per year for secondary and tertiary hospitalization.',
      'Universal senior citizen coverage: All Indian citizens aged 70 and above receive a dedicated ₹5,00,000 top-up cover irrespective of income.',
      'Cashless and paperless access to services at empaneled public and private hospitals across India.',
      'Covers pre-existing conditions from day one, including oncology, cardiology, neurosurgery, and orthopedics.'
    ],
    eligibility: {
      occupation: 'universal',
      income_max: null,
      age_min: null,
      age_max: null,
      state: 'all',
      required_conditions: [],
      excluded_conditions: []
    },
    occupation_tags: [
      'universal',
      'citizen',
      'farmer',
      'unorganized worker',
      'senior citizen',
      'family',
      'patient',
      'any citizen'
    ],
    official_apply_url: 'https://pmjay.gov.in',
    required_documents: [
      'Aadhaar Card for e-KYC validation',
      'Ration Card / Family ID / SECC 2011 verification letter',
      'Age proof verifying 70+ years for Senior Citizen Ayushman Vaya Vandana Card'
    ],
    last_verified: '2026-08-25',
    source_text: `Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY) is the world's largest health assurance scheme aimed at providing a health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.
Major 2024 Expansion: The Union Cabinet approved health coverage for all senior citizens aged 70 years and above, irrespective of their socio-economic status. Seniors aged 70+ receive a distinct Ayushman card providing an additional top-up cover of ₹5 lakh per year.
Key Features:
- Fully funded by the Government with cost shared between Central and State governments.
- Cashless and paperless treatment at the point of service.
- Covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses such as diagnostics and medicines.
- No restrictions on family size, age or gender.`,
    chunks: [
      {
        id: 'pmjay-1',
        title: 'Hospitalization Cover',
        section: 'Section 1.1: Benefit Package',
        content: 'Provides ₹5,00,000 cashless insurance coverage per family per year for secondary and tertiary hospitalization across all empaneled hospitals.',
        citation_tag: 'NHA PMJAY Operational Guidelines §1.1'
      },
      {
        id: 'pmjay-2',
        title: 'Universal Senior Citizen 70+ Coverage',
        section: 'Cabinet Decision 2024: Senior Citizen Expansion',
        content: 'All senior citizens aged 70 years and above are entitled to an individual ₹5 Lakh cover regardless of income or economic background.',
        citation_tag: 'Cabinet Press Release NHA 2024 PMJAY §2'
      }
    ],
    application_steps: [
      'Check eligibility on beneficiary.nha.gov.in or download the Ayushman App.',
      'Authenticate using Aadhaar e-KYC and live facial photo.',
      'Link ration card or family members.',
      'Download the official golden Ayushman PVC card instantly.'
    ],
    official_contact: 'Ayushman Toll-Free: 14555'
  }
];
