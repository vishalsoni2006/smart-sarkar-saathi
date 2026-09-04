import fs from 'fs';
import path from 'path';

const translationsFile = path.resolve('src/lib/i18n/translations.ts');
let content = fs.readFileSync(translationsFile, 'utf8');

// Additional keys per language
const additionalKeys = {
  en: {
    compulsoryEligibilityCheck: "Compulsory Eligibility Check",
    compulsoryQuestionsFor: "Mandatory Eligibility Questions for",
    compulsoryQuestionsDesc: "Answer these compulsory questions to verify your eligibility before applying:",
    answeredCountOf: "Answered",
    yesOption: "YES",
    noOption: "NO",
    requirementVerified: "✓ Requirement Verified: You satisfy this compulsory criterion.",
    criterionUnmet: "✕ Criterion Unmet: This specific condition disqualifies you for this scheme.",
    congratsAllCriteriaMet: "🎉 Congratulations! You meet ALL compulsory eligibility criteria!",
    congratsAllCriteriaDesc: "You satisfy all official statutory requirements. You can now proceed directly to the official government portal.",
    proceedToOfficialPortal: "Proceed to Official Application Portal",
    keepDocsReady: "Keep the following documents ready when applying:",
    mandatoryReqsNotMet: "Mandatory Requirements Not Met for this Scheme",
    mandatoryReqsNotMetDesc: "mandatory requirement was not satisfied. Don't worry—you may still be eligible for other universal schemes.",
    resetQuestions: "Reset Questions",
    documentsLabel: "Documents",
    verifiedDateLabel: "Verified",
    allSchemes: "All Schemes",
    schemeCountSingular: "Scheme",
    schemeCountPlural: "Schemes",
    accessibilityTitle: "Citizen Accessibility",
    accessibilitySubtitle: "Accessibility & Citizen Assistance Options",
    textSizeLabel: "Text Size",
    highContrastLabel: "High Contrast Mode",
    highContrastDesc: "Enhanced contrast for easy reading",
    voiceReaderLabel: "Screen Voice Reader",
    voiceReaderDesc: "Listen to schemes in voice",
    voiceListen: "Listen 🔊",
    voiceStop: "Stop ⏹",
    selectLanguageLabel: "Language / भाषा चुनें",
    resetAllSettings: "Reset All",
    applyAndClose: "Apply & Close",
    noMatchingSchemesFound: "No schemes match your current search/filter. Check universal schemes below!",
    unmatchedOccupationLogged: "Unmatched Occupation Logged:",
    unmatchedOccupationDesc: "No verified schemes currently match this specific role directly. We have logged this query into the backlog for future scheme additions. Showing universal welfare schemes below!"
  },
  hi: {
    compulsoryEligibilityCheck: "अनिवार्य पात्रता जांच",
    compulsoryQuestionsFor: "के लिए अनिवार्य पात्रता शर्तें",
    compulsoryQuestionsDesc: "आवेदन करने से पहले अपनी 100% पात्रता सत्यापित करने के लिए इन अनिवार्य सवालों के जवाब दें:",
    answeredCountOf: "उत्तर दिए गए",
    yesOption: "हाँ (YES)",
    noOption: "नहीं (NO)",
    requirementVerified: "✓ शर्त पूरी हुई: आप इस आवश्यकता के पात्र हैं।",
    criterionUnmet: "✕ यह शर्त पूरी नहीं हुई: इस कारण आप इस योजना के अपात्र हो सकते हैं।",
    congratsAllCriteriaMet: "🎉 बधाई हो! आप इस योजना के 100% पात्र हैं!",
    congratsAllCriteriaDesc: "आप सभी आवश्यक सरकारी शर्तें पूरी करते हैं। आप तुरंत आधिकारिक पोर्टल पर आवेदन कर सकते हैं।",
    proceedToOfficialPortal: "आधिकारिक पोर्टल पर अभी आवेदन करें",
    keepDocsReady: "आवेदन के समय निम्नलिखित दस्तावेज तैयार रखें:",
    mandatoryReqsNotMet: "आप इस योजना की अनिवार्य शर्तें पूरी नहीं करते हैं",
    mandatoryReqsNotMetDesc: "अनिवार्य शर्तें पूरी नहीं हुईं। चिंता न करें, आप अन्य सार्वभौमिक योजनाओं के पात्र हो सकते हैं।",
    resetQuestions: "सवाल रीसेट करें",
    documentsLabel: "दस्तावेज",
    verifiedDateLabel: "सत्यापित",
    allSchemes: "सभी योजनाएं",
    schemeCountSingular: "योजना",
    schemeCountPlural: "योजनाएं",
    accessibilityTitle: "नागरिक सुलभता",
    accessibilitySubtitle: "सुलभता एवं सहायता विकल्प",
    textSizeLabel: "फ़ॉन्ट आकार",
    highContrastLabel: "उच्च कंट्रास्ट मोड",
    highContrastDesc: "आसान पढ़ाई के लिए स्पष्ट कंट्रास्ट",
    voiceReaderLabel: "स्क्रीन वॉयस रीडर",
    voiceReaderDesc: "बोलकर योजनाएं सुनाएं (आवाज़)",
    voiceListen: "सुनें 🔊",
    voiceStop: "रोकें ⏹",
    selectLanguageLabel: "भाषा चुनें",
    resetAllSettings: "सभी रीसेट करें",
    applyAndClose: "लागू करें और बंद करें",
    noMatchingSchemesFound: "आपकी खोज के अनुसार कोई योजना नहीं मिली। कृपया नीचे सार्वभौमिक कल्याणकारी योजनाएं देखें!",
    unmatchedOccupationLogged: "गैर-सूचीबद्ध व्यवसाय दर्ज किया गया:",
    unmatchedOccupationDesc: "वर्तमान में इस व्यवसाय से सीधे जुड़ी कोई योजना नहीं है। हमने इसे आगामी अपडेट के लिए दर्ज कर लिया है। नीचे सामान्य जनकल्याण योजनाएं देखें!"
  },
  mr: {
    compulsoryEligibilityCheck: "अनिवार्य पात्रता तपासणी",
    compulsoryQuestionsFor: "साठी अनिवार्य पात्रता निकष",
    compulsoryQuestionsDesc: "अर्ज करण्यापूर्वी आपली पात्रता सत्यापित करण्यासाठी खालील अनिवार्य प्रश्नांची उत्तरे द्या:",
    answeredCountOf: "उत्तरे दिली",
    yesOption: "होय (YES)",
    noOption: "नाही (NO)",
    requirementVerified: "✓ अट पूर्ण: आपण या निकषासाठी पात्र आहात.",
    criterionUnmet: "✕ अट अपूर्ण: या अटीमुळे आपण या योजनेसाठी अपात्र ठरू शकता.",
    congratsAllCriteriaMet: "🎉 अभिनंदन! आपण या योजनेसाठी 100% पात्र आहात!",
    congratsAllCriteriaDesc: "आपण सर्व अधिकृत सरकारी निकष पूर्ण केले आहेत. आपण आता थेट अधिकृत पोर्टलवर अर्ज करू शकता.",
    proceedToOfficialPortal: "अधिकृत पोर्टलवर आताच अर्ज करा",
    keepDocsReady: "अर्ज करताना खालील कागदपत्रे सोबत ठेवा:",
    mandatoryReqsNotMet: "आपण या योजनेचे अनिवार्य निकष पूर्ण करत नाही",
    mandatoryReqsNotMetDesc: "अनिवार्य निकष पूर्ण झाले नाहीत. काळजी करू नका, आपण इतर सर्वसमावेशक योजनांसाठी पात्र असू शकता.",
    resetQuestions: "प्रश्न पूर्ववत करा",
    documentsLabel: "कागदपत्रे",
    verifiedDateLabel: "सत्यापित",
    allSchemes: "सर्व योजना",
    schemeCountSingular: "योजना",
    schemeCountPlural: "योजना",
    accessibilityTitle: "नागरिक सुलभता",
    accessibilitySubtitle: "सुलभता आणि सहाय्य पर्याय",
    textSizeLabel: "अक्षर आकार",
    highContrastLabel: "उच्च कॉन्ट्रास्ट मोड",
    highContrastDesc: "वाचण्यास सुलभ बनवण्यासाठी स्पष्ट रंग",
    voiceReaderLabel: "स्क्रीन व्हॉइस रीडर",
    voiceReaderDesc: "योजनांचा तपशील आवाजात ऐका",
    voiceListen: "ऐका 🔊",
    voiceStop: "थांबवा ⏹",
    selectLanguageLabel: "भाषा निवडा",
    resetAllSettings: "सर्व रीसेट करा",
    applyAndClose: "लागू करा आणि बंद करा",
    noMatchingSchemesFound: "आपल्या शोध किंवा फिल्टरनुसार कोणतीही योजना सापडली नाही. खालील सर्वसमावेशक योजना तपासा!",
    unmatchedOccupationLogged: "अनोंदणीकृत व्यवसाय नोंदवला गेला:",
    unmatchedOccupationDesc: "सध्या या व्यवसायाशी थेट संलग्न कोणतीही पडताळलेली योजना नाही. आम्ही ही नोंद पुढील अद्यतनांसाठी सुरक्षित ठेवली आहे. खालील सार्वजनिक योजना पहा!"
  },
  bn: {
    compulsoryEligibilityCheck: "বাধ্যতামূলক যোগ্যতা যাচাই",
    compulsoryQuestionsFor: "-এর জন্য বাধ্যতামূলক যোগ্যতার শর্তাবলী",
    compulsoryQuestionsDesc: "আবেদন করার আগে আপনার ১০০% যোগ্যতা যাচাই করতে নিচের প্রশ্নগুলির উত্তর দিন:",
    answeredCountOf: "উত্তর দেওয়া হয়েছে",
    yesOption: "হ্যাঁ (YES)",
    noOption: "না (NO)",
    requirementVerified: "✓ শর্ত পূরণ হয়েছে: আপনি এই প্রয়োজনীয়তার জন্য যোগ্য।",
    criterionUnmet: "✕ শর্ত পূরণ হয়নি: এই কারণে আপনি এই প্রকল্পের জন্য অযোগ্য হতে পারেন।",
    congratsAllCriteriaMet: "🎉 অভিনন্দন! আপনি এই প্রকল্পের জন্য ১০০% যোগ্য!",
    congratsAllCriteriaDesc: "আপনি সমস্ত সরকারি শর্তাবলী পূরণ করেছেন। আপনি এখন সরাসরি অফিসিয়াল পোর্টালে আবেদন করতে পারেন।",
    proceedToOfficialPortal: "অফিসিয়াল পোর্টালে এখনই আবেদন করুন",
    keepDocsReady: "আবেদনের সময় নিম্নলিখিত নথিগুলি প্রস্তুত রাখুন:",
    mandatoryReqsNotMet: "আপনি এই প্রকল্পের বাধ্যতামূলক শর্তাবলী পূরণ করেননি",
    mandatoryReqsNotMetDesc: "বাধ্যতামূলক শর্ত পূরণ হয়নি। চিন্তার কিছু নেই, আপনি অন্যান্য সর্বজনীন প্রকল্পের জন্য যোগ্য হতে পারেন।",
    resetQuestions: "প্রশ্ন রিসেট করুন",
    documentsLabel: "নথি",
    verifiedDateLabel: "যাচাইকৃত",
    allSchemes: "সমস্ত প্রকল্প",
    schemeCountSingular: "প্রকল্প",
    schemeCountPlural: "প্রকল্প",
    accessibilityTitle: "নাগরিক প্রবেশযোগ্যতা",
    accessibilitySubtitle: "সহজ পাঠ ও সহায়তা বিকল্প",
    textSizeLabel: "হরফের আকার",
    highContrastLabel: "উচ্চ বৈসাদৃশ্য মোড",
    highContrastDesc: "সহজে পড়ার জন্য উচ্চ কন্ট্রাস্ট",
    voiceReaderLabel: "স্ক্রিন ভয়েস রিডার",
    voiceReaderDesc: "ভয়েসের মাধ্যমে প্রকল্পের বিবরণ শুনুন",
    voiceListen: "শুনুন 🔊",
    voiceStop: "থামান ⏹",
    selectLanguageLabel: "ভাষা নির্বাচন করুন",
    resetAllSettings: "সব রিসেট করুন",
    applyAndClose: "প্রয়োগ করুন ও বন্ধ করুন",
    noMatchingSchemesFound: "আপনার বর্তমান অনুসন্ধানের সাথে কোনো প্রকল্প মেলেনি। নিচে সর্বজনীন প্রকল্পগুলি দেখুন!",
    unmatchedOccupationLogged: "তালিকাভুক্ত নয় এমন পেশা সংরক্ষিত:",
    unmatchedOccupationDesc: "এই পেশার সাথে সরাসরি যুক্ত কোনো প্রকল্প পাওয়া যায়নি। আমরা এটি পর্যালোচনার জন্য সংরক্ষণ করেছি। নিচে সাধারণ কল্যাণমূলক প্রকল্পগুলি দেখুন!"
  },
  ta: {
    compulsoryEligibilityCheck: "கட்டாய தகுதி சரிபார்ப்பு",
    compulsoryQuestionsFor: "திட்டத்திற்கான கட்டாய தகுதி வினாக்கள்",
    compulsoryQuestionsDesc: "விண்ணப்பிக்கும் முன் உங்கள் தகுதியை 100% சரிபார்க்க இந்த கட்டாய கேள்விகளுக்கு பதிலளிக்கவும்:",
    answeredCountOf: "பதிலளிக்கப்பட்டது",
    yesOption: "ஆம் (YES)",
    noOption: "இல்லை (NO)",
    requirementVerified: "✓ நிபந்தனை நிறைவேறியது: இந்த தேவைக்கு நீங்கள் தகுதியுடையவர்.",
    criterionUnmet: "✕ நிபந்தனை நிறைவேறவில்லை: இதனால் நீங்கள் இத்திட்டத்திற்கு தகுதியற்றவராகலாம்.",
    congratsAllCriteriaMet: "🎉 வாழ்த்துகள்! நீங்கள் 100% தகுதியுடையவர்!",
    congratsAllCriteriaDesc: "அனைத்து சட்டபூர்வ அரசு விதிகளையும் நீங்கள் பூர்த்தி செய்கிறீர்கள். உடனடியாக அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்பிக்கலாம்.",
    proceedToOfficialPortal: "அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்பிக்கவும்",
    keepDocsReady: "விண்ணப்பிக்கும் போது இந்த ஆவணங்களை தயார் நிலையில் வைத்திருக்கவும்:",
    mandatoryReqsNotMet: "இத்திட்டத்திற்கான கட்டாய நிபந்தனைகள் பூர்த்தி செய்யப்படவில்லை",
    mandatoryReqsNotMetDesc: "கட்டாய நிபந்தனைகள் பூர்த்தி செய்யப்படவில்லை. கவலைப்பட வேண்டாம், பிற பொதுவான நலத்திட்டங்களுக்கு நீங்கள் தகுதி பெறலாம்.",
    resetQuestions: "கேள்விகளை மீட்டமைக்கவும்",
    documentsLabel: "ஆவணங்கள்",
    verifiedDateLabel: "சரிபார்க்கப்பட்டது",
    allSchemes: "அனைத்து திட்டங்கள்",
    schemeCountSingular: "திட்டம்",
    schemeCountPlural: "திட்டங்கள்",
    accessibilityTitle: "குடிமக்கள் அணுகல்தன்மை",
    accessibilitySubtitle: "அணுகல் மற்றும் உதவி தேர்வுகள்",
    textSizeLabel: "எழுத்து அளவு",
    highContrastLabel: "உயர் மாறுபட்ட பயன்முறை",
    highContrastDesc: "எளிதாக வாசிக்க உயர் மாறுபாடு",
    voiceReaderLabel: "திரை குரல் வாசிப்பான்",
    voiceReaderDesc: "குரல் மூலம் திட்டங்களை கேட்கவும்",
    voiceListen: "கேளுங்கள் 🔊",
    voiceStop: "நிறுத்து ⏹",
    selectLanguageLabel: "மொழியைத் தேர்ந்தெடுக்கவும்",
    resetAllSettings: "அனைத்தையும் மீட்டமை",
    applyAndClose: "செயல்படுத்தி மூடவும்",
    noMatchingSchemesFound: "உங்கள் தேடலுக்கு ஏற்ற திட்டங்கள் எதுவும் கிடைக்கவில்லை. கீழே உள்ள பொது நலத்திட்டங்களை சரிபார்க்கவும்!",
    unmatchedOccupationLogged: "பட்டியலிடப்படாத தொழில் பதிவு செய்யப்பட்டது:",
    unmatchedOccupationDesc: "தற்போது இந்த தொழிலுடன் நேரடியாக பொருந்தும் திட்டங்கள் எதுவும் இல்லை. எதிர்கால சேர்க்கைகளுக்காக இதை பதிவு செய்துள்ளோம். கீழே பொது நலத்திட்டங்களை காணவும்!"
  },
  te: {
    compulsoryEligibilityCheck: "తప్పనిసరి అర్హత తనిఖీ",
    compulsoryQuestionsFor: "పథకానికి తప్పనిసరి అర్హత ప్రశ్నలు",
    compulsoryQuestionsDesc: "దరఖాస్తు చేయడానికి ముందు మీ అర్హతను ధృవీకరించడానికి ఈ తప్పనిసరి ప్రశ్నలకు సమాధానం ఇవ్వండి:",
    answeredCountOf: "సమాధానమిచ్చారు",
    yesOption: "అవును (YES)",
    noOption: "కాదు (NO)",
    requirementVerified: "✓ నిబంధన పూర్తయింది: మీరు ఈ అర్హతను సంతృప్తిపరిచారు.",
    criterionUnmet: "✕ నిబంధన నెరవేరలేదు: దీని వలన మీరు ఈ పథకానికి అనర్హులు కావచ్చు.",
    congratsAllCriteriaMet: "🎉 అభినందనలు! మీరు ఈ పథకానికి 100% అర్హులు!",
    congratsAllCriteriaDesc: "మీరు అన్ని అధికారిక ప్రభుత్వ నిబంధనలను పూర్తి చేశారు. మీరు నేరుగా అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోవచ్చు.",
    proceedToOfficialPortal: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోండి",
    keepDocsReady: "దరఖాస్తు సమయంలో ఈ కింది పత్రాలను సిద్ధంగా ఉంచుకోండి:",
    mandatoryReqsNotMet: "ఈ పథకానికి అవసరమైన తప్పనిసరి నిబంధనలు నెరవేరలేదు",
    mandatoryReqsNotMetDesc: "తప్పనిసరి నిబంధనలు నెరవేరలేదు. చింతించకండి, మీరు ఇతర సాధారణ సంక్షేమ పథకాలకు అర్హులు కావచ్చు.",
    resetQuestions: "ప్రశ్నలను రీసెట్ చేయండి",
    documentsLabel: "పత్రాలు",
    verifiedDateLabel: "ధృవీకరించబడింది",
    allSchemes: "అన్ని పథకాలు",
    schemeCountSingular: "పథకం",
    schemeCountPlural: "పథకాలు",
    accessibilityTitle: "పౌర ప్రాప్యత",
    accessibilitySubtitle: "ప్రాప్యత మరియు సహాయ ఎంపికలు",
    textSizeLabel: "అక్షర పరిమాణం",
    highContrastLabel: "అధిక కాంట్రాస్ట్ మోడ్",
    highContrastDesc: "సులభంగా చదవడానికి కాంట్రాస్ట్",
    voiceReaderLabel: "స్క్రీన్ వాయిస్ రీడర్",
    voiceReaderDesc: "పథకాల వివరాలను వాయిస్ ద్వారా వినండి",
    voiceListen: "వినండి 🔊",
    voiceStop: "ఆపండి ⏹",
    selectLanguageLabel: "భాషను ఎంచుకోండి",
    resetAllSettings: "అన్నీ రీసెట్ చేయండి",
    applyAndClose: "వర్తింపజేసి మూసివేయండి",
    noMatchingSchemesFound: "మీ శోధనకు తగిన పథకాలు ఏవీ కనుగొనబడలేదు. దయచేసి క్రింద ఉన్న సాధారణ సంక్షేమ పథకాలను చూడండి!",
    unmatchedOccupationLogged: "జాబితాలో లేని వృత్తి నమోదు చేయబడింది:",
    unmatchedOccupationDesc: "ప్రస్తుతం ఈ వృత్తితో నేరుగా సరిపోయే పథకాలు లేవు. భవిష్యత్ నవీకరణల కోసం మేము దీన్ని నమోదు చేసాము. దిగువ సాధారణ సంక్షేమ పథకాలను చూడండి!"
  }
};

