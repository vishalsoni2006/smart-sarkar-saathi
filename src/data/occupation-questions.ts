import { OccupationType } from '@/types';

export interface OccupationQuestionOption {
  value: string;
  label: string;
  description?: string;
  affectsSpecialConditions?: string[];
  removesSpecialConditions?: string[];
}

export interface OccupationQuestion {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  type: 'select' | 'radio' | 'number' | 'boolean';
  required?: boolean;
  options?: OccupationQuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  unit?: string;
  profileField?: 'land_holding_acres' | 'annual_income' | 'age';
  specialConditionTag?: string; // Tag added to userProfile.special_conditions if answered affirmatively
}

export interface OccupationQuestionSet {
  occupation: OccupationType;
  title: string;
  titleHindi: string;
  badge: string;
  icon: string;
  description: string;
  relevantSchemes: string[];
  questions: OccupationQuestion[];
}

export const OCCUPATION_QUESTION_SETS: Record<OccupationType, OccupationQuestionSet> = {
  farmer: {
    occupation: 'farmer',
    title: 'Farmer & Cultivator Eligibility Criteria',
    titleHindi: 'किसान एवं कृषक पात्रता प्रश्नावली',
    badge: 'Agriculture & Allied Sectors',
    icon: 'Tractor',
    description:
      'Answer these 5 critical farming questions to instantly qualify for PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, and subsidized Kisan Credit Cards (KCC).',
    relevantSchemes: ['pm-kisan', 'pmfby', 'kcc'],
    questions: [
      {
        id: 'land_holding_acres',
        title: '1. Total Cultivable Landholding Size',
        titleHindi: '1. कुल कृषि योग्य भूमि (एकड़ में)',
        description:
          'Small and marginal farmers holding cultivable agricultural land up to 5 acres (2 hectares) receive 100% direct benefit transfers under PM-KISAN.',
        type: 'number',
        required: true,
        min: 0.1,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 3.0',
        unit: 'Acres',
        profileField: 'land_holding_acres',
        specialConditionTag: 'has_land'
      },
      {
        id: 'land_ownership_type',
        title: '2. Land Ownership & Title Deed Record',
        titleHindi: '2. भूमि स्वामित्व का प्रकार (खतौनी/भूलेख)',
        description: 'Is the agricultural land title registered in your name or shared in ancestral family records?',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'own_name',
            label: 'Registered Landowner (Title Deed in applicant name)',
            description: 'Direct owner cultivator with updated land records (RoR/Khatauni).',
            affectsSpecialConditions: ['has_land', 'owner_cultivator']
          },
          {
            value: 'joint_family',
            label: 'Joint / Ancestral Family Land Holding',
            description: 'Cultivating shared family agricultural land.',
            affectsSpecialConditions: ['has_land']
          },
          {
            value: 'tenant_farmer',
            label: 'Tenant / Sharecropper / Leaseholder',
            description: 'Eligible for PMFBY crop insurance and KCC loan via tenant agreements.'
          }
        ]
      },
      {
        id: 'pm_kisan_ekyc',
        title: '3. PM-KISAN Aadhaar e-KYC Verification Status',
        titleHindi: '3. पीएम-किसान आधार ई-केवाईसी स्थिति',
        description: 'Compulsory biometric or OTP-based Aadhaar authentication required for installment credit.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'completed',
            label: 'Completed & Verified (ई-केवाईसी पूर्ण)',
            description: 'Aadhaar linked to bank account (DBT enabled).',
            affectsSpecialConditions: ['pmkisan_ekyc_done']
          },
          {
            value: 'pending',
            label: 'Pending / Needs Assistance (अपूर्ण)',
            description: 'Can be completed online via PM-KISAN portal or nearest CSC centre.'
          }
        ]
      },
      {
        id: 'has_kcc_card',
        title: '4. Kisan Credit Card (KCC) Institutional Credit',
        titleHindi: '4. क्या आपके पास किसान क्रेडिट कार्ड (KCC) है?',
        description: 'Enables 4% concessional interest crop loans up to ₹3 Lakhs with prompt repayment rebate.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'yes',
            label: 'Yes, I currently have an active KCC (हाँ, KCC उपलब्ध है)',
            affectsSpecialConditions: ['has_kcc']
          },
          {
            value: 'no_want_kcc',
            label: 'No, I want to apply for a new KCC loan (नहीं, नया बनवाना है)',
            affectsSpecialConditions: ['need_kcc']
          }
        ]
      },
      {
        id: 'crop_loss_risk',
        title: '5. PMFBY Crop Insurance & Risk Cover',
        titleHindi: '5. फसल बीमा (प्राकृतिक आपदा/बाढ़/सूखा सुरक्षा)',
        description: 'Protect your Kharif/Rabi sown crops against non-preventable natural calamities.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'insured',
            label: 'Crops are already insured under PMFBY this season',
            affectsSpecialConditions: ['pmfby_enrolled']
          },
          {
            value: 'uninsured',
            label: 'Not yet insured (Need crop loss insurance coverage)',
            affectsSpecialConditions: ['pmfby_eligible']
          }
        ]
      }
    ]
  },

  student: {
    occupation: 'student',
    title: 'Student & Youth Scholarship Questionnaire',
    titleHindi: 'छात्र एवं युवा छात्रवृत्ति प्रश्नावली',
    badge: 'Education & Skill Development',
    icon: 'GraduationCap',
    description:
      'Answer these 5 education questions to verify deterministic eligibility for Central Sector Post-Matric Scholarships, PM-USP, and higher education tuition fee concessions.',
    relevantSchemes: ['post-matric-sc', 'pm-usp-education'],
    questions: [
      {
        id: 'education_level',
        title: '1. Current Enrolled Level of Education',
        titleHindi: '1. वर्तमान शिक्षा का स्तर',
        description: 'Post-Matric covers Class XI, XII, ITI, Diploma, Degree, Masters, and Professional Courses.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'post_matric',
            label: 'Post-Matric (Class 11, 12, ITI, Diploma, Polytechnic)',
            affectsSpecialConditions: ['enrolled_post_matric', 'student_enrolled']
          },
          {
            value: 'higher_education',
            label: 'Undergraduate / Postgraduate / Professional Degree (BA, BSc, BTech, MBBS, etc.)',
            affectsSpecialConditions: ['enrolled_post_matric', 'higher_education_enrolled', 'student_enrolled']
          },
          {
            value: 'pre_matric',
            label: 'Pre-Matric (Class 1 to 10)',
            affectsSpecialConditions: ['student_enrolled']
          }
        ]
      },
      {
        id: 'institution_type',
        title: '2. Institution Recognition Type',
        titleHindi: '2. शैक्षणिक संस्थान की मान्यता',
        description: 'Must be recognized by State/Central Government, UGC, AICTE, or State Board.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'govt_recognized',
            label: 'Government / Government-Aided / UGC-AICTE Recognized Institution',
            affectsSpecialConditions: ['recognized_institution']
          },
          {
            value: 'private_unrecognized',
            label: 'Unrecognized Coaching or Private Tuition'
          }
        ]
      },
      {
        id: 'family_income_bracket',
        title: '3. Family Annual Income Limit Check (₹2.5 Lakhs Cap)',
        titleHindi: '3. पारिवारिक वार्षिक आय (₹2.5 लाख सीमा)',
        description: 'Government Post-Matric scholarships require combined parental annual income up to ₹2,50,000.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'below_250k',
            label: 'Yes, combined family income is strictly below ₹2,50,000 per year',
            affectsSpecialConditions: ['income_below_250k']
          },
          {
            value: 'above_250k',
            label: 'No, annual family income exceeds ₹2,50,000'
          }
        ]
      },
      {
        id: 'marks_percentage',
        title: '4. Previous Academic Examination Marks (%)',
        titleHindi: '4. पिछली कक्षा/परीक्षा में प्राप्तांक प्रतिशत',
        description: 'Merit-cum-means schemes often require 50% to 80% marks in qualifying exams.',
        type: 'number',
        required: true,
        min: 30,
        max: 100,
        step: 1,
        placeholder: 'e.g. 74',
        unit: '%'
      },
      {
        id: 'caste_certificate',
        title: '5. Valid Social Category / Caste Certificate',
        titleHindi: '5. जाति / ईडब्ल्यूएस प्रमाण पत्र उपलब्धता',
        description: 'Essential for SC, ST, OBC, or EWS dedicated scholarship grants.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'available',
            label: 'Available (Signed by Tehsildar / Sub-Divisional Magistrate)',
            affectsSpecialConditions: ['caste_certificate_available']
          },
          {
            value: 'in_process',
            label: 'Applied / In Process'
          },
          {
            value: 'not_applicable',
            label: 'Not Applicable (General Category)'
          }
        ]
      }
    ]
  },

  street_vendor: {
    occupation: 'street_vendor',
    title: 'Street Vendor & Micro Entrepreneur Questionnaire',
    titleHindi: 'स्ट्रीट वेंडर एवं फेरीवाला पात्रता प्रश्नावली',
    badge: 'Urban Livelihoods & Micro-Credit',
    icon: 'Store',
    description:
      'Answer these 5 questions to qualify for PM SVANidhi collateral-free working capital micro-loans (₹10,000, ₹20,000, ₹50,000) with 7% interest subsidy & digital cashback.',
    relevantSchemes: ['pm-svanidhi', 'pm-mudra'],
    questions: [
      {
        id: 'vending_proof',
        title: '1. Certificate of Vending (CoV) / Identity Card',
        titleHindi: '1. वेंडिंग प्रमाण पत्र / पहचान पत्र',
        description: 'Issued by the Urban Local Body (ULB) / Nagar Nigam / Town Vending Committee (TVC).',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'has_cov',
            label: 'Yes, possess Certificate of Vending or Vending ID Card',
            affectsSpecialConditions: ['street_vendor_id', 'cov_holder']
          },
          {
            value: 'has_lor',
            label: 'Possess Letter of Recommendation (LoR) from ULB / TVC',
            affectsSpecialConditions: ['street_vendor_id', 'lor_holder']
          },
          {
            value: 'no_proof_yet',
            label: 'Currently vending without formal paper proof (Need ULB survey)'
          }
        ]
      },
      {
        id: 'vending_location',
        title: '2. Vending Operational Area',
        titleHindi: '2. फेरी लगाने का क्षेत्र',
        description: 'PM SVANidhi covers vendors in urban, peri-urban, and surrounding rural markets.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'urban_market',
            label: 'Urban Municipal Corporation / Nagar Palika market',
            affectsSpecialConditions: ['urban_vendor']
          },
          {
            value: 'peri_urban',
            label: 'Semi-Urban / Peri-Urban Weekly Haat / Market',
            affectsSpecialConditions: ['peri_urban_vendor']
          }
        ]
      },
      {
        id: 'loan_tranche_requirement',
        title: '3. PM-SVANidhi Loan Tranche Needed',
        titleHindi: '3. आवश्यक ऋण किश्त',
        description: 'Initial ₹10,000 tranche, increasing to ₹20,000 and ₹50,000 on timely repayment.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'tranche_1',
            label: 'First Tranche: ₹10,000 (1 Year tenure, collateral free)',
            affectsSpecialConditions: ['tranche_1_applicant']
          },
          {
            value: 'tranche_2',
            label: 'Second Tranche: ₹20,000 (Repaid 1st tranche successfully)',
            affectsSpecialConditions: ['tranche_2_applicant']
          },
          {
            value: 'tranche_3',
            label: 'Third Tranche: ₹50,000 (Repaid 2nd tranche successfully)',
            affectsSpecialConditions: ['tranche_3_applicant']
          }
        ]
      },
      {
        id: 'digital_transactions',
        title: '4. UPI / QR Code Digital Payment Usage',
        titleHindi: '4. डिजिटल लेनदेन (PhonePe, GPay, Paytm, BHIM)',
        description: 'Earn up to ₹1,200 annual cashback rewards on digital customer receipts.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'active_upi',
            label: 'Yes, actively accepting payments via QR Code / UPI',
            affectsSpecialConditions: ['digital_vendor']
          },
          {
            value: 'cash_only',
            label: 'Mostly cash transactions (Wish to set up free QR code)'
          }
        ]
      },
      {
        id: 'bank_account_aadhaar',
        title: '5. Bank Account Linked with Aadhaar',
        titleHindi: '5. आधार लिंक्ड बैंक खाता',
        description: 'Required for direct DBT disbursement of loan and interest subsidy.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'linked',
            label: 'Yes, active Aadhaar-seeded bank savings account',
            affectsSpecialConditions: ['bank_aadhaar_linked']
          },
          {
            value: 'unlinked',
            label: 'Account exists but not yet linked'
          }
        ]
      }
    ]
  },

  senior_citizen: {
    occupation: 'senior_citizen',
    title: 'Senior Citizen Welfare & Pension Questionnaire',
    titleHindi: 'वरिष्ठ नागरिक कल्याण एवं पेंशन प्रश्नावली',
    badge: 'Social Security & Healthcare',
    icon: 'HeartHandshake',
    description:
      'Answer these 4 questions to evaluate eligibility for Indira Gandhi National Old Age Pension (IGNOAPS), AB-PMJAY Universal Senior Healthcare (₹5 Lakh cover), and Rashtriya Vayoshri Yojana.',
    relevantSchemes: ['ignoaps', 'ab-pmjay-senior', 'rvy'],
    questions: [
      {
        id: 'senior_age_bracket',
        title: '1. Exact Completed Age',
        titleHindi: '1. पूर्ण आयु (वर्षों में)',
        description: 'Age 60+ unlocks old age pension. Age 70+ unlocks universal AB-PMJAY without income limit.',
        type: 'radio',
        required: true,
        options: [
          {
            value: '70_plus',
            label: '70 Years or older (Universal ₹5 Lakh AB-PMJAY cover with zero income cap)',
            affectsSpecialConditions: ['age_70_plus', 'senior_citizen']
          },
          {
            value: '80_plus',
            label: '80 Years or older (Enhanced ₹500/month IGNOAPS pension rate)',
            affectsSpecialConditions: ['age_80_plus', 'senior_citizen']
          },
          {
            value: '60_to_69',
            label: '60 to 69 Years (₹200/month IGNOAPS pension rate)',
            affectsSpecialConditions: ['senior_citizen']
          }
        ]
      },
      {
        id: 'bpl_status',
        title: '2. Below Poverty Line (BPL) / Antyodaya Card',
        titleHindi: '2. गरीबी रेखा (BPL/अंत्योदय राशन कार्ड)',
        description: 'Mandatory for central old age pension (IGNOAPS).',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'has_bpl',
            label: 'Yes, family holds verified BPL / Antyodaya (AAY) Ration Card',
            affectsSpecialConditions: ['bpl_card', 'bpl_senior']
          },
          {
            value: 'no_bpl',
            label: 'Non-BPL household (Above poverty line)'
          }
        ]
      },
      {
        id: 'existing_pension',
        title: '3. Existing Employee / Government Pension',
        titleHindi: '3. क्या कोई अन्य नियमित पेंशन प्राप्त होती है?',
        description: 'Citizens already drawing government service pensions are excluded from IGNOAPS destitute pension.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'no_pension',
            label: 'No other pension (Zero regular retirement income)',
            affectsSpecialConditions: ['no_existing_pension']
          },
          {
            value: 'has_govt_pension',
            label: 'Yes, drawing government / defense pension'
          }
        ]
      },
      {
        id: 'assisted_device_need',
        title: '4. Physical Mobility & Assisted Living Aids',
        titleHindi: '4. सहायक उपकरण (चश्मा, व्हीलचेयर, श्रवण यंत्र, छड़ी)',
        description: 'Rashtriya Vayoshri Yojana provides free walking sticks, spectacles, wheelchairs, and hearing aids.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'need_aids',
            label: 'Yes, need physical aids / assisted devices for age-related disabilities',
            affectsSpecialConditions: ['need_assisted_devices']
          },
          {
            value: 'none_needed',
            label: 'No assisted devices needed currently'
          }
        ]
      }
    ]
  },

  unorganized_worker: {
    occupation: 'unorganized_worker',
    title: 'Construction & Unorganized Worker Questionnaire',
    titleHindi: 'निर्माण एवं असंगठित कर्मकार प्रश्नावली',
    badge: 'Labour & Employment Welfare',
    icon: 'HardHat',
    description:
      'Answer these questions to unlock State BOCW Board housing/tool benefits, e-Shram social security, PM Shram Yogi Maandhan pension, and Ayushman Bharat health card.',
    relevantSchemes: ['pm-sym', 'ab-pmjay', 'e-shram'],
    questions: [
      {
        id: 'bocw_registration',
        title: '1. State BOCW Welfare Board Registration',
        titleHindi: '1. राज्य भवन एवं अन्य सन्निर्माण कर्मकार कल्याण बोर्ड पंजीकरण',
        description: 'Registered construction workers receive marriage grants, tool assistance, and accident relief.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'bocw_registered',
            label: 'Yes, registered with State BOCW Board (Possess Labour Card)',
            affectsSpecialConditions: ['bocw_registered', 'construction_worker']
          },
          {
            value: 'not_registered',
            label: 'Not registered yet with State Labour Board'
          }
        ]
      },
      {
        id: 'eshram_uan',
        title: '2. 12-Digit e-Shram Universal Account Number (UAN)',
        titleHindi: '2. ई-श्रम कार्ड (12 अंकों का UAN नंबर)',
        description: 'National database of unorganized workers with accident cover.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'has_eshram',
            label: 'Yes, registered on e-Shram and possess UAN card',
            affectsSpecialConditions: ['eshram_registered', 'unorganized_worker']
          },
          {
            value: 'no_eshram',
            label: 'Not registered on e-Shram'
          }
        ]
      },
      {
        id: 'epfo_esic_status',
        title: '3. EPFO / ESIC / Income Tax Status',
        titleHindi: '3. क्या आप ईपीएफओ/ईएसआईसी सदस्य अथवा आयकरदाता हैं?',
        description: 'Unorganized worker schemes require applicant NOT to be an active EPFO/ESIC/tax-paying member.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'neither',
            label: 'Neither member of EPFO/ESIC nor an Income Tax payer',
            affectsSpecialConditions: ['not_epfo_member']
          },
          {
            value: 'epfo_member',
            label: 'Enrolled under EPFO or ESIC / Income Tax payer'
          }
        ]
      },
      {
        id: 'pension_savings_interest',
        title: '4. PM Shram Yogi Maan-dhan (PM-SYM) Pension',
        titleHindi: '4. प्रधानमंत्री श्रम योगी मानधन पेंशन (₹3,000/माह 60 वर्ष बाद)',
        description: 'Guaranteed pension of ₹3,000/month after age 60 with 50% central matching contribution.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'interested',
            label: 'Yes, wish to enroll in PM-SYM voluntary pension scheme',
            affectsSpecialConditions: ['sym_interested']
          },
          {
            value: 'already_enrolled',
            label: 'Already enrolled and paying monthly contribution',
            affectsSpecialConditions: ['sym_enrolled']
          }
        ]
      }
    ]
  },

  entrepreneur: {
    occupation: 'entrepreneur',
    title: 'Artisan, Craftsman & MSME Entrepreneur Questionnaire',
    titleHindi: 'शिल्पकार, कारीगर एवं उद्यमी प्रश्नावली',
    badge: 'MSME & Skill Enterprises',
    icon: 'Hammer',
    description:
      'Answer these questions to qualify for PM Vishwakarma (₹15,000 tool kit + 5% collateral-free credit) and PMEGP subsidy loans up to ₹50 Lakhs.',
    relevantSchemes: ['pm-vishwakarma', 'pm-mudra', 'pmegp'],
    questions: [
      {
        id: 'traditional_trade',
        title: '1. Engagement in 18 Traditional Family Trades',
        titleHindi: '1. 18 पारंपरिक शिल्पों में संलग्नता',
        description: 'Covers Carpenters, Blacksmiths, Goldsmiths, Potters, Sculptors, Cobblers, Tailors, Weavers, etc.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'yes_vishwakarma',
            label: 'Yes, practicing one of the 18 recognized traditional artisanal trades',
            affectsSpecialConditions: ['vishwakarma_trade', 'artisan']
          },
          {
            value: 'modern_msme',
            label: 'No, running a modern retail, service, or manufacturing MSME',
            affectsSpecialConditions: ['msme_business']
          }
        ]
      },
      {
        id: 'credit_requirement',
        title: '2. Collateral-Free Enterprise Credit Requirement',
        titleHindi: '2. व्यवसाय विस्तार हेतु आवश्यक ऋण',
        description: 'PM Vishwakarma provides ₹1 Lakh (1st tranche) & ₹2 Lakhs (2nd tranche) at 5% interest rate.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'tranche_1_vishwakarma',
            label: 'First Tranche: ₹1,00,000 (18 Months tenure at 5% interest)',
            affectsSpecialConditions: ['need_enterprise_credit']
          },
          {
            value: 'mudra_shishu',
            label: 'MUDRA Shishu Loan up to ₹50,000',
            affectsSpecialConditions: ['mudra_applicant']
          },
          {
            value: 'mudra_kishore',
            label: 'MUDRA Kishore / Tarun Loan (₹50,000 to ₹10 Lakhs)',
            affectsSpecialConditions: ['mudra_applicant']
          }
        ]
      },
      {
        id: 'toolkit_incentive',
        title: '3. Skill Upgradation & Modern Toolkit Grant',
        titleHindi: '3. आधुनिक टूलकिट प्रोत्साहन (₹15,000 अनुदान)',
        description: 'Includes 5-7 days basic skill training with ₹500/day stipend + ₹15,000 e-voucher for tools.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'need_toolkit',
            label: 'Yes, need official skill certification and ₹15,000 modern toolkit grant',
            affectsSpecialConditions: ['need_toolkit_grant']
          },
          {
            value: 'have_tools',
            label: 'Already have modern professional tools'
          }
        ]
      }
    ]
  },

  unemployed: {
    occupation: 'unemployed',
    title: 'Job Seeker & Skill Training Questionnaire',
    titleHindi: 'रोजगार इच्छुक एवं कौशल विकास प्रश्नावली',
    badge: 'Youth Employment & Apprenticeship',
    icon: 'Briefcase',
    description:
      'Answer these questions to connect with PMKVY 4.0 free skill training courses, monthly apprenticeship stipends, and National Career Service listings.',
    relevantSchemes: ['pmkvy', 'naps', 'pm-mudra'],
    questions: [
      {
        id: 'ncs_registration',
        title: '1. National Career Service (NCS) Portal Registration',
        titleHindi: '1. नेशनल करियर सर्विस (NCS) पोर्टल पंजीकरण',
        description: 'Connecting jobseekers with government and private job vacancies across India.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'ncs_registered',
            label: 'Yes, registered on National Career Service (ncs.gov.in)',
            affectsSpecialConditions: ['ncs_registered']
          },
          {
            value: 'not_registered',
            label: 'Not yet registered (Want free registration)'
          }
        ]
      },
      {
        id: 'skill_preference',
        title: '2. PMKVY Free Skill Development Course Interest',
        titleHindi: '2. पीएमकेवीवाई कौशल विकास पाठ्यक्रम रुचि',
        description: 'Free NSQF-aligned skill training with government certification and placement assistance.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'digital_tech',
            label: 'IT / Digital Skills / Coding / Data Entry / Solar Tech',
            affectsSpecialConditions: ['skill_applicant']
          },
          {
            value: 'manufacturing_trades',
            label: 'Manufacturing / Automotive / Electrical / Plumbing / Healthcare',
            affectsSpecialConditions: ['skill_applicant']
          }
        ]
      }
    ]
  },

  // Fallbacks for other occupations mapping to unorganized worker / general
  fisherman: {
    occupation: 'fisherman',
    title: 'Fisheries & Marine Cultivator Questionnaire',
    titleHindi: 'मत्स्य पालक एवं मछुआरा प्रश्नावली',
    badge: 'Pradhan Mantri Matsya Sampada Yojana',
    icon: 'Waves',
    description: 'Specialized aquaculture, boat subsidy, and KCC credit for fishermen.',
    relevantSchemes: ['pmmsy', 'kcc'],
    questions: [
      {
        id: 'fishery_type',
        title: '1. Fisheries Operation Type',
        titleHindi: '1. मत्स्य पालन का प्रकार',
        description: 'Marine fishing vs Inland freshwater aquaculture.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'inland_pond',
            label: 'Inland Aquaculture / Fish Pond Culture',
            affectsSpecialConditions: ['has_fishery_pond']
          },
          {
            value: 'marine_coastal',
            label: 'Marine Coastal Fishing',
            affectsSpecialConditions: ['marine_fisherman']
          }
        ]
      }
    ]
  },

  teacher: {
    occupation: 'teacher',
    title: 'Education Sector Welfare Questionnaire',
    titleHindi: 'शिक्षा क्षेत्र पात्रता प्रश्नावली',
    badge: 'Education & Professional Development',
    icon: 'BookOpen',
    description: 'National awards, research grants, and training programs.',
    relevantSchemes: ['ab-pmjay'],
    questions: [
      {
        id: 'employment_nature',
        title: '1. Employment Institution Type',
        titleHindi: '1. संस्थान का प्रकार',
        description: 'Government, aided, or private school.',
        type: 'radio',
        required: true,
        options: [
          { value: 'govt_school', label: 'Government School Teacher' },
          { value: 'aided_school', label: 'Government Aided School' },
          { value: 'private_school', label: 'Private School / Guest Teacher' }
        ]
      }
    ]
  },

  government_employee: {
    occupation: 'government_employee',
    title: 'Public Service Welfare Questionnaire',
    titleHindi: 'सरकारी कर्मचारी प्रश्नावली',
    badge: 'Public Administration',
    icon: 'Building2',
    description: 'Central/State government employee welfare benefits.',
    relevantSchemes: ['nps'],
    questions: [
      {
        id: 'pension_system',
        title: '1. Applicable Pension System',
        titleHindi: '1. पेंशन योजना',
        description: 'NPS vs OPS applicability.',
        type: 'radio',
        required: true,
        options: [
          { value: 'nps', label: 'National Pension System (NPS)' },
          { value: 'ups', label: 'Unified Pension Scheme (UPS)' }
        ]
      }
    ]
  },

  defence_personnel: {
    occupation: 'defence_personnel',
    title: 'Armed Forces & Ex-Servicemen Questionnaire',
    titleHindi: 'सशस्त्र बल एवं पूर्व सैनिक प्रश्नावली',
    badge: 'Defense Welfare',
    icon: 'Shield',
    description: 'Ex-servicemen scholarships, resettlement loans, and healthcare.',
    relevantSchemes: ['echs', 'pm-scholarship-defense'],
    questions: [
      {
        id: 'service_status',
        title: '1. Service Status',
        titleHindi: '1. सेवा स्थिति',
        description: 'Serving personnel vs Ex-Servicemen (ESM).',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'esm',
            label: 'Ex-Servicemen (ESM) / Veteran',
            affectsSpecialConditions: ['ex_serviceman']
          },
          {
            value: 'serving',
            label: 'Serving Armed Forces / Paramilitary'
          }
        ]
      }
    ]
  },

  person_with_disability: {
    occupation: 'person_with_disability',
    title: 'Divyangjan Accessibility & Welfare Questionnaire',
    titleHindi: 'दिव्यांगजन सुलभता एवं कल्याण प्रश्नावली',
    badge: 'Disability Welfare & Assistive Tech',
    icon: 'Accessibility',
    description:
      'Universal Unique Disability ID (UDID) benefits, ADIP assisted aids, and Indira Gandhi National Disability Pension.',
    relevantSchemes: ['adip', 'igndps', 'ab-pmjay'],
    questions: [
      {
        id: 'udid_card',
        title: '1. Unique Disability Identity Card (UDID)',
        titleHindi: '1. स्वावलंबन यूडीआईडी कार्ड',
        description: 'Recognized by Department of Empowerment of Persons with Disabilities.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'has_udid_40',
            label: 'Yes, hold UDID card with 40% or higher disability',
            affectsSpecialConditions: ['disability_40_plus', 'udid_card']
          },
          {
            value: 'in_process',
            label: 'Medical certificate issued, UDID card in process',
            affectsSpecialConditions: ['disability_40_plus']
          }
        ]
      }
    ]
  },

  other: {
    occupation: 'other',
    title: 'Universal Citizen Welfare Questionnaire',
    titleHindi: 'सामान्य नागरिक कल्याण प्रश्नावली',
    badge: 'Universal Citizen Services',
    icon: 'UserCheck',
    description:
      'Answer these questions to evaluate eligibility across universal healthcare (Ayushman Bharat), food security (NFSA), and unorganized worker social security.',
    relevantSchemes: ['ab-pmjay', 'pm-sym', 'e-shram'],
    questions: [
      {
        id: 'ration_card_type',
        title: '1. Ration Card Category',
        titleHindi: '1. राशन कार्ड का प्रकार',
        description: 'Pradhan Mantri Garib Kalyan Anna Yojana (Free ration) and SECC entitlement.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'bpl_aay',
            label: 'Antyodaya Anna Yojana (AAY) / BPL Card',
            affectsSpecialConditions: ['bpl_card']
          },
          {
            value: 'phh',
            label: 'Priority Household (PHH) Ration Card',
            affectsSpecialConditions: ['phh_card']
          },
          {
            value: 'apl',
            label: 'General / APL Card / No card'
          }
        ]
      },
      {
        id: 'unorganized_sector',
        title: '2. Are you engaged in unorganized or informal work?',
        titleHindi: '2. क्या आप असंगठित अथवा अनौपचारिक क्षेत्र में कार्यरत हैं?',
        description: 'Covers drivers, domestic help, daily wage earners, tailors, delivery agents, etc.',
        type: 'radio',
        required: true,
        options: [
          {
            value: 'yes_unorganized',
            label: 'Yes, daily wage / self-employed / informal worker',
            affectsSpecialConditions: ['unorganized_worker']
          },
          {
            value: 'organized',
            label: 'No, organized private employee with PF/ESIC'
          }
        ]
      }
    ]
  }
};

/**
 * Get question set for a given occupation (with safe fallback to 'other')
 */
export function getOccupationQuestionSet(occupation?: string): OccupationQuestionSet {
  if (!occupation) return OCCUPATION_QUESTION_SETS.farmer;
  const key = occupation as OccupationType;
  return OCCUPATION_QUESTION_SETS[key] || OCCUPATION_QUESTION_SETS.other;
}
