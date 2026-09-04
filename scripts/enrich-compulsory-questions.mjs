import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/compulsory-questions.ts');

const code = `export interface CompulsoryQuestion {
  id: string;
  question: string;
  hindiQuestion: string;
  marathiQuestion?: string;
  bengaliQuestion?: string;
  tamilQuestion?: string;
  teluguQuestion?: string;
  explanation: string;
  hindiExplanation: string;
  marathiExplanation?: string;
  bengaliExplanation?: string;
  tamilExplanation?: string;
  teluguExplanation?: string;
  expectedAnswer: boolean; // true = Yes, false = No
  fieldMapped?: string;
}

export function getLocalizedQuestion(
  q: CompulsoryQuestion,
  lang: string
): { question: string; explanation: string } {
  if (lang === 'hi') {
    return {
      question: q.hindiQuestion || q.question,
      explanation: q.hindiExplanation || q.explanation
    };
  }
  if (lang === 'mr') {
    return {
      question: q.marathiQuestion || q.hindiQuestion || q.question,
      explanation: q.marathiExplanation || q.hindiExplanation || q.explanation
    };
  }
  if (lang === 'bn') {
    return {
      question: q.bengaliQuestion || q.hindiQuestion || q.question,
      explanation: q.bengaliExplanation || q.hindiExplanation || q.explanation
    };
  }
  if (lang === 'ta') {
    return {
      question: q.tamilQuestion || q.hindiQuestion || q.question,
      explanation: q.tamilExplanation || q.hindiExplanation || q.explanation
    };
  }
  if (lang === 'te') {
    return {
      question: q.teluguQuestion || q.hindiQuestion || q.question,
      explanation: q.teluguExplanation || q.hindiExplanation || q.explanation
    };
  }
  return {
    question: q.question,
    explanation: q.explanation
  };
}

export const SCHEME_COMPULSORY_QUESTIONS: Record<string, CompulsoryQuestion[]> = {
  'pm-kisan': [
    {
      id: 'pmk-land',
      question: 'Do you or your family own cultivable agricultural land registered in revenue records?',
      hindiQuestion: 'क्या आपके या आपके परिवार के नाम राजस्व रिकॉर्ड में कृषि भूमि (खेती की जमीन) दर्ज है?',
      marathiQuestion: 'तुमच्या किंवा तुमच्या कुटुंबाच्या नावावर महसूल नोंदींमध्ये शेतजमीन नोंदणीकृत आहे का?',
      bengaliQuestion: 'আপনার বা আপনার পরিবারের নামে সরকারি রেকর্ডে চাষযোগ্য কৃষি জমি নথিভুক্ত আছে কি?',
      tamilQuestion: 'உங்கள் குடும்பத்தின் பெயரில் வருவாய் பதிவேடுகளில் பதிவு செய்யப்பட்ட விவசாய நிலம் உள்ளதா?',
      teluguQuestion: 'మీ లేదా మీ కుటుంబ సభ్యుల పేరుతో రెవెన్యూ రికార్డుల్లో నమోదైన సాగు భూమి ఉందా?',
      explanation: 'PM-KISAN is exclusively for landholding farmer families.',
      hindiExplanation: 'पीएम किसान केवल भूमिधारक किसान परिवारों के लिए है।',
      marathiExplanation: 'पीएम-किसान योजना केवळ शेतजमीन धारक शेतकरी कुटुंबांसाठी आहे.',
      bengaliExplanation: 'পিএম-কিষাণ কেবল কৃষিজমি থাকা কৃষক পরিবারের জন্য প্রযোজ্য।',
      tamilExplanation: 'பிரதமர் கிசான் திட்டம் விவசாய நிலம் வைத்திருக்கும் குடும்பங்களுக்கு மட்டுமே.',
      teluguExplanation: 'పీఎం కిసాన్ పథకం భూమి కలిగిన రైతు కుటుంబాలకు మాత్రమే వర్తిస్తుంది.',
      expectedAnswer: true,
      fieldMapped: 'has_land'
    },
    {
      id: 'pmk-acres',
      question: 'Is your family’s total cultivable landholding 5 acres (2 hectares) or less?',
      hindiQuestion: 'क्या आपके परिवार की कुल कृषि भूमि 5 एकड़ (2 हेक्टेयर) या उससे कम है?',
      marathiQuestion: 'तुमच्या कुटुंबाची एकूण शेतजमीन ५ एकर (२ हेक्टर) किंवा त्यापेक्षा कमी आहे का?',
      bengaliQuestion: 'আপনার পরিবারের মোট কৃষি জমির পরিমাণ ৫ একর (২ হেক্টর) বা তার কম কি?',
      tamilQuestion: 'உங்கள் குடும்பத்தின் மொத்த விவசாய நிலம் 5 ஏக்கர் (2 ஹெக்டேர்) அல்லது அதற்கும் குறைவாக உள்ளதா?',
      teluguQuestion: 'మీ కుటుంబ మొత్తం సాగు భూమి 5 ఎకరాలు (2 హెక్టార్లు) లేదా అంతకంటే తక్కువగా ఉందా?',
      explanation: 'Small and marginal farmers owning up to 5 acres are prioritized.',
      hindiExplanation: '5 एकड़ तक की भूमि वाले छोटे और सीमांत किसान इसके पात्र हैं।',
      marathiExplanation: '५ एकरांपर्यंत जमीन असणारे अल्प व अत्यल्प भूधारक शेतकरी पात्र आहेत.',
      bengaliExplanation: '৫ একর পর্যন্ত জমির মালিক ক্ষুদ্র ও প্রান্তিক কৃষকদের অগ্রাধিকার দেওয়া হয়।',
      tamilExplanation: '5 ஏக்கர் வரை நிலம் வைத்துள்ள சிறு மற்றும் குறு விவசாயிகள் தகுதியுடையவர்கள்.',
      teluguExplanation: '5 ఎకరాల వరకు భూమి ఉన్న చిన్న, సన్నకారు రైతులకు ప్రాధాన్యత ఇవ్వబడుతుంది.',
      expectedAnswer: true,
      fieldMapped: 'land_holding_acres'
    },
    {
      id: 'pmk-taxpayer',
      question: 'Did any member of your household pay Income Tax in the last assessment year?',
      hindiQuestion: 'क्या आपके परिवार के किसी सदस्य ने पिछले वर्ष आयकर (Income Tax) का भुगतान किया था?',
      marathiQuestion: 'मागील मूल्यांकन वर्षात तुमच्या कुटुंबातील कोणत्याही सदस्याने आयकर (Income Tax) भरला आहे का?',
      bengaliQuestion: 'গত আর্থিক বছরে আপনার পরিবারের কোনো সদস্য কি আয়কর (Income Tax) প্রদান করেছেন?',
      tamilQuestion: 'கடந்த மதிப்பீட்டு ஆண்டில் உங்கள் குடும்பத்தில் யாரேனும் வருமான வரி செலுத்தியுள்ளார்களா?',
      teluguQuestion: 'గత అసెస్‌మెంట్ సంవత్సరంలో మీ కుటుంబంలో ఎవరైనా ఆదాయపు పన్ను చెల్లించారా?',
      explanation: 'Income taxpayers and institutional landowners are strictly excluded by Central Government rules.',
      hindiExplanation: 'आयकर देने वाले और संस्थागत भूमिधारक सरकारी नियमों के अनुसार इसके पात्र नहीं हैं।',
      marathiExplanation: 'आयकर भरणारे आणि संस्थागत जमीनधारक सरकारी नियमांनुसार अपात्र आहेत.',
      bengaliExplanation: 'আয়কর প্রদানকারী ব্যক্তিরা সরকারি নিয়ম অনুযায়ী এই প্রকল্পের সুবিধা পাবেন না।',
      tamilExplanation: 'வருமான வரி செலுத்துவோர் மத்திய அரசு விதிகளின்படி இத்திட்டத்திற்கு தகுதியற்றவர்கள்.',
      teluguExplanation: 'ఆదాయపు పన్ను చెల్లించేవారు కేంద్ర ప్రభుత్వ నిబంధనల ప్రకారం అనర్హులు.',
      expectedAnswer: false
    },
    {
      id: 'pmk-bank',
      question: 'Do you have an active bank account seeded with your Aadhaar number for DBT?',
      hindiQuestion: 'क्या आपके पास आधार से लिंक सक्रिय बैंक खाता है?',
      marathiQuestion: 'तुमच्याकडे थेट लाभ हस्तांतरणासाठी (DBT) आधार लिंक केलेले बँक खाते आहे का?',
      bengaliQuestion: 'ডিবিটি (DBT)-এর জন্য আপনার কি আধার সংযুক্ত সক্রিয় ব্যাঙ্ক অ্যাকাউন্ট আছে?',
      tamilQuestion: 'நேரடி பணப்பரிமாற்றத்திற்கு (DBT) ஆதாருடன் இணைக்கப்பட்ட வங்கி கணக்கு உள்ளதா?',
      teluguQuestion: 'డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (DBT) కోసం ఆధార్‌తో అనుసంధానించబడిన బ్యాంక్ ఖాతా ఉందా?',
      explanation: 'All ₹6,000 annual installments are paid directly through Aadhaar Direct Benefit Transfer (DBT).',
      hindiExplanation: 'सभी ₹6,000 की किस्तें सीधे आधार लिंक बैंक खाते में भेजी जाती हैं।',
      marathiExplanation: 'सर्व ₹6,000 चे हप्ते थेट आधार लिंक बँक खात्यात पाठवले जातात.',
      bengaliExplanation: 'বার্ষিক ₹৬,০০০ অনুদান সরাসরি আধার যুক্ত ব্যাঙ্ক অ্যাকাউন্টে জমা হয়।',
      tamilExplanation: 'ஆண்டுக்கு ₹6,000 தவணைகள் நேரடியாக ஆதாருடன் இணைக்கப்பட்ட வங்கி கணக்கில் செலுத்தப்படும்.',
      teluguExplanation: 'ఏడాదికి ₹6,000 వాయిదాలు నేరుగా ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతాలో జమ చేయబడతాయి.',
      expectedAnswer: true,
      fieldMapped: 'savings_bank_account'
    }
  ],

  'pm-svanidhi': [
    {
      id: 'sv-vendor',
      question: 'Do you carry out street vending, cart hawking, or roadside selling in an urban area?',
      hindiQuestion: 'क्या आप शहरी क्षेत्र में रेहड़ी, पटरी, ठेला या सड़क किनारे फेरी लगाकर सामान बेचते हैं?',
      marathiQuestion: 'तुम्ही शहरी भागात हातगाडी, फेरीवाले किंवा रस्त्याच्या कडेला व्यवसाय करता का?',
      bengaliQuestion: 'আপনি কি শহরাঞ্চলে স্ট্রিট ভেন্ডার, হকার বা রাস্তার পাশে ব্যবসা করেন?',
      tamilQuestion: 'நீங்கள் நகர்ப்புறத்தில் சாலையோர வியாபாரம் அல்லது தள்ளுவண்டி வியாபாரம் செய்கிறீர்களா?',
      teluguQuestion: 'మీరు పట్టణ ప్రాంతాల్లో వీధి వ్యాపారం లేదా తోపుడు బండిపై వ్యాపారం చేస్తున్నారా?',
      explanation: 'Scheme is designed specifically to empower urban street vendors.',
      hindiExplanation: 'यह योजना शहरी स्ट्रीट वेंडर्स और फेरीवालों के लिए बनाई गई है।',
      marathiExplanation: 'ही योजना प्रामुख्याने शहरी पथविक्रेत्यांसाठी आहे.',
      bengaliExplanation: 'এই প্রকল্পটি শহুরে পথব্যবসায়ী ও হকারদের জন্য প্রস্তুত করা হয়েছে।',
      tamilExplanation: 'இத்திட்டம் நகர்ப்புற சாலையோர வியாபாரிகளுக்காகவே உருவாக்கப்பட்டது.',
      teluguExplanation: 'ఈ పథకం పట్టణ వీధి వ్యాపారుల సాధికారత కోసం రూపొందించబడింది.',
      expectedAnswer: true,
      fieldMapped: 'street_vendor'
    },
    {
      id: 'sv-id',
      question: 'Do you possess a Certificate of Vending / ID card issued by your Municipality (ULB) OR a Letter of Recommendation?',
      hindiQuestion: 'क्या आपके पास नगर निगम/नगर पालिका द्वारा जारी वेंडिंग प्रमाणपत्र (ID कार्ड) या सिफारिश पत्र है?',
      marathiQuestion: 'तुमच्याकडे महानगरपालिका/नगरपरिषदेने दिलेले वेंडिंग ओळखपत्र किंवा शिफारस पत्र आहे का?',
      bengaliQuestion: 'আপনার কাছে কি পৌরসভা প্রদত্ত ভেন্ডিং আইডি কার্ড বা সুপারিশপত্র আছে?',
      tamilQuestion: 'நகராட்சியால் வழங்கப்பட்ட சாலையோர வியாபார அடையாள அட்டை அல்லது பரிந்துரை கடிதம் உள்ளதா?',
      teluguQuestion: 'మీ వద్ద మున్సిపాలిటీ జారీ చేసిన వెండింగ్ గుర్తింపు కార్డు లేదా సిఫార్సు లేఖ ఉందా?',
      explanation: 'A Vending ID or Letter of Recommendation from local municipality is mandatory for the loan.',
      hindiExplanation: 'ऋण प्राप्त करने के लिए नगर पालिका से वेंडिंग पहचान पत्र या सिफारिश पत्र अनिवार्य है।',
      marathiExplanation: 'कर्ज मिळवण्यासाठी स्थानिक स्वराज्य संस्थेकडील ओळखपत्र किंवा शिफारस पत्र अनिवार्य आहे.',
      bengaliExplanation: 'ঋণ পাওয়ার জন্য পৌরসভার ভেন্ডিং আইডি বা সুপারিশপত্র বাধ্যতামূলক।',
      tamilExplanation: 'கடன் பெற நகராட்சியின் அடையாள அட்டை அல்லது பரிந்துரை கடிதம் கட்டாயம்.',
      teluguExplanation: 'రుణం పొందడానికి మున్సిపాలిటీ గుర్తింపు కార్డు లేదా సిఫార్సు లేఖ తప్పనిసరి.',
      expectedAnswer: true,
      fieldMapped: 'vendor_id_or_recommendation'
    },
    {
      id: 'sv-bank',
      question: 'Do you have a savings bank account with an active mobile number for digital UPI cashback?',
      hindiQuestion: 'क्या आपके पास डिजिटल लेनदेन व ऋण राशि प्राप्त करने के लिए बैंक खाता है?',
      marathiQuestion: 'तुमच्याकडे डिजिटल व्यवहारांसाठी आणि कर्ज मिळवण्यासाठी बँक खाते आहे का?',
      bengaliQuestion: 'ডিজিটাল লেনদেন ও ঋণের অর্থ পাওয়ার জন্য আপনার কি ব্যাঙ্ক অ্যাকাউন্ট আছে?',
      tamilQuestion: 'டிஜிட்டல் பரிவர்த்தனைகள் மற்றும் கடன் தொகை பெற உங்களிடம் வங்கி கணக்கு உள்ளதா?',
      teluguQuestion: 'డిజిటల్ లావాదేవీలు మరియు రుణ మొత్తం కోసం మీ వద్ద బ్యాంక్ ఖాతా ఉందా?',
      explanation: 'Loans and 7% interest subsidy are credited directly to bank accounts.',
      hindiExplanation: 'ऋण और 7% ब्याज सब्सिडी सीधे आपके बैंक खाते में भेजी जाती है।',
      marathiExplanation: 'कर्ज आणि ७% व्याज अनुदान थेट बँक खात्यात जमा केले जाते.',
      bengaliExplanation: 'ঋণ এবং ৭% সুদ ভর্তুকি সরাসরি ব্যাঙ্ক অ্যাকাউন্টে প্রদান করা হয়।',
      tamilExplanation: 'கடன் மற்றும் 7% வட்டி மானியம் நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
      teluguExplanation: 'రుణం మరియు 7% వడ్డీ రాయితీ నేరుగా మీ బ్యాంక్ ఖాతాలో జమ చేయబడుతుంది.',
      expectedAnswer: true,
      fieldMapped: 'savings_bank_account'
    }
  ],

  'post-matric-scholarship': [
    {
      id: 'pms-student',
      question: 'Are you currently enrolled in a recognized college, diploma, or post-matriculation course?',
      hindiQuestion: 'क्या आप वर्तमान में 10वीं या 12वीं के बाद किसी मान्यता प्राप्त कॉलेज या डिप्लोमा कोर्स में नामांकित हैं?',
      marathiQuestion: 'तुम्ही सध्या १० वी नंतरच्या मान्यताप्राप्त महाविद्यालय किंवा पदविका अभ्यासक्रमात शिकत आहात का?',
      bengaliQuestion: 'আপনি কি বর্তমানে কোনো স্বীকৃত কলেজ, ডিপ্লোমা বা উচ্চমাধ্যমিকোত্তর কোর্সে পাঠরত?',
      tamilQuestion: 'நீங்கள் தற்போது அங்கீகரிக்கப்பட்ட கல்லூரி அல்லது பட்டயப் படிப்பில் படிக்கிறீர்களா?',
      teluguQuestion: 'మీరు ప్రస్తుతం గుర్తింపు పొందిన కళాశాల లేదా డిప్లొమా కోర్సులో చదువుతున్నారా?',
      explanation: 'Must be actively studying in post-matric courses.',
      hindiExplanation: '10वीं के बाद उच्च शिक्षा में नामांकित होना अनिवार्य है।',
      marathiExplanation: '१०वीनंतर उच्च शिक्षण घेत असणे आवश्यक आहे.',
      bengaliExplanation: 'মাধ্যমিক পরবর্তী উচ্চশিক্ষায় নথিভুক্ত হওয়া বাধ্যতামূলক।',
      tamilExplanation: 'பத்தாம் வகுப்பிற்குப் பிந்தைய படிப்பில் சேர்ந்திருப்பது கட்டாயம்.',
      teluguExplanation: 'పదవ తరగతి తర్వాతి ఉన్నత విద్యలో నమోదు కావడం తప్పనిసరి.',
      expectedAnswer: true,
      fieldMapped: 'student_enrolled'
    },
    {
      id: 'pms-income',
      question: 'Is your family total annual income from all sources under ₹2,50,000 per year?',
      hindiQuestion: 'क्या आपके परिवार की सभी स्रोतों से वार्षिक आय ₹2,50,000 से कम है?',
      marathiQuestion: 'तुमच्या कुटुंबाचे सर्व मार्गांनी मिळणारे वार्षिक उत्पन्न ₹२,५०,००० पेक्षा कमी आहे का?',
      bengaliQuestion: 'আপনার পরিবারের মোট বার্ষিক আয় কি ₹২,৫০,০০০-এর কম?',
      tamilQuestion: 'உங்கள் குடும்பத்தின் மொத்த ஆண்டு வருமானம் ₹2,50,000-க்கு குறைவாக உள்ளதா?',
      teluguQuestion: 'మీ కుటుంబ వార్షిక ఆదాయం ₹2,50,000 కంటే తక్కువగా ఉందా?',
      explanation: 'Parental income ceiling of ₹2.5 Lakh applies for full tuition fee reimbursement.',
      hindiExplanation: 'पूरी फीस प्रतिपूर्ति के लिए माता-पिता की आय ₹2.5 लाख से कम होनी चाहिए।',
      marathiExplanation: 'संपूर्ण शिक्षण शुल्क परताव्यासाठी वार्षिक कौटुंबिक उत्पन्न मर्यादा ₹२.५ लाख आहे.',
      bengaliExplanation: 'সম্পূর্ণ টিউশন ফি ফেরতের জন্য পারিবারিক আয়ের সীমা ₹২.৫ লাখ প্রযোজ্য।',
      tamilExplanation: 'முழு கட்டணச் சலுகை பெற குடும்ப வருமானம் ₹2.5 லட்சத்திற்குள் இருக்க வேண்டும்.',
      teluguExplanation: 'పూర్తి ఫీజు రీయింబర్స్‌మెంట్ కోసం కుటుంబ ఆదాయ పరిమితి ₹2.5 లక్షలు వర్తిస్తుంది.',
      expectedAnswer: true,
      fieldMapped: 'annual_income'
    },
    {
      id: 'pms-caste',
      question: 'Do you belong to SC, ST, or OBC category with a verified caste certificate?',
      hindiQuestion: 'क्या आपके पास एससी (SC), एसटी (ST) या ओबीसी (OBC) का वैध जाति प्रमाणपत्र है?',
      marathiQuestion: 'तुमच्याकडे अनुसूचित जाती (SC), जमाती (ST) किंवा इतर मागासवर्गीय (OBC) चे वैध जात प्रमाणपत्र आहे का?',
      bengaliQuestion: 'আপনার কাছে কি SC, ST বা OBC-র বৈধ জাতিগত শংসাপত্র রয়েছে?',
      tamilQuestion: 'உங்களிடம் சரிபார்க்கப்பட்ட SC, ST அல்லது OBC சாதிச் சான்றிதழ் உள்ளதா?',
      teluguQuestion: 'మీ వద్ద ధృవీకరించబడిన SC, ST లేదా OBC కుల ధృవీకరణ పత్రం ఉందా?',
      explanation: 'This scholarship is exclusively meant for students from backward and tribal communities.',
      hindiExplanation: 'यह छात्रवृत्ति अनुसूचित जाति, जनजाति और अन्य पिछड़ा वर्ग के छात्रों के लिए है।',
      marathiExplanation: 'ही शिष्यवृत्ती केवळ आरक्षित प्रवर्गातील गरजू विद्यार्थ्यांसाठी आहे.',
      bengaliExplanation: 'এই বৃত্তিটি অনগ্রসর ও উপজাতি সম্প্রদায়ের শিক্ষার্থীদের জন্য নির্দিষ্ট।',
      tamilExplanation: 'இக்கல்வி உதவித்தொகை குறிப்பிட்ட சமூக மாணவர்களுக்கு மட்டுமே வழங்கப்படுகிறது.',
      teluguExplanation: 'ఈ స్కాలర్‌షిప్ వెనుకబడిన మరియు గిరిజన వర్గాల విద్యార్థులకు మాత్రమే ఉద్దేశించబడింది.',
      expectedAnswer: true,
      fieldMapped: 'caste_certificate'
    }
  ],

  'pm-yasasvi': [
    {
      id: 'yas-class',
      question: 'Are you studying in Class 9, 10, 11, or 12 in an identified Top Class School?',
      hindiQuestion: 'क्या आप कक्षा 9, 10, 11 या 12 में टॉप क्लास स्कूल में पढ़ाई कर रहे हैं?',
      marathiQuestion: 'तुम्ही नामांकित शाळेत इयत्ता ९ वी, १० वी, ११ वी किंवा १२ वी मध्ये शिकत आहात का?',
      bengaliQuestion: 'আপনি কি চিহ্নিত শীর্ষ বিদ্যালয়ে ৯ম, ১০ম, ১১শ বা১২শ শ্রেণীতে পড়ছেন?',
      tamilQuestion: 'அங்கீகரிக்கப்பட்ட சிறந்த பள்ளியில் 9, 10, 11 அல்லது 12 ஆம் வகுப்பில் படிக்கிறீர்களா?',
      teluguQuestion: 'మీరు గుర్తించబడిన పాఠశాలలో 9, 10, 11 లేదా 12వ తరగతి చదువుతున్నారా?',
      explanation: 'Scholarships of ₹75,000 to ₹1,25,000 per year are awarded to secondary school students.',
      hindiExplanation: 'कक्षा 9वीं से 12वीं तक के छात्रों को ₹75,000 से ₹1,25,000 तक की छात्रवृत्ति मिलती है।',
      marathiExplanation: 'विद्यार्थ्यांना दरवर्षी ₹७५,००० ते ₹१,२५,००० पर्यंत शिष्यवृत्ती मिळते.',
      bengaliExplanation: 'মাধ্যমিক বিদ্যালয়ের শিক্ষার্থীদের বছরে ₹৭৫,০০০ থেকে ₹১,২৫,০০০ পর্যন্ত বৃত্তি প্রদান করা হয়।',
      tamilExplanation: 'மாணவர்களுக்கு ஆண்டுக்கு ₹75,000 முதல் ₹1,25,000 வரை உதவித்தொகை வழங்கப்படுகிறது.',
      teluguExplanation: 'విద్యార్థులకు ఏడాదికి ₹75,000 నుండి ₹1,25,000 వరకు స్కాలర్‌షిప్ అందించబడుతుంది.',
      expectedAnswer: true
    },
    {
      id: 'yas-income',
      question: 'Is your parental annual income within ₹2,50,000 per year?',
      hindiQuestion: 'क्या आपके परिवार की वार्षिक आय ₹2,50,000 से कम है?',
      marathiQuestion: 'तुमच्या पालकांचे वार्षिक उत्पन्न ₹२,५०,००० च्या आत आहे का?',
      bengaliQuestion: 'আপনার পিতা-মাতার বার্ষিক আয় কি ₹২,৫০,০০০-এর মধ্যে?',
      tamilQuestion: 'உங்கள் பெற்றோரின் ஆண்டு வருமானம் ₹2,50,000-க்குள் உள்ளதா?',
      teluguQuestion: 'మీ తల్లిదండ్రుల వార్షిక ఆదాయం ₹2,50,000 పరిమితిలో ఉందా?',
      explanation: 'Family income cap is ₹2.5 Lakh.',
      hindiExplanation: 'पारिवारिक आय सीमा ₹2.5 लाख है।',
      marathiExplanation: 'कौटुंबिक उत्पन्न मर्यादा ₹२.५ लाख आहे.',
      bengaliExplanation: 'পারিবারিক আয়ের সর্বোচ্চ সীমা ₹২.৫ লাখ।',
      tamilExplanation: 'குடும்ப வருமான உச்சவரம்பு ₹2.5 லட்சம்.',
      teluguExplanation: 'కుటుంబ ఆదాయ పరిమితి ₹2.5 లక్షలు.',
      expectedAnswer: true
    }
  ],

  'pm-sym': [
    {
      id: 'sym-work',
      question: 'Do you work in the unorganized sector (e.g. daily wager, maid, construction worker, driver, coolie)?',
      hindiQuestion: 'क्या आप असंगठित क्षेत्र (दैनिक मजदूर, घरेलू सहायक, निर्माण श्रमिक, ड्राइवर, कुली) में काम करते हैं?',
      marathiQuestion: 'तुम्ही असंघटित क्षेत्रात काम करता का (उदा. रोजंदारी मजूर, घरकामगार, बांधकाम कामगार, चालक)?',
      bengaliQuestion: 'আপনি কি অসংগঠিত ক্ষেত্রে কাজ করেন (দিনমজুর, গৃহকর্মী, নির্মাণ শ্রমিক, চালক ইত্যাদি)?',
      tamilQuestion: 'நீங்கள் அமைப்புசாரா துறையில் பணிபுரிகிறீர்களா (தினக்கூலி, வீட்டு வேலை, கட்டுமானத் தொழிலாளி, ஓட்டுநர்)?',
      teluguQuestion: 'మీరు అసంఘటిత రంగంలో పనిచేస్తున్నారా (దినసరి కూలీ, గృహ సహాయకుడు, నిర్మాణ కార్మికుడు, డ్రైవర్)?',
      explanation: 'PM-SYM is dedicated to unorganized workers.',
      hindiExplanation: 'पीएम श्रम योगी मानधन योजना असंगठित कामगारों के लिए है।',
      marathiExplanation: 'पीएम श्रम योगी मानधन योजना प्रामुख्याने असंघटित कामगारांसाठी आहे.',
      bengaliExplanation: 'পিএম শ্রম যোগী মান-ধন অসংগঠিত শ্রমিকদের জন্য নিবেদিত।',
      tamilExplanation: 'பிரதமர் ஷ்ரம் யோகி திட்டம் அமைப்புசாரா தொழிலாளர்களுக்கானது.',
      teluguExplanation: 'పీఎం శ్రమ యోగి మాన్-ధన్ పథకం అసంఘటిత కార్మికుల కోసం ఉద్దేశించబడింది.',
      expectedAnswer: true,
      fieldMapped: 'unorganized_worker'
    },
    {
      id: 'sym-age',
      question: 'Is your age between 18 and 40 years?',
      hindiQuestion: 'क्या आपकी उम्र 18 से 40 वर्ष के बीच है?',
      marathiQuestion: 'तुमचे वय १८ ते ४० वर्षांच्या दरम्यान आहे का?',
      bengaliQuestion: 'আপনার বয়স কি ১৮ থেকে ৪০ বছরের মধ্যে?',
      tamilQuestion: 'உங்கள் வயது 18 முதல் 40 வயதிற்குள் உள்ளதா?',
      teluguQuestion: 'మీ వయస్సు 18 నుండి 40 సంవత్సరాల మధ్య ఉందా?',
      explanation: 'Entry age is strictly limited to 18–40 years.',
      hindiExplanation: 'प्रवेश आयु 18 से 40 वर्ष के बीच होनी अनिवार्य है।',
      marathiExplanation: 'प्रवेशासाठी वय १८ ते ४० वर्षे असणे बंधनकारक आहे.',
      bengaliExplanation: 'প্রবেশের বয়স ১৮ থেকে ৪০ বছরের মধ্যে সীমাবদ্ধ।',
      tamilExplanation: 'சேர்க்கை வயது 18-40 வயதுக்குள் இருக்க வேண்டும்.',
      teluguExplanation: 'చేరిక వయస్సు ఖచ్చితంగా 18-40 సంవత్సరాల మధ్య ఉండాలి.',
      expectedAnswer: true
    },
    {
      id: 'sym-income',
      question: 'Is your monthly income ₹15,000 or below (annual income under ₹1.8 Lakhs)?',
      hindiQuestion: 'क्या आपकी मासिक आमदनी ₹15,000 या उससे कम है?',
      marathiQuestion: 'तुमचे मासिक उत्पन्न ₹१५,००० किंवा त्यापेक्षा कमी आहे का?',
      bengaliQuestion: 'আপনার মাসিক আয় কি ₹১৫,০০০ বা তার কম?',
      tamilQuestion: 'உங்கள் மாத வருமானம் ₹15,000 அல்லது அதற்கும் குறைவாக உள்ளதா?',
      teluguQuestion: 'మీ నెలవారీ ఆదాయం ₹15,000 లేదా అంతకంటే తక్కువగా ఉందా?',
      explanation: 'Monthly wage limit is ₹15,000.',
      hindiExplanation: 'मासिक वेतन ₹15,000 या उससे कम होना चाहिए।',
      marathiExplanation: 'मासिक वेतन मर्यादा ₹१५,००० आहे.',
      bengaliExplanation: 'মাসিক বেতনের সর্বোচ্চ সীমা ₹১৫,০০০।',
      tamilExplanation: 'மாத ஊதிய வரம்பு ₹15,000.',
      teluguExplanation: 'నెలవారీ వేతన పరిమితి ₹15,000.',
      expectedAnswer: true
    },
    {
      id: 'sym-epfo',
      question: 'Are you a member of EPFO / ESIC / NPS or do you pay Income Tax?',
      hindiQuestion: 'क्या आप ईपीएफओ (EPFO), ईएसआईसी (ESIC) के सदस्य हैं या आयकर देते हैं?',
      marathiQuestion: 'तुम्ही EPFO / ESIC चे सदस्य आहात किंवा आयकर भरता का?',
      bengaliQuestion: 'আপনি কি EPFO / ESIC-এর সদস্য অথবা আয়কর দেন?',
      tamilQuestion: 'நீங்கள் EPFO / ESIC உறுப்பினர் அல்லது வருமான வரி செலுத்துபவரா?',
      teluguQuestion: 'మీరు EPFO / ESIC సభ్యులా లేదా ఆదాయపు పన్ను చెల్లిస్తున్నారా?',
      explanation: 'Organized sector workers with provident fund (EPFO) or taxpayers are excluded.',
      hindiExplanation: 'संगठित क्षेत्र के कर्मचारी और आयकर दाता इसके पात्र नहीं हैं।',
      marathiExplanation: 'संघटित क्षेत्रातील कामगार आणि आयकरदाते या योजनेसाठी अपात्र आहेत.',
      bengaliExplanation: 'ভবিষ্য তহবিল (EPFO) বা আয়করদাতারা এই প্রকল্পের বাইরে।',
      tamilExplanation: 'வருங்கால வைப்பு நிதி (EPFO) அல்லது வருமான வரி செலுத்துவோர் தகுதியற்றவர்கள்.',
      teluguExplanation: 'భవిష్య నిధి (EPFO) ఉన్న వ్యవస్థీకృత రంగ కార్మికులు లేదా పన్ను చెల్లింపుదారులు అనర్హులు.',
      expectedAnswer: false
    }
  ],

  'atal-pension-yojana': [
    {
      id: 'apy-age',
      question: 'Is your current age between 18 and 40 years?',
      hindiQuestion: 'क्या आपकी आयु 18 से 40 वर्ष के बीच है?',
      marathiQuestion: 'तुमचे सध्याचे वय १८ ते ४० वर्षांच्या दरम्यान आहे का?',
      bengaliQuestion: 'আপনার বর্তমান বয়স কি ১৮ থেকে ৪০ বছরের মধ্যে?',
      tamilQuestion: 'உங்கள் தற்போதைய வயது 18 முதல் 40 வயதிற்குள் உள்ளதா?',
      teluguQuestion: 'మీ ప్రస్తుత వయస్సు 18 నుండి 40 సంవత్సరాల మధ్య ఉందా?',
      explanation: 'Entry age must be between 18 and 40 years to accumulate pension till age 60.',
      hindiExplanation: '60 वर्ष की आयु तक पेंशन संचय हेतु उम्र 18 से 40 वर्ष होनी चाहिए।',
      marathiExplanation: '६० व्या वर्षापर्यंत पेन्शन निधी उभारण्यासाठी वय १८ ते ४० असणे आवश्यक आहे.',
      bengaliExplanation: '৬০ বছর বয়স পর্যন্ত পেনশন জমার জন্য প্রবেশের বয়স ১৮-৪০ বছর হতে হবে।',
      tamilExplanation: '60 வயது வரை ஓய்வூதியம் சேமிக்க வயது 18 முதல் 40 வரை இருக்க வேண்டும்.',
      teluguExplanation: '60 ఏళ్ల వయస్సు వరకు పెన్షన్ కూడబెట్టడానికి వయస్సు 18 నుండి 40 ఏళ్ల మధ్య ఉండాలి.',
      expectedAnswer: true
    },
    {
      id: 'apy-tax',
      question: 'Are you an income taxpayer under the Income Tax Act?',
      hindiQuestion: 'क्या आप आयकर (Income Tax) दाता हैं?',
      marathiQuestion: 'तुम्ही आयकर भरता का?',
      bengaliQuestion: 'আপনি কি কোনো আয়কর প্রদানকারী?',
      tamilQuestion: 'நீங்கள் வருமான வரி செலுத்துபவரா?',
      teluguQuestion: 'మీరు ఆదాయపు పన్ను చెల్లిస్తున్నారా?',
      explanation: 'Income taxpayers are excluded from joining APY as per the October 2022 gazette amendment.',
      hindiExplanation: 'अक्टूबर 2022 के सरकारी गजट के अनुसार आयकर दाता इसमें शामिल नहीं हो सकते।',
      marathiExplanation: 'ऑक्टोबर २०२२ च्या सरकारी नियमांनुसार आयकरदाते यात सहभागी होऊ शकत नाहीत.',
      bengaliExplanation: 'সরকারি নিয়ম অনুযায়ী আয়করদাতারা এই প্রকল্পে যোগ দিতে পারবেন না।',
      tamilExplanation: 'அரசு விதிகளின்படி வருமான வரி செலுத்துவோர் இதில் சேர முடியாது.',
      teluguExplanation: 'నిబంధనల ప్రకారం ఆదాయపు పన్ను చెల్లింపుదారులు ఇందులో చేరలేరు.',
      expectedAnswer: false
    },
    {
      id: 'apy-bank',
      question: 'Do you have an active savings bank account with auto-debit facility?',
      hindiQuestion: 'क्या आपके पास मासिक किस्त कटने के लिए सक्रिय बचत बैंक खाता है?',
      marathiQuestion: 'तुमच्याकडे मासिक हप्त्यासाठी ऑटो-डेबिट सुविधेसह सक्रिय बँक खाते आहे का?',
      bengaliQuestion: 'আপনার কি অটো-ডেবিট সুবিধা সহ সক্রিয় সেভিংস ব্যাঙ্ক অ্যাকাউন্ট আছে?',
      tamilQuestion: 'மாதாந்திர தவணை செலுத்த வங்கி சேமிப்புக் கணக்கு உள்ளதா?',
      teluguQuestion: 'నెలవారీ వాయిదా కోసం ఆటో-డెబిట్ సదుపాయం ఉన్న బ్యాంక్ ఖాతా ఉందా?',
      explanation: 'Monthly pension contribution is auto-debited from your savings account.',
      hindiExplanation: 'मासिक अंशदान आपके बचत बैंक खाते से स्वतः कट जाता है।',
      marathiExplanation: 'मासिक पेन्शन योगदान तुमच्या खात्यातून आपोआप कापले जाते.',
      bengaliExplanation: 'মাসিক পেনশনের টাকা আপনার সেভিংস অ্যাকাউন্ট থেকে কাটা হবে।',
      tamilExplanation: 'மாதாந்திர ஓய்வூதிய பங்களிப்பு உங்கள் கணக்கிலிருந்து பிடித்தம் செய்யப்படும்.',
      teluguExplanation: 'నెలవారీ పెన్షన్ చెల్లింపు మీ ఖాతా నుండి ఆటోమేటిక్‌గా డెబిట్ అవుతుంది.',
      expectedAnswer: true
    }
  ],

  'ignoaps-pension': [
    {
      id: 'ign-age',
      question: 'Is your age 60 years or older?',
      hindiQuestion: 'क्या आपकी उम्र 60 वर्ष या उससे अधिक है?',
      marathiQuestion: 'तुमचे वय ६० वर्षे किंवा त्याहून अधिक आहे का?',
      bengaliQuestion: 'আপনার বয়স কি ৬০ বছর বা তার বেশি?',
      tamilQuestion: 'உங்கள் வயது 60 அல்லது அதற்கு மேற்பட்டதா?',
      teluguQuestion: 'మీ వయస్సు 60 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ ఉందా?',
      explanation: 'Old age pension is provided to senior citizens aged 60+.',
      hindiExplanation: 'वृद्धावस्था पेंशन 60 वर्ष या उससे अधिक आयु के नागरिकों को दी जाती है।',
      marathiExplanation: '६० वर्षे आणि त्याहून अधिक वयाच्या ज्येष्ठ नागरिकांना वृद्धापकाळ पेन्शन दिली जाते.',
      bengaliExplanation: '৬০ বছরের বেশি বয়সী প্রবীণ নাগরিকদের জন্য বার্ধক্য পেনশন প্রযোজ্য।',
      tamilExplanation: '60 வயதுக்கு மேற்பட்ட மூத்த குடிமக்களுக்கு முதியோர் ஓய்வூதியம் வழங்கப்படுகிறது.',
      teluguExplanation: '60 ఏళ్లు పైబడిన వృద్ధులకు వృద్ధాప్య పెన్షన్ అందించబడుతుంది.',
      expectedAnswer: true
    },
    {
      id: 'ign-bpl',
      question: 'Does your household belong to Below Poverty Line (BPL) or Antyodaya category?',
      hindiQuestion: 'क्या आपका परिवार गरीबी रेखा से नीचे (BPL) या अंत्योदय राशन कार्ड धारक है?',
      marathiQuestion: 'तुमचे कुटुंब दारिद्र्यरेषेखालील (BPL) किंवा अंत्योदय रेशनकार्ड धारक आहे का?',
      bengaliQuestion: 'আপনার পরিবার কি বিপিএল (BPL) বা অন্ত্যোদয় রেশন কার্ডধারী?',
      tamilQuestion: 'உங்கள் குடும்பம் வறுமைக் கோட்டிற்கு கீழ் (BPL) அல்லது அந்த்யோதயா பிரிவைச் சேர்ந்ததா?',
      teluguQuestion: 'మీ కుటుంబం దారిద్య్రరేఖకు దిగువన (BPL) లేదా అంత్యోదయ కేటగిరీకి చెందినదా?',
      explanation: 'Mandatory requirement: must possess valid BPL certification or ration card.',
      hindiExplanation: 'बीपीएल राशन कार्ड या गरीबी रेखा प्रमाणपत्र अनिवार्य है।',
      marathiExplanation: 'बीपीएल रेशनकार्ड किंवा दारिद्र्यरेषेखालील प्रमाणपत्र अनिवार्य आहे.',
      bengaliExplanation: 'বিপিএল রেশন কার্ড বা শংসাপত্র থাকা বাধ্যতামূলক।',
      tamilExplanation: 'பிபிஎல் குடும்ப அட்டை அல்லது சான்றிதழ் கட்டாயம்.',
      teluguExplanation: 'BPL రేషన్ కార్డు లేదా ధృవీకరణ పత్రం తప్పనిసరి.',
      expectedAnswer: true,
      fieldMapped: 'bpl_card'
    }
  ],

  'adip-divyangjan': [
    {
      id: 'ad-disability',
      question: 'Do you possess a UDID card or medical certificate showing 40% or more disability?',
      hindiQuestion: 'क्या आपके पास 40% या अधिक दिव्यांगता का यूडीआईडी (UDID) या मेडिकल प्रमाणपत्र है?',
      marathiQuestion: 'तुमच्याकडे ४०% किंवा त्याहून अधिक दिव्यांगत्वाचे UDID किंवा वैद्यकीय प्रमाणपत्र आहे का?',
      bengaliQuestion: 'আপনার কি ৪০% বা তার বেশি প্রতিবন্ধকতার UDID কার্ড বা মেডিকেল সার্টিফিকেট আছে?',
      tamilQuestion: 'உங்களிடம் 40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறனாளி UDID அட்டை உள்ளதா?',
      teluguQuestion: 'మీ వద్ద 40% లేదా అంతకంటే ఎక్కువ వైకల్యం ఉన్నట్లు UDID కార్డు లేదా మెడికల్ సర్టిఫికేట్ ఉందా?',
      explanation: 'Mandatory requirement: minimum 40% benchmark disability under the RPwD Act.',
      hindiExplanation: 'दिव्यांगता अधिकार अधिनियम के तहत न्यूनतम 40% दिव्यांगता प्रमाणपत्र आवश्यक है।',
      marathiExplanation: 'दिव्यांग हक्क कायद्यानुसार किमान ४०% अपंगत्व प्रमाणपत्र असणे आवश्यक आहे.',
      bengaliExplanation: 'আইন অনুযায়ী ন্যূনতম ৪০% প্রতিবন্ধকতার প্রমাণপত্র থাকা বাধ্যতামূলক।',
      tamilExplanation: 'குறைந்தபட்சம் 40% மாற்றுத்திறன் சான்றிதழ் அவசியமானது.',
      teluguExplanation: 'చట్టం ప్రకారం కనీసం 40% వైకల్య ధృవీకరణ పత్రం తప్పనిసరి.',
      expectedAnswer: true,
      fieldMapped: 'disability_40_plus'
    },
    {
      id: 'ad-income',
      question: 'Is your individual monthly income ₹30,000 or below (₹22,500 for 100% free aids)?',
      hindiQuestion: 'क्या आपकी मासिक आय ₹30,000 या उससे कम है (100% मुफ्त उपकरण के लिए ₹22,500)?',
      marathiQuestion: 'तुमचे वैयक्तिक मासिक उत्पन्न ₹३०,००० च्या आत आहे का (१००% मोफत उपकरणांसाठी ₹२२,५००)?',
      bengaliQuestion: 'আপনার ব্যক্তিগত মাসিক আয় কি ₹৩০,০০০ বা তার কম (১০০% বিনামূল্যে যন্ত্রপাতির জন্য ₹২২,৫০০)?',
      tamilQuestion: 'உங்கள் தனிநபர் மாத வருமானம் ₹30,000 அல்லது அதற்கும் குறைவாக உள்ளதா?',
      teluguQuestion: 'మీ వ్యక్తిగత నెలవారీ ఆదాయం ₹30,000 లేదా అంతకంటే తక్కువగా ఉందా?',
      explanation: 'Government provides 100% subsidy for income up to ₹22,500/mo and 50% for up to ₹30,000/mo.',
      hindiExplanation: '₹22,500/माह तक 100% मुफ्त तथा ₹30,000/माह तक 50% सरकारी अनुदान मिलता है।',
      marathiExplanation: 'दरमहा ₹२२,५०० पर्यंत १००% मोफत आणि ₹३०,००० पर्यंत ५०% अनुदान मिळते.',
      bengaliExplanation: 'প্রতি মাসে ₹২২,৫০০ পর্যন্ত ১০০% অনুদান এবং ₹৩০,০০০ পর্যন্ত ৫০% অনুদান মেলে।',
      tamilExplanation: 'மாதம் ₹22,500 வரை 100% மானியமும், ₹30,000 வரை 50% மானியமும் வழங்கப்படுகிறது.',
      teluguExplanation: 'నెలకు ₹22,500 వరకు 100% మరియు ₹30,000 వరకు 50% రాయితీ లభిస్తుంది.',
      expectedAnswer: true
    }
  ],

  'pm-mudra': [
    {
      id: 'mud-business',
      question: 'Do you operate or plan to start a non-farm small business, shop, artisan, or manufacturing unit?',
      hindiQuestion: 'क्या आप कोई दुकान, व्यापार, लघु उद्योग, कारीगरी या गैर-कृषि व्यवसाय चलाते या शुरू करना चाहते हैं?',
      marathiQuestion: 'तुम्ही शेतीव्यतिरिक्त लहान व्यवसाय, दुकान किंवा उत्पादन युनिट सुरू करू इच्छिता का?',
      bengaliQuestion: 'আপনি কি কোনো অ-কৃষি ক্ষুদ্র ব্যবসা, দোকান বা উৎপাদন ইউনিট পরিচালনা বা শুরু করতে চান?',
      tamilQuestion: 'நீங்கள் விவசாயம் அல்லாத சிறு தொழில், கடை அல்லது உற்பத்தி பிரிவு தொடங்க விரும்புகிறீர்களா?',
      teluguQuestion: 'మీరు వ్యవసాయేతర చిన్న వ్యాపారం, దుకాణం లేదా తయారీ యూనిట్‌ను నడుపుతున్నారా లేదా ప్రారంభించాలనుకుంటున్నారా?',
      explanation: 'MUDRA loans provide collateral-free credit for non-corporate micro units.',
      hindiExplanation: 'मुद्रा ऋण गैर-कॉर्पोरेट छोटे व्यवसायों को बिना गारंटी का ऋण प्रदान करता है।',
      marathiExplanation: 'मुद्रा कर्ज सूक्ष्म उद्योगांना विनातारण वित्तपुरवठा करते.',
      bengaliExplanation: 'মুদ্রা ঋণ ক্ষুদ্র ব্যবসার জন্য জামানতবিহীন ঋণ প্রদান করে।',
      tamilExplanation: 'முத்ரா கடன் சிறு குறு நிறுவனங்களுக்கு பிணையில்லா கடன் வழங்குகிறது.',
      teluguExplanation: 'ముద్రా రుణాలు చిన్న వ్యాపారాలకు పూచీకత్తు లేని రుణాన్ని అందిస్తాయి.',
      expectedAnswer: true
    },
    {
      id: 'mud-defaulter',
      question: 'Are you a defaulter in any commercial, rural, or cooperative bank?',
      hindiQuestion: 'क्या आप किसी भी बैंक में डिफाल्टर (कर्ज न चुकाने वाले) हैं?',
      marathiQuestion: 'तुम्ही कोणत्याही बँकेत थकीत कर्जदार (डिफॉल्टर) आहात का?',
      bengaliQuestion: 'আপনি কি কোনো বাণিজ্যিক বা সমবায় ব্যাংকে ঋণ খেলাপকারী?',
      tamilQuestion: 'நீங்கள் ஏதேனும் வங்கியில் கடன் திருப்பிச் செலுத்தாதவரா?',
      teluguQuestion: 'మీరు ఏదైనా బ్యాంకులో రుణం చెల్లించని డిఫాల్టర్లా?',
      explanation: 'Borrower must not have any non-performing asset or default record.',
      hindiExplanation: 'ऋण लेने वाले का किसी बैंक में डिफाल्टर रिकॉर्ड नहीं होना चाहिए।',
      marathiExplanation: 'कर्जदाराचा कोणताही बँक डिफॉल्ट रेकॉर्ड नसावा.',
      bengaliExplanation: 'ঋণগ্রহীতার কোনো ব্যাংক খেলাপের রেকর্ড থাকা চলবে না।',
      tamilExplanation: 'விண்ணப்பதாரர் எந்த வங்கியிலும் கடன் பாக்கி வைத்திருக்கக் கூடாது.',
      teluguExplanation: 'రుణగ్రహీతకు బ్యాంకుల్లో ఎలాంటి డిఫాల్ట్ రికార్డు ఉండకూడదు.',
      expectedAnswer: false
    }
  ],

  'ab-pmjay': [
    {
      id: 'pmjay-senior',
      question: 'Is any member of your household aged 70 years or above?',
      hindiQuestion: 'क्या आपके परिवार में कोई सदस्य 70 वर्ष या उससे अधिक आयु का है?',
      marathiQuestion: 'तुमच्या कुटुंबात ७० वर्षे किंवा त्याहून अधिक वयाचा कोणताही सदस्य आहे का?',
      bengaliQuestion: 'আপনার পরিবারের কোনো সদস্য কি ৭০ বছর বা তার বেশি বয়সী?',
      tamilQuestion: 'உங்கள் குடும்பத்தில் 70 வயது அல்லது அதற்கு மேற்பட்ட முதியவர்கள் உள்ளனரா?',
      teluguQuestion: 'మీ కుటుంబంలో 70 సంవత్సరాలు లేదా అంతకంటే ఎక్కువ వయస్సు ఉన్న సభ్యులు ఉన్నారా?',
      explanation: 'All senior citizens aged 70+ receive universal ₹5,00,000 annual healthcare coverage regardless of income!',
      hindiExplanation: '70 वर्ष या उससे अधिक उम्र के सभी वरिष्ठ नागरिकों को आय की परवाह किए बिना ₹5 लाख का मुफ्त स्वास्थ्य कवर मिलता है!',
      marathiExplanation: '७० वर्षांवरील सर्व ज्येष्ठ नागरिकांना उत्पन्नाचा विचार न करता दरवर्षी ₹५ लाख मोफत आरोग्य संरक्षण मिळते!',
      bengaliExplanation: '৭০+ বয়সী সকল প্রবীণ নাগরিক আয়ের সীমাবদ্ধতা ছাড়াই বার্ষিক ₹৫ লাখ বিনামূল্যে স্বাস্থ্য কভার পান!',
      tamilExplanation: '70 வயதுக்கு மேற்பட்ட அனைவருக்கும் வருமான வரம்பின்றி ஆண்டுக்கு ₹5 லட்சம் இலவச மருத்துவக் காப்பீடு உண்டு!',
      teluguExplanation: '70 ఏళ్లు పైబడిన వృద్ధులందరికీ ఆదాయ పరిమితి లేకుండా ఏడాదికి ₹5 లక్షల ఉచిత ఆరోగ్య కవరేజ్ లభిస్తుంది!',
      expectedAnswer: true
    },
    {
      id: 'pmjay-aadhaar',
      question: 'Do you have an Aadhaar card or Ration card to verify family identity?',
      hindiQuestion: 'क्या आपके पास ई-केवाईसी और पहचान सत्यापन के लिए आधार कार्ड या राशन कार्ड है?',
      marathiQuestion: 'ओळख पडताळणीसाठी तुमच्याकडे आधार कार्ड किंवा रेशनकार्ड आहे का?',
      bengaliQuestion: 'পরিচয় যাচাইয়ের জন্য আপনার কি আধার কার্ড বা রেশন কার্ড আছে?',
      tamilQuestion: 'அடையாளச் சரிபார்ப்பிற்கு உங்களிடம் ஆதார் அட்டை அல்லது குடும்ப அட்டை உள்ளதா?',
      teluguQuestion: 'గుర్తింపు ధృవీకరణ కోసం మీ వద్ద ఆధార్ కార్డు లేదా రేషన్ కార్డు ఉందా?',
      explanation: 'Aadhaar e-KYC is required to generate the official Ayushman golden card.',
      hindiExplanation: 'आयुष्मान गोल्डन कार्ड बनाने के लिए आधार ई-केवाईसी अनिवार्य है।',
      marathiExplanation: 'आयुष्मान गोल्डन कार्ड मिळवण्यासाठी आधार ई-केवायसी आवश्यक आहे.',
      bengaliExplanation: 'আয়ুষ্মান গোল্ডেন কার্ড তৈরির জন্য আধার ই-কেওয়াইসি আবশ্যক।',
      tamilExplanation: 'ஆயுஷ்மான் அட்டை பெற ஆதார் இ-கேஒய்சி கட்டாயமாகும்.',
      teluguExplanation: 'ఆయుష్మాన్ గోల్డెన్ కార్డు కోసం ఆధార్ ఇ-కెవైసి తప్పనిసరి.',
      expectedAnswer: true
    }
  ]
};

export function getSchemeCompulsoryQuestions(schemeId: string): CompulsoryQuestion[] {
  if (SCHEME_COMPULSORY_QUESTIONS[schemeId]) {
    return SCHEME_COMPULSORY_QUESTIONS[schemeId];
  }

  // Universal fallback compulsory questions
  return [
    {
      id: 'gen-citizen',
      question: 'Are you a citizen and permanent resident of India?',
      hindiQuestion: 'क्या आप भारत के नागरिक और स्थायी निवासी हैं?',
      marathiQuestion: 'तुम्ही भारताचे नागरिक आणि कायमस्वरूपी रहिवासी आहात का?',
      bengaliQuestion: 'আপনি কি ভারতের নাগরিক ও স্থায়ী বাসিন্দা?',
      tamilQuestion: 'நீங்கள் இந்திய குடிமகன் மற்றும் நிரந்தர குடியிருப்பாளரா?',
      teluguQuestion: 'మీరు భారత పౌరుడు మరియు శాశ్వత నివాసిగా ఉన్నారా?',
      explanation: 'Scheme is available to citizens of India.',
      hindiExplanation: 'यह योजना भारत के नागरिकों के लिए उपलब्ध है।',
      marathiExplanation: 'ही योजना भारतीय नागरिकांसाठी उपलब्ध आहे.',
      bengaliExplanation: 'এই প্রকল্পটি ভারতীয় নাগরিকদের জন্য প্রযোজ্য।',
      tamilExplanation: 'இத்திட்டம் இந்தியக் குடிமக்களுக்கு மட்டுமே.',
      teluguExplanation: 'ఈ పథకం భారత పౌరులకు మాత్రమే అందుబాటులో ఉంది.',
      expectedAnswer: true
    },
    {
      id: 'gen-aadhaar',
      question: 'Do you have an Aadhaar card and an active bank account?',
      hindiQuestion: 'क्या आपके पास आधार कार्ड और सक्रिय बैंक खाता है?',
      marathiQuestion: 'तुमच्याकडे आधार कार्ड आणि सक्रिय बँक खाते आहे का?',
      bengaliQuestion: 'আপনার কি আধার কার্ড এবং সক্রিয় ব্যাঙ্ক অ্যাকাউন্ট রয়েছে?',
      tamilQuestion: 'உங்களிடம் ஆதார் அட்டை மற்றும் செயலில் உள்ள வங்கிக் கணக்கு உள்ளதா?',
      teluguQuestion: 'మీ వద్ద ఆధార్ కార్డు మరియు పనిచేసే బ్యాంక్ ఖాతా ఉందా?',
      explanation: 'Government benefits are disbursed via Aadhaar DBT.',
      hindiExplanation: 'सरकारी लाभ सीधे आधार लिंक बैंक खाते में भेजे जाते हैं।',
      marathiExplanation: 'सरकारी लाभ थेट आधार लिंक बँक खात्यात दिले जातात.',
      bengaliExplanation: 'সরকারি অনুদান সরাসরি আধার যুক্ত ব্যাঙ্ক অ্যাকাউন্টে জমা হয়।',
      tamilExplanation: 'அரசு பலன்கள் நேரடி பணப்பரிமாற்றம் மூலம் செலுத்தப்படும்.',
      teluguExplanation: 'ప్రభుత్వ ప్రయోజనాలు నేరుగా ఆధార్ లింక్ అయిన బ్యాంక్ ఖాతాలో జమ చేయబడతాయి.',
      expectedAnswer: true
    }
  ];
}
`;

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully enriched compulsory-questions.ts with 6 regional languages!');