// 15 Sovereign Schemes Multilingual Data
const schemeTranslations = {
  'pm-kisan': {
    names: {
      en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      hi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)',
      mr: 'प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)',
      bn: 'প্রধানমন্ত্রী কিষাণ সম্মান নিধি (PM-KISAN)',
      ta: 'பிரதமர் கிசான் சம்மான் நிதி (PM-KISAN)',
      te: 'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి (PM-KISAN)'
    },
    benefits: {
      en: '₹6,000 per year directly to bank accounts of small/marginal farmer families in three 4-monthly installments.',
      hi: 'छोटे एवं सीमांत किसान परिवारों के बैंक खातों में प्रतिवर्ष ₹6,000 की वित्तीय सहायता (₹2,000 की तीन किस्तों में)।',
      mr: 'अल्प व अत्यल्प भूधारक शेतकरी कुटुंबांच्या बँक खात्यात दरवर्षी ₹6,000 (तीन समान हप्त्यांमध्ये).',
      bn: 'ক্ষুদ্র ও প্রান্তিক কৃষক পরিবারের ব্যাঙ্ক অ্যাকাউন্টে বছরে ₹৬,০০০ আর্থিক সহায়তা (তিনটি কিস্তিতে)।',
      ta: 'சிறு மற்றும் குறு விவசாய குடும்பங்களின் வங்கிக் கணக்கில் ஆண்டுக்கு ₹6,000 நேரடி உதவித்தொகை.',
      te: 'చిన్న, సన్నకారు రైతు కుటుంబాల బ్యాంక్ ఖాతాల్లో ఏడాదికి ₹6,000 ఆర్థిక సాయం (మూడు విడతల్లో).'
    }
  },
  'pmmsy': {
    names: {
      en: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
      hi: 'प्रधानमंत्री मत्स्य संपदा योजना (पीएमएमएसवाई)',
      mr: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
      bn: 'প্রধানমন্ত্রী মৎস্য সম্পদ যোজনা (PMMSY)',
      ta: 'பிரதமர் மத்ஸ்ய சம்பதா யோஜனா (PMMSY)',
      te: 'ప్రధాన మంత్రి మత్స్య సంపద యోజన (PMMSY)'
    },
    benefits: {
      en: 'Up to 60% capital subsidy for women/SC/ST fishermen and 40% for general categories for modern fishing boats, nets, aquaculture units, and cold chains.',
      hi: 'मछली पालन, नाव, जाल और कोल्ड चेन के लिए महिलाओं/एससी/एसटी को 60% तथा सामान्य वर्ग को 40% तक की सरकारी सब्सिडी।',
      mr: 'आधुनिक मासेमारी बोटी, जाळी आणि मत्स्यपालनासाठी महिला/अनुसूचीत जाती/जमातींना 60% आणि इतरांना 40% अनुदान.',
      bn: 'আধুনিক মাছ ধরার নৌকা, জাল ও মৎস্য চাষের জন্য মহিলা/SC/ST-দের ৬০% এবং সাধারণ বিভাগে ৪০% সরকারি অনুদান।',
      ta: 'நவீன மீன்பிடி படகுகள் மற்றும் மீன்வளர்ப்புக்கு பெண்கள்/SC/ST பிரிவினருக்கு 60% மற்றும் பொது பிரிவினருக்கு 40% மானியம்.',
      te: 'ఆధునిక చేపల వేట పడవలు, వలలు మరియు ఆక్వాకల్చర్ కోసం మహిళలు/SC/ST లకు 60%, ఇతరులకు 40% రాయితీ.'
    }
  },
  'post-matric-scholarship': {
    names: {
      en: 'Post-Matric Scholarship Scheme for SC/ST/OBC Students',
      hi: 'अनुसूचित जाति/जनजाति/ओबीसी छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
      mr: 'SC/ST/OBC विद्यार्थ्यांसाठी मॅट्रिकोत्तर शिष्यवृत्ती योजना',
      bn: 'SC/ST/OBC শিক্ষার্থীদের জন্য পোস্ট-ম্যাট্রিক স্কলারশিপ',
      ta: 'SC/ST/OBC மாணவர்களுக்கான மெட்ரிக் பிந்தைய கல்வி உதவித்தொகை',
      te: 'SC/ST/OBC విద్యార్థుల కోసం పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ పథకం'
    },
    benefits: {
      en: 'Full tuition fee reimbursement and up to ₹13,500 annual maintenance allowance for post-matriculation courses.',
      hi: '10वीं के बाद उच्च शिक्षा के लिए पूरी ट्यूशन फीस की प्रतिपूर्ति और ₹13,500 तक का वार्षिक भरण-पोषण भत्ता।',
      mr: 'मॅट्रिकनंतरच्या शिक्षणासाठी संपूर्ण शिक्षण शुल्क माफी आणि ₹13,500 पर्यंत वार्षिक निर्वाह भत्ता.',
      bn: 'উচ্চশিক্ষার জন্য সম্পূর্ণ টিউশন ফি মকুব এবং বছরে ₹১৩,৫০০ পর্যন্ত রক্ষণাবেক্ষণ ভাতা।',
      ta: 'உயர்கல்விக்கான முழு கல்விக் கட்டண தள்ளுபடி மற்றும் ஆண்டுக்கு ₹13,500 வரை பராமரிப்பு உதவித்தொகை.',
      te: 'ఉన్నత విద్య కోసం పూర్తి ట్యూషన్ ఫీజు రీయింబర్స్‌మెంట్ మరియు ఏడాదికి ₹13,500 వరకు నిర్వహణ భత్యం.'
    }
  },
  'pm-yasasvi': {
    names: {
      en: 'PM Young Achievers Scholarship Award Scheme (PM-YASASVI)',
      hi: 'पीएम यंग अचीवर्स स्कॉलरशिप अवार्ड योजना (पीएम-यशस्वी)',
      mr: 'पीएम यशस्वी शिष्यवृत्ती योजना (PM-YASASVI)',
      bn: 'প্রধানমন্ত্রী যশস্বী স্কলারশিপ যোজনা (PM-YASASVI)',
      ta: 'பிரதமர் யசஸ்வி கல்வி உதவித்தொகை திட்டம் (PM-YASASVI)',
      te: 'పీఎం యశస్వి స్కాలర్‌షిప్ పథకం (PM-YASASVI)'
    },
    benefits: {
      en: '₹75,000/yr for Class 9–10 and ₹1,25,000/yr for Class 11–12 students studying in identified Top Class Schools.',
      hi: 'कक्षा 9-10 के लिए ₹75,000/वर्ष तथा कक्षा 11-12 के छात्रों के लिए ₹1,25,000/वर्ष की छात्रवृत्ति।',
      mr: 'इयत्ता 9वी-10वी साठी ₹75,000/वर्ष आणि 11वी-12वी च्या विद्यार्थ्यांसाठी ₹1,25,000/वर्ष शिष्यवृत्ती.',
      bn: '৯ম-১০ম শ্রেণীর জন্য বছরে ₹৭৫,০০০ এবং ১১শ-১২শ শ্রেণীর শিক্ষার্থীদের জন্য বছরে ₹১,২৫,০০০ বৃত্তি।',
      ta: '9-10 ஆம் வகுப்பு மாணவர்களுக்கு ₹75,000/ஆண்டு மற்றும் 11-12 ஆம் வகுப்பு மாணவர்களுக்கு ₹1,25,000/ஆண்டு உதவித்தொகை.',
      te: '9-10 తరగతుల విద్యార్థులకు ఏడాదికి ₹75,000 మరియు 11-12 తరగతులకు ₹1,25,000 స్కాలర్‌షిప్.'
    }
  },
  'national-award-teachers': {
    names: {
      en: 'National Awards to Teachers',
      hi: 'शिक्षकों के लिए राष्ट्रीय पुरस्कार योजना',
      mr: 'शिक्षकांसाठी राष्ट्रीय पुरस्कार योजना',
      bn: 'শিক্ষকদের জন্য জাতীয় পুরস্কার প্রকল্প',
      ta: 'ஆசிரியர்களுக்கான தேசிய விருது திட்டம்',
      te: 'ఉపాధ్యాయులకు జాతీయ పురస్కారాల పథకం'
    },
    benefits: {
      en: 'Certificate of Merit, Silver Medal, and cash award of ₹50,000 for meritorious school teachers by the President of India.',
      hi: 'उत्कृष्ट शिक्षकों को भारत के राष्ट्रपति द्वारा प्रशस्ति पत्र, रजत पदक और ₹50,000 का नकद पुरस्कार।',
      mr: 'उत्कृष्ट शिक्षकांना भारताच्या राष्ट्रपतींच्या हस्ते गुणवत्ता प्रमाणपत्र, रौप्य पदक आणि ₹50,000 रोख पुरस्कार.',
      bn: 'ভারতের রাষ্ট্রপতির দ্বারা প্রশংসাপত্র, রৌপ্য পদক এবং ₹৫০,০০০ নগদ পুরস্কার।',
      ta: 'இந்திய குடியரசுத் தலைவரால் பாராட்டுச் சான்றிதழ், வெள்ளிப் பதக்கம் மற்றும் ₹50,000 ரொக்கப் பரிசு.',
      te: 'భారత రాష్ట్రపతి చేతుల మీదుగా ప్రశంసా పత్రం, రజత పతకం మరియు ₹50,000 నగదు పురస్కారం.'
    }
  },
  'cghs': {
    names: {
      en: 'Central Government Health Scheme (CGHS)',
      hi: 'केंद्रीय सरकार स्वास्थ्य योजना (सीजीएचएस)',
      mr: 'केंद्रीय सरकार आरोग्य योजना (CGHS)',
      bn: 'সেন্ট্রাল গভর্নমেন্ট হেলথ স্কিম (CGHS)',
      ta: 'மத்திய அரசு சுகாதாரத் திட்டம் (CGHS)',
      te: 'కేంద్ర ప్రభుత్వ ఆరోగ్య పథకం (CGHS)'
    },
    benefits: {
      en: 'Comprehensive cashless healthcare, OPD consultations, medicines, and indoor treatment in empanelled hospitals.',
      hi: 'केंद्र सरकार के कर्मचारियों और पेंशनभोगियों के लिए सूचीबद्ध अस्पतालों में कैशलेस स्वास्थ्य सेवाएं, ओपीडी और दवाएं।',
      mr: 'केंद्र सरकारी कर्मचारी आणि निवृत्तीवेतनधारकांसाठी पॅनेलवरील रुग्णालयांमध्ये मोफत आरोग्य उपचार आणि औषधे.',
      bn: 'কেন্দ্রীয় সরকারি কর্মচারী ও পেনশনভোগীদের জন্য তালিকাভুক্ত হাসপাতালে সম্পূর্ণ ক্যাশলেস চিকিৎসা পরিষেবা।',
      ta: 'பட்டியலிடப்பட்ட மருத்துவமனைகளில் பணமில்லா விரிவான மருத்துவ சிகிச்சை, மருந்துகள் மற்றும் ஆலோசனைகள்.',
      te: 'కేంద్ర ప్రభుత్వ ఉద్యోగులు మరియు పెన్షనర్లకు నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత నగదు రహిత చికిత్స మరియు మందులు.'
    }
  },
  'pm-svanidhi': {
    names: {
      en: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
      hi: 'पीएम स्ट्रीट वेंडर्स आत्मनिर्भर निधि (पीएम स्वनिधि)',
      mr: 'पीएम पथविक्रेता आत्मनिर्भर निधी (पीएम स्वनिधी)',
      bn: 'প্রধানমন্ত্রী স্ট্রিট ভেন্ডরস আত্মনির্ভর নিধি (পিএম স্বনিধি)',
      ta: 'பிரதமர் சாலையோர வியாபாரிகள் ஆத்மநிர்பார் நிதி (PM SVANidhi)',
      te: 'పీఎం వీధి వ్యాపారుల ఆత్మనిర్భర్ నిధి (పీఎం స్వనిధి)'
    },
    benefits: {
      en: 'Collateral-free working capital loan: ₹10,000 (1st tranche), ₹20,000 (2nd), ₹50,000 (3rd) with 7% interest subsidy and UPI cashback.',
      hi: 'शहरी रेहड़ी-पटरी विक्रेताओं के लिए बिना गारंटी का ऋण: ₹10,000, ₹20,000 व ₹50,000 तथा 7% ब्याज सब्सिडी व डिजिटल कैशबैक।',
      mr: 'पथविक्रेत्यांसाठी विनातारण कर्ज: ₹10,000, ₹20,000 आणि ₹50,000 सोबत 7% व्याज अनुदान व कॅशबॅक.',
      bn: 'হকার ও ক্ষুদ্র ব্যবসায়ীদের জন্য জামানতবিহীন ঋণ: ₹১০,০০০, ₹২০,০০০ এবং ₹৫০,০০০ সঙ্গে ৭% সুদ ভর্তুকি।',
      ta: 'சாலையோர வியாபாரிகளுக்கு பிணையில்லா கடன்: ₹10,000, ₹20,000 மற்றும் ₹50,000 உடன் 7% வட்டி மானியம்.',
      te: 'వీధి వ్యాపారులకు పూచీకత్తు లేని రుణం: ₹10,000, ₹20,000 మరియు ₹50,000 తో పాటు 7% వడ్డీ రాయితీ.'
    }
  },
  'pm-mudra': {
    names: {
      en: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      hi: 'प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)',
      mr: 'प्रधानमंत्री मुद्रा योजना (PMMY)',
      bn: 'প্রধানমন্ত্রী মুদ্রা যোজনা (PMMY)',
      ta: 'பிரதமர் முத்ரா திட்டம் (PMMY)',
      te: 'ప్రధాన మంత్రి ముద్ర యోజన (PMMY)'
    },
    benefits: {
      en: 'Collateral-free micro loans up to ₹20 Lakhs across Shishu (up to ₹50k), Kishore (₹50k–₹5L), Tarun (₹5L–₹10L), and Tarun Plus (₹10L–₹20L).',
      hi: 'गैर-कृषि छोटे व्यवसायों के लिए बिना गारंटी का ऋण: शिशु (₹50 हजार तक), किशोर (₹5 लाख तक) और तरुण (₹20 लाख तक)।',
      mr: 'लघु उद्योगांसाठी विनातारण कर्ज: शिशु (₹50 हजार), किशोर (₹5 लाख) आणि तरुण (₹20 लाख पर्यंत).',
      bn: 'ক্ষুদ্র ব্যবসার জন্য জামানতবিহীন ঋণ: শিশু (₹৫০ হাজার), কিশোর (₹৫ লাখ) এবং তরুণ (₹২০ লাখ পর্যন্ত)।',
      ta: 'சிறு வணிகங்களுக்கு பிணையில்லா கடன்: சிசு (₹50,000 வரை), கிஷோர் (₹5 லட்சம் வரை) மற்றும் தருண் (₹20 லட்சம் வரை).',
      te: 'చిన్న వ్యాపారాలకు పూచీకత్తు లేని రుణం: శిశు (₹50 వేల వరకు), కిషోర్ (₹5 లక్షల వరకు), తరుణ్ (₹20 లక్షల వరకు).'
    }
  },
  'pm-sym': {
    names: {
      en: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)',
      hi: 'प्रधानमंत्री श्रम योगी मान-धन योजना (पीएम-एसवाईएम)',
      mr: 'प्रधानमंत्री श्रम योगी मानधन योजना (PM-SYM)',
      bn: 'প্রধানমন্ত্রী শ্রম যোগী মান-ধন যোজনা (PM-SYM)',
      ta: 'பிரதமர் ஷ்ரம் யோகி மான்-தன் திட்டம் (PM-SYM)',
      te: 'ప్రధాన మంత్రి శ్రమ యోగి మాన్-ధన్ పథకం (PM-SYM)'
    },
    benefits: {
      en: 'Guaranteed minimum monthly pension of ₹3,000 after age 60 with 50% matching Central Government contribution.',
      hi: 'असंगठित श्रमिकों को 60 वर्ष की आयु के बाद ₹3,000 प्रतिमाह सुनिश्चित पेंशन, 50% सरकारी अंशदान के साथ।',
      mr: 'असंघटित कामगारांना वयाच्या 60 नंतर दरमहा ₹3,000 हमी निवृत्तीवेतन, 50% सरकारी योगदानासह.',
      bn: 'অসংগঠিত শ্রমিকদের ৬০ বছর বয়সের পর প্রতি মাসে নিশ্চিত ₹৩,০০০ পেনশন, ৫০% সরকারি অনুদান সহ।',
      ta: 'அமைப்புசாரா தொழிலாளர்களுக்கு 60 வயதிற்குப் பிறகு மாதம் ₹3,000 உறுதிசெய்யப்பட்ட ஓய்வூதியம்.',
      te: 'అసంఘటిత కార్మికులకు 60 ఏళ్ల తర్వాత నెలకు ₹3,000 హామీతో కూడిన పెన్షన్.'
    }
  },
  'atal-pension-yojana': {
    names: {
      en: 'Atal Pension Yojana (APY)',
      hi: 'अटल पेंशन योजना (एपीवाई)',
      mr: 'अटल पेन्शन योजना (APY)',
      bn: 'অটল পেনশন যোজনা (APY)',
      ta: 'அடல் பென்ஷன் திட்டம் (APY)',
      te: 'అటల్ పెన్షన్ యోజన (APY)'
    },
    benefits: {
      en: 'Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000 or ₹5,000 from age 60 with nominee corpus return.',
      hi: '60 वर्ष की आयु से ₹1,000 से ₹5,000 तक की मासिक सुनिश्चित पेंशन तथा जीवनसाथी व नॉमिनी को कॉर्पस वापसी।',
      mr: 'वयाच्या 60 वर्षांनंतर ₹1,000 ते ₹5,000 मासिक निश्चित निवृत्तीवेतन आणि वारसदारास संपूर्ण निधी परतावा.',
      bn: '৬০ বছর বয়স থেকে প্রতি মাসে ₹১,০০০ থেকে ₹৫,০০০ নিশ্চিত পেনশন এবং নমিনিকে মোট সঞ্চয় ফেরত।',
      ta: '60 வயதிற்குப் பிறகு மாதம் ₹1,000 முதல் ₹5,000 வரை உத்தரவாத ஓய்வூதியம் மற்றும் வாரிசுக்கு நிதி பாதுகாப்பு.',
      te: '60 ఏళ్ల తర్వాత నెలకు ₹1,000 నుండి ₹5,000 వరకు ఖచ్చితమైన పెన్షన్ మరియు నామినీకి మొత్తం నిధి వాపసు.'
    }
  },
  'ignoaps-pension': {
    names: {
      en: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
      hi: 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना (इग्नोप्स)',
      mr: 'इंदिरा गांधी राष्ट्रीय वृद्धापकाळ निवृत्तीवेतन योजना (IGNOAPS)',
      bn: 'ইন্দিরা গান্ধী জাতীয় বার্ধক্য পেনশন প্রকল্প (IGNOAPS)',
      ta: 'இந்திரா காந்தி தேசிய முதியோர் ஓய்வூதியத் திட்டம் (IGNOAPS)',
      te: 'ఇందిరా గాంధీ జాతీయ వృద్ధాప్య పెన్షన్ పథకం (IGNOAPS)'
    },
    benefits: {
      en: 'Direct monthly pension for BPL senior citizens (₹200–₹500/mo Central share + State top-up up to ₹2,500/mo).',
      hi: 'गरीबी रेखा से नीचे (BPL) के 60 वर्ष या उससे अधिक आयु के वरिष्ठ नागरिकों को मासिक वृद्धावस्था पेंशन।',
      mr: 'दारिद्र्यरेषेखालील (BPL) 60 वर्षे किंवा त्याहून अधिक वयाच्या ज्येष्ठ नागरिकांना मासिक निवृत्तीवेतन.',
      bn: 'দারিদ্র্যসীমার নিচে থাকা ৬০ বছর বা তার বেশি বয়সী প্রবীণ নাগরিকদের জন্য মাসিক পেনশন।',
      ta: 'வறுமைக் கோட்டிற்கு கீழ் உள்ள 60 வயதுக்கு மேற்பட்ட மூத்த குடிமக்களுக்கு மாதாந்திர ஓய்வூதியம்.',
      te: 'దారిద్య్రరేఖకు దిగువన ఉన్న 60 ఏళ్లు పైబడిన వృద్ధులకు నెలవారీ వృద్ధాప్య పెన్షన్.'
    }
  },
  'adip-divyangjan': {
    names: {
      en: 'Assistance to Disabled Persons for Purchase/Fitting of Aids (ADIP)',
      hi: 'दिव्यांगजनों को सहायक उपकरण वितरण योजना (एडिप)',
      mr: 'दिव्यांगांसाठी सहाय्यक उपकरणे खरेदी योजना (ADIP)',
      bn: 'প্রতিবন্ধী ব্যক্তিদের সহায়ক সরঞ্জাম বিতরণ প্রকল্প (ADIP)',
      ta: 'மாற்றுத்திறனாளிகளுக்கான உதவி உபகரணங்கள் திட்டம் (ADIP)',
      te: 'దివ్యాంగుల సహాయ పరికరాల పంపిణీ పథకం (ADIP)'
    },
    benefits: {
      en: '100% free motorized tricycles, wheelchairs, smart hearing aids, braille kits, and artificial limbs for Divyangjan.',
      hi: 'दिव्यांगजनों को मोटराइज्ड ट्राइसाइकिल, व्हीलचेयर, डिजिटल हियरिंग एड और कृत्रिम अंग 100% मुफ्त प्रदान करना।',
      mr: 'दिव्यांग व्यक्तींना मोटराइज्ड ट्रायसायकल, व्हीलचेअर, श्रवणयंत्र आणि कृत्रिम अवयव 100% मोफत वाटप.',
      bn: 'প্রতিবন্ধী ব্যক্তিদের জন্য ১০০% বিনামূল্যে ট্রাইসাইকেল, হুইলচেয়ার, শ্রবণযন্ত্র এবং কৃত্রিম অঙ্গ প্রদান।',
      ta: 'மாற்றுத்திறனாளிகளுக்கு 100% இலவச மோட்டார் பொருத்தப்பட்ட மூன்று சக்கர வண்டிகள், சக்கர நாற்காலிகள் மற்றும் செயற்கை கால்கள்.',
      te: 'దివ్యాంగులకు 100% ఉచితంగా మోటరైజ్డ్ ట్రైసైకిళ్ళు, వీల్‌చైర్లు, వినికిడి పరికరాలు మరియు కృత్రిమ అవయవాలు.'
    }
  },
  'pmegp': {
    names: {
      en: "Prime Minister's Employment Generation Programme (PMEGP)",
      hi: 'प्रधानमंत्री रोजगार सृजन कार्यक्रम (पीएमईजीपी)',
      mr: 'पंतप्रधान रोजगार निर्मिती कार्यक्रम (PMEGP)',
      bn: 'প্রধানমন্ত্রী কর্মসংস্থান সৃষ্টি কর্মসূচি (PMEGP)',
      ta: 'பிரதமரின் வேலைவாய்ப்பு உருவாக்கும் திட்டம் (PMEGP)',
      te: 'ప్రధాన మంత్రి ఉపాధి కల్పన కార్యక్రమం (PMEGP)'
    },
    benefits: {
      en: 'Bank-financed subsidy of 15% to 35% for projects up to ₹50 Lakhs (manufacturing) and ₹20 Lakhs (services).',
      hi: 'विनिर्माण (₹50 लाख तक) और सेवा उद्योग (₹20 लाख तक) शुरू करने के लिए 15% से 35% तक की सरकारी सब्सिडी।',
      mr: 'उत्पादन आणि सेवा क्षेत्रात नवीन व्यवसाय सुरू करण्यासाठी 15% ते 35% पर्यंत सरकारी भांडवली अनुदान.',
      bn: 'নতুন ব্যবসা ও শিল্প স্থাপনের জন্য ১৫% থেকে ৩৫% পর্যন্ত সরকারি ভর্তুকি (উৎপাদনে ₹৫০ লাখ পর্যন্ত)।',
      ta: 'உற்பத்தி மற்றும் சேவை திட்டங்களுக்கு 15% முதல் 35% வரை அரசு மானியத்துடன் கூடிய வங்கி கடன் உதவி.',
      te: 'కొత్త వ్యాపారాలు, సూక్ష్మ పరిశ్రమలు స్థాపించడానికి 15% నుండి 35% వరకు ప్రభుత్వ రాయితీ.'
    }
  },
  'echs-defence': {
    names: {
      en: 'Ex-Servicemen Contributory Health Scheme (ECHS)',
      hi: 'भूतपूर्व सैनिक अंशदायी स्वास्थ्य योजना (ईसीएचएस)',
      mr: 'माजी सैनिक अंशदायी आरोग्य योजना (ECHS)',
      bn: 'প্রাক্তন সৈনিক অংশীদারি স্বাস্থ্য প্রকল্প (ECHS)',
      ta: 'முன்னாள் படைவீரர் பங்களிப்பு சுகாதாரத் திட்டம் (ECHS)',
      te: 'మాజీ సైనికుల భాగస్వామ్య ఆరోగ్య పథకం (ECHS)'
    },
    benefits: {
      en: 'Comprehensive cashless healthcare coverage for Ex-Servicemen and their eligible dependents across armed forces and empanelled private hospitals.',
      hi: 'भूतपूर्व सैनिकों और उनके आश्रितों के लिए सैन्य तथा निजी सूचीबद्ध अस्पतालों में 100% कैशलेस चिकित्सा सुविधा।',
      mr: 'माजी सैनिक आणि त्यांच्या कुटुंबीयांसाठी पॅनेलवरील रुग्णालयांमध्ये संपूर्ण मोफत कॅशलेस वैद्यकीय उपचार.',
      bn: 'প্রাক্তন সৈনিক ও তাদের পরিবারের জন্য তালিকাভুক্ত হাসপাতালে সম্পূর্ণ ক্যাশলেস চিকিৎসা পরিষেবা।',
      ta: 'முன்னாள் படைவீரர்கள் மற்றும் அவர்களைச் சார்ந்தவர்களுக்கு விரிவான பணமில்லா மருத்துவ சிகிச்சை வசதி.',
      te: 'మాజీ సైనికులు మరియు వారి కుటుంబ సభ్యులకు నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత నగదు రహిత వైద్య చికిత్స.'
    }
  },
  'ab-pmjay': {
    names: {
      en: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
      hi: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (एबी-पीएमजेएवाई)',
      mr: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)',
      bn: 'আয়ুষ্মান ভারত প্রধানমন্ত্রী জন আরোগ্য যোজনা (AB-PMJAY)',
      ta: 'ஆயுஷ்மான் பாரத் பிரதமர் மக்கள் ஆரோக்கிய திட்டம் (AB-PMJAY)',
      te: 'ఆయుష్మాన్ భారత్ ప్రధాన మంత్రి జన్ ఆరోగ్య యోజన (AB-PMJAY)'
    },
    benefits: {
      en: 'Universal cashless health cover of ₹5,00,000 per family per year, with universal coverage for all senior citizens aged 70+ regardless of income.',
      hi: 'प्रति परिवार प्रति वर्ष ₹5,00,000 तक का मुफ्त स्वास्थ्य उपचार, तथा 70 वर्ष से अधिक उम्र के सभी वरिष्ठ नागरिकों को आय सीमा के बिना स्वास्थ्य कवर।',
      mr: 'दरवर्षी प्रति कुटुंब ₹5,00,000 पर्यंत मोफत कॅशलेस आरोग्य संरक्षण, 70 वर्षांवरील सर्व ज्येष्ठ नागरिकांसाठी सार्वत्रिक संरक्षण.',
      bn: 'প্রতি পরিবারে বছরে ₹৫,০০,০০০ পর্যন্ত সম্পূর্ণ বিনামূল্যে চিকিৎসা এবং ৭০+ প্রবীণদের জন্য কোনো আয়সীমা ছাড়াই বিনামূল্যে স্বাস্থ্য কভার।',
      ta: 'குடும்பத்திற்கு ஆண்டுக்கு ₹5,00,000 வரை இலவச மருத்துவ சிகிச்சை, 70 வயதுக்கு மேற்பட்ட அனைத்து முதியவர்களுக்கும் வருமான வரம்பற்ற பாதுகாப்பு.',
      te: 'ప్రతి కుటుంబానికి ఏడాదికి ₹5,00,000 వరకు ఉచిత నగదు రహిత చికిత్స మరియు 70 ఏళ్లు పైబడిన వృద్ధులందరికీ ఆదాయ పరిమితి లేని ఉచిత బీమా.'
    }
  }
};

