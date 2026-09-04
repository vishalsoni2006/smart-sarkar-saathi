import { VERIFIED_SCHEMES } from '../src/data/schemes.ts';
import { evaluateEligibility } from '../src/lib/rule-engine/evaluator.ts';
import { calculateOccupationFuzzyScore, rankSchemesForUser } from '../src/lib/rule-engine/ranking.ts';
import { DEMO_PERSONAS } from '../src/data/taxonomy.ts';

console.log('================================================================');
console.log('🇮🇳 SCHEME NAVIGATOR — DETERMINISTIC RULE ENGINE VERIFICATION TEST');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`);
  }
}

// 1. Verify Dataset Count
assert(VERIFIED_SCHEMES.length === 15, 'Corpus contains exactly 15 verified schemes');

// 2. Test PM-KISAN with Ramesh Kumar (Farmer, 3 acres, ₹1.4L)
const pmKisan = VERIFIED_SCHEMES.find((s) => s.id === 'pm-kisan');
const ramesh = DEMO_PERSONAS.find((p) => p.id === 'demo-farmer').profile;
const rameshVerdict = evaluateEligibility(pmKisan, ramesh);
assert(rameshVerdict.status === 'ELIGIBLE', 'PM-KISAN: Ramesh Kumar is ELIGIBLE');
assert(rameshVerdict.confidence_score === 100, 'PM-KISAN: Ramesh Kumar has 100% confidence');

// 3. Test PM-KISAN with Over-limit Landholder (6 acres)
const largeFarmer = {
  ...ramesh,
  land_holding_acres: 6
};
const largeFarmerVerdict = evaluateEligibility(pmKisan, largeFarmer);
assert(largeFarmerVerdict.status === 'NOT_ELIGIBLE', 'PM-KISAN: Farmer with 6 acres is NOT_ELIGIBLE (exceeds 5 acre cap)');

// 4. Test "Needs More Info" with Anil Deshmukh (Land unknown)
const anil = DEMO_PERSONAS.find((p) => p.id === 'demo-needs-info').profile;
const anilVerdict = evaluateEligibility(pmKisan, anil);
assert(anilVerdict.status === 'NEEDS_MORE_INFO', 'PM-KISAN: Anil Deshmukh is correctly flagged as NEEDS_MORE_INFO');
assert(anilVerdict.target_followup_field === 'land_holding_acres', 'PM-KISAN: Target follow-up field is land_holding_acres');

// 5. Test Live Flip: When Anil reports 2.5 acres, verdict becomes ELIGIBLE!
const anilUpdated = {
  ...anil,
  land_holding_acres: 2.5,
  special_conditions: [...anil.special_conditions, 'has_land']
};
const anilUpdatedVerdict = evaluateEligibility(pmKisan, anilUpdated);
assert(anilUpdatedVerdict.status === 'ELIGIBLE', 'PM-KISAN: Live Flip successfully turns Anil to ELIGIBLE once land size is provided');

// 6. Test Post-Matric Scholarship with Priya Sharma (Student, OBC, ₹1.8L)
const postMatric = VERIFIED_SCHEMES.find((s) => s.id === 'post-matric-scholarship');
const priya = DEMO_PERSONAS.find((p) => p.id === 'demo-student').profile;
const priyaVerdict = evaluateEligibility(postMatric, priya);
assert(priyaVerdict.status === 'ELIGIBLE', 'Post-Matric: Priya Sharma is ELIGIBLE');

// 7. Test PM-SVANidhi with Sunita Devi (Street Vendor)
const svanidhi = VERIFIED_SCHEMES.find((s) => s.id === 'pm-svanidhi');
const sunita = DEMO_PERSONAS.find((p) => p.id === 'demo-vendor').profile;
const sunitaVerdict = evaluateEligibility(svanidhi, sunita);
assert(sunitaVerdict.status === 'ELIGIBLE', 'PM-SVANidhi: Sunita Devi is ELIGIBLE');

// 8. Test IGNOAPS Old Age Pension with Bhimrao Gaikwad (Senior Citizen, 68 yrs, BPL)
const ignoaps = VERIFIED_SCHEMES.find((s) => s.id === 'ignoaps-pension');
const bhimrao = DEMO_PERSONAS.find((p) => p.id === 'demo-senior').profile;
const bhimraoVerdict = evaluateEligibility(ignoaps, bhimrao);
assert(bhimraoVerdict.status === 'ELIGIBLE', 'IGNOAPS: Bhimrao Gaikwad is ELIGIBLE');

// 9. Test Ayushman Bharat (AB-PMJAY) Universal Senior Citizen Coverage
const abPmjay = VERIFIED_SCHEMES.find((s) => s.id === 'ab-pmjay');
const seniorUniversalVerdict = evaluateEligibility(abPmjay, bhimrao);
assert(seniorUniversalVerdict.status === 'ELIGIBLE', 'AB-PMJAY: Universal Healthcare cover is ELIGIBLE for Senior Citizen');

// 10. Test Fuzzy Matching for "Other" occupation
const autoDriverScore = calculateOccupationFuzzyScore('auto rickshaw driver', [
  'unorganized worker',
  'driver',
  'daily wager',
  'coolie'
]);
assert(autoDriverScore >= 0.7, 'Fuzzy Matching: "auto rickshaw driver" matches driver tags with score >= 0.7');

// 11. Test Ranking Engine
const rankings = rankSchemesForUser(ramesh, VERIFIED_SCHEMES);
assert(rankings.topRecommendations.length > 0, 'Ranking: Top recommendations populated');
assert(rankings.topRecommendations[0].scheme.id === 'pm-kisan', 'Ranking: PM-KISAN ranks #1 for Farmer persona');

console.log(`\n================================================================`);
console.log(`Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`================================================================\n`);
