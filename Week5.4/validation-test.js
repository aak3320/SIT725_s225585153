/**
 * SIT725 – 5.4D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3001";
const API_BASE = "/api/books";
 
// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================
 
const results = [];
 
const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};
 
// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================
 
function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}
 
function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}
 
function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}
 
function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}
 
// =============================
// HTTP HELPER
// =============================
 
async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
 
  const text = await res.text();
  return { status: res.status, text };
}
 
// =============================
// TEST REGISTRATION FUNCTION
// =============================
 
async function test({ id, name, method, path, expected, body, tags }) {
 
  const { status } = await http(method, path, body);
  const pass = status === expected;
 
  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);
 
  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];
 
  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}
 
// =============================
// STUDENT MUST MODIFY THESE
// =============================

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: "2020",
    genre: "Other",
    summary: "Valid summary text that satisfies your rules.",
    price: "9.99"
  };
}
 
function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: "2021",
    genre: "Other",
    summary: "Updated summary text.",
    price: "10.50"
  };
}
 
// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================
 
async function run() {
 
  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);
 
  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;
 
  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });
 
  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });
 
  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });
 
  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });
 
  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });
 
  // =====================================
  // ADDITIONAL TESTS
  // =====================================
 
  // ---- T06 REQUIRED (Missing title on CREATE) ----
  await test({
    id: "T06",
    name: "Missing title on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => { const b = makeValidBook(`b${Date.now()+2}`); delete b.title; return b; })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });
 
  // ---- T07 REQUIRED (Missing author on CREATE) ----
  await test({
    id: "T07",
    name: "Missing author on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => { const b = makeValidBook(`b${Date.now()+3}`); delete b.author; return b; })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });
 
  // ---- T08 REQUIRED (Missing summary on CREATE) ----
  await test({
    id: "T08",
    name: "Missing summary on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: (() => { const b = makeValidBook(`u8_${uniqueId}`); delete b.summary; return b; })(),
    tags: ["CREATE_FAIL", "REQUIRED"]
  });
 
  // ---- T09 TYPE (Invalid genre value on CREATE) ----
  await test({
    id: "T09",
    name: "Invalid genre value (not in enum) on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`u9_${uniqueId}`), genre: "Cooking" },
    tags: ["CREATE_FAIL", "TYPE"]
  });
 
  // ---- T10 TYPE (price as non-numeric string on UPDATE) ----
  await test({
    id: "T10",
    name: "Price as non-numeric string on UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: "free" },
    tags: ["UPDATE_FAIL", "TYPE"]
  });
 
  // ---- T11 BOUNDARY (year below minimum (999) on CREATE) ----
  await test({
    id: "T11",
    name: "Year below minimum boundary on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+6}`), year: 999 },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T12 BOUNDARY (price zero (must be > 0) on CREATE) ----
  await test({
    id: "T12",
    name: "Price zero boundary on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+7}`), price: "0.00" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });
 
  // ---- T13 BOUNDARY – negative price on UPDATE ----
  await test({
    id: "T13",
    name: "Negative price boundary on UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), price: "-1.00" },
    tags: ["UPDATE_FAIL", "BOUNDARY"]
  });
 
  // ---- T14 LENGTH (title empty string on CREATE) ----
  await test({
    id: "T14",
    name: "Empty title (min length) on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+8}`), title: "" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });
 
  // ---- T15 LENGTH (title exceeds 200 chars on CREATE) ----
  await test({
    id: "T15",
    name: "Title exceeds max length on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+9}`), title: "A".repeat(201) },
    tags: ["CREATE_FAIL", "LENGTH"]
  });
 
  // ---- T16 TEMPORAL (future year on CREATE) ----
  await test({
    id: "T16",
    name: "Future year on CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+10}`), year: new Date().getFullYear() + 1 },
    tags: ["CREATE_FAIL", "TEMPORAL"]
  });
 
  // ---- T17 TEMPORAL (future year on UPDATE) ----
  await test({
    id: "T17",
    name: "Future year on UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: new Date().getFullYear() + 2 },
    tags: ["UPDATE_FAIL", "TEMPORAL"]
  });
 
  // ---- T18 UPDATE_Fail (confirm a clean update succeeds) ----
  await test({
    id: "T18",
    name: "Valid update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });
 
  const pass = logSummary();
  logCoverage();
 
  process.exit(pass ? 0 : 1);
}
 
run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});