// Insert SCHEME_TRANSLATIONS before TRANSLATIONS export
const schemeTranslationsCode = `
export const SCHEME_TRANSLATIONS: Record<string, { names: Record<SupportedLanguage, string>; benefits: Record<SupportedLanguage, string> }> = ${JSON.stringify(schemeTranslations, null, 2)};

export function getTranslatedSchemeName(schemeId: string, defaultName: string, lang: SupportedLanguage): string {
  if (SCHEME_TRANSLATIONS[schemeId] && SCHEME_TRANSLATIONS[schemeId].names[lang]) {
    return SCHEME_TRANSLATIONS[schemeId].names[lang];
  }
  return defaultName;
}

export function getTranslatedSchemeBenefit(schemeId: string, defaultBenefit: string, lang: SupportedLanguage): string {
  if (SCHEME_TRANSLATIONS[schemeId] && SCHEME_TRANSLATIONS[schemeId].benefits[lang]) {
    return SCHEME_TRANSLATIONS[schemeId].benefits[lang];
  }
  return defaultBenefit;
}
`;

// Insert the scheme translations right before `export const TRANSLATIONS`
content = content.replace('export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {', schemeTranslationsCode + '\nexport const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {');

// Now inject additionalKeys into each language dictionary in content
for (const [lang, keys] of Object.entries(additionalKeys)) {
  const langKeyIndex = content.indexOf(`  ${lang}: {`);
  if (langKeyIndex !== -1) {
    let keyLines = '\n';
    for (const [k, v] of Object.entries(keys)) {
      keyLines += `    ${k}: ${JSON.stringify(v)},\n`;
    }
    content = content.slice(0, langKeyIndex + `  ${lang}: {`.length) + keyLines + content.slice(langKeyIndex + `  ${lang}: {`.length);
  }
}

fs.writeFileSync(translationsFile, content, 'utf8');
console.log('Successfully updated translations.ts with all additional multilingual strings and SCHEME_TRANSLATIONS!');
