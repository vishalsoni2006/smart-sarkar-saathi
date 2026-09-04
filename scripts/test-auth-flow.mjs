import {
  registerCitizen,
  loginCitizen,
  getRegisteredUsersLocally
} from '../src/lib/firebase/auth';
import { getOccupationQuestionSet, OCCUPATION_QUESTION_SETS } from '../src/data/occupation-questions';

async function runAuthTests() {
  console.log('================================================================');
  console.log('🧪 SCHEME NAVIGATOR — CITIZEN AUTH & OCCUPATION QUESTION TEST');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Test 1: Direct login with unregistered user MUST fail with explicit error
  console.log('Test 1: Unregistered citizen login check...');
  const unregResult = await loginCitizen('random_unknown_citizen_999@gov.in', 'somepass');
  assert(!unregResult.success, 'Unregistered user cannot log in directly');
  assert(
    unregResult.error && unregResult.error.includes('Not registered or invalid credentials'),
    `Correct error displayed: "${unregResult.error}"`
  );

  // Test 2: Register a new citizen
  console.log('\nTest 2: Citizen registration...');
  const newEmail = `test_farmer_${Date.now()}@gov.in`;
  const regResult = await registerCitizen({
    identifier: newEmail,
    password: 'securePassword123',
    name: 'Balwinder Singh',
    age: 48,
    gender: 'male',
    state: 'Punjab',
    occupation: 'farmer',
    annual_income: 180000,
    category: 'general',
    land_holding_acres: 4.2
  });

  assert(regResult.success, 'Citizen registration succeeded');
  assert(regResult.user && regResult.user.identifier === newEmail, 'User identifier saved correctly');
  assert(regResult.profile && regResult.profile.name === 'Balwinder Singh', 'Citizen profile created with name');
  assert(regResult.profile.land_holding_acres === 4.2, 'Landholding saved on profile');
  assert(regResult.profile.special_conditions.includes('has_land'), 'has_land special condition set automatically');

  // Test 3: Log in with the newly registered citizen
  console.log('\nTest 3: Logging in with the newly registered citizen...');
  const loginResult = await loginCitizen(newEmail, 'securePassword123');
  assert(loginResult.success, 'Login succeeded for newly registered citizen');
  assert(loginResult.user && loginResult.user.name === 'Balwinder Singh', 'User profile retrieved successfully on login');

  // Test 4: Wrong password check
  console.log('\nTest 4: Wrong password check...');
  const wrongPassResult = await loginCitizen(newEmail, 'wrongPasswordXYZ');
  assert(!wrongPassResult.success, 'Wrong password rejected');
  assert(
    wrongPassResult.error && wrongPassResult.error.includes('Not registered or invalid credentials'),
    'Not registered or invalid credentials error returned on password mismatch'
  );

  // Test 5: Verify occupation question sets
  console.log('\nTest 5: Occupation Question Sets Verification...');
  const occupations = ['farmer', 'student', 'street_vendor', 'senior_citizen', 'unorganized_worker', 'entrepreneur'];
  occupations.forEach((occ) => {
    const qSet = getOccupationQuestionSet(occ);
    assert(qSet && qSet.questions.length > 0, `Occupation questions loaded for ${occ} (${qSet.questions.length} questions)`);
  });

  console.log('\n================================================================');
  console.log(`Results: ${passed} passed, ${failed} failed (${Math.round((passed / (passed + failed)) * 100)}%)`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

runAuthTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
