/**
 * TypeScript Control Flow Analysis & Type Narrowing Examples
 * 
 * Demonstrates how TypeScript narrows types based on
 * control flow and various type guards.
 */

// ============================================
// 1. typeof TYPE GUARDS
// ============================================

function processValue(value: string | number | boolean) {
  // Before narrowing: value is string | number | boolean
  
  if (typeof value === "string") {
    // Narrowed to: string
    console.log(value.toUpperCase());
    console.log(value.length);
  } else if (typeof value === "number") {
    // Narrowed to: number
    console.log(value.toFixed(2));
    console.log(Math.sqrt(value));
  } else {
    // Narrowed to: boolean
    console.log(value ? "Yes" : "No");
  }
}

// ============================================
// 2. instanceof TYPE GUARDS
// ============================================

class Dog {
  bark() { console.log("Woof!"); }
  wagTail() { console.log("*wagging*"); }
}

class Cat {
  meow() { console.log("Meow!"); }
  purr() { console.log("*purring*"); }
}

class Bird {
  chirp() { console.log("Tweet!"); }
  fly() { console.log("*flying*"); }
}

function handlePet(pet: Dog | Cat | Bird) {
  if (pet instanceof Dog) {
    // Narrowed to: Dog
    pet.bark();
    pet.wagTail();
  } else if (pet instanceof Cat) {
    // Narrowed to: Cat
    pet.meow();
    pet.purr();
  } else {
    // Narrowed to: Bird
    pet.chirp();
    pet.fly();
  }
}

// ============================================
// 3. DISCRIMINATED UNIONS (TAGGED UNIONS)
// ============================================

// The 'kind' property acts as a discriminant
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // Narrowed to: { kind: "circle"; radius: number }
      return Math.PI * shape.radius ** 2;
    
    case "rectangle":
      // Narrowed to: { kind: "rectangle"; width: number; height: number }
      return shape.width * shape.height;
    
    case "triangle":
      // Narrowed to: { kind: "triangle"; base: number; height: number }
      return 0.5 * shape.base * shape.height;
    
    default:
      // Exhaustiveness check - should be 'never'
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// ============================================
// 4. TRUTHINESS NARROWING
// ============================================

function printName(name: string | null | undefined) {
  if (name) {
    // Narrowed to: string (truthy)
    // Excludes: null, undefined, and empty string ""
    console.log(name.toUpperCase());
  } else {
    // Type is: null | undefined | "" 
    console.log("No name provided");
  }
}

// Double-boolean trick for explicit boolean conversion
function processItems(items: string[] | null) {
  if (!!items && items.length > 0) {
    // Narrowed to: string[] with at least one element
    console.log(items.join(", "));
  }
}

// ============================================
// 5. EQUALITY NARROWING
// ============================================

function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both narrowed to: string (the only common type)
    console.log(x.toUpperCase());
    console.log(y.toLowerCase());
  }
}

// Narrowing with null checks
function printId(id: string | null) {
  if (id !== null) {
    // Narrowed to: string
    console.log(id.toUpperCase());
  }
}

// ============================================
// 6. 'in' OPERATOR NARROWING
// ============================================

interface Fish {
  swim(): void;
  scales: number;
}

interface Bird2 {
  fly(): void;
  wingspan: number;
}

function move(animal: Fish | Bird2) {
  if ("swim" in animal) {
    // Narrowed to: Fish
    animal.swim();
    console.log(`Scales: ${animal.scales}`);
  } else {
    // Narrowed to: Bird2
    animal.fly();
    console.log(`Wingspan: ${animal.wingspan}`);
  }
}

// ============================================
// 7. USER-DEFINED TYPE GUARDS
// ============================================

// Type predicate: "value is Type"
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processUnknown(value: unknown) {
  if (isString(value)) {
    // Narrowed to: string
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    // Narrowed to: number
    console.log(value.toFixed(2));
  }
}

// More complex type guard
interface Admin {
  role: "admin";
  permissions: string[];
}

interface User {
  role: "user";
  email: string;
}

type Person = Admin | User;

function isAdmin(person: Person): person is Admin {
  return person.role === "admin";
}

function handlePerson(person: Person) {
  if (isAdmin(person)) {
    // Narrowed to: Admin
    console.log(`Permissions: ${person.permissions.join(", ")}`);
  } else {
    // Narrowed to: User
    console.log(`Email: ${person.email}`);
  }
}

// ============================================
// 8. ASSERTION FUNCTIONS (TypeScript 3.7+)
// ============================================

// Throws if condition is false, narrows type if true
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value must be defined");
  }
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}

function processData(data: string | null) {
  assertIsDefined(data);
  // After assertion: data is string
  console.log(data.toUpperCase());
}

function handleInput(input: unknown) {
  assertIsString(input);
  // After assertion: input is string
  console.log(input.length);
}

// ============================================
// 9. ARRAY NARROWING
// ============================================

function processArray(arr: string[] | null | undefined) {
  // Check for null/undefined AND empty array
  if (arr && arr.length > 0) {
    // Narrowed to: string[] (non-empty)
    const first = arr[0];  // string (not string | undefined)
    console.log(first.toUpperCase());
  }
}

// Array.isArray type guard
function handleData(data: string | string[]) {
  if (Array.isArray(data)) {
    // Narrowed to: string[]
    console.log(data.join(", "));
  } else {
    // Narrowed to: string
    console.log(data.toUpperCase());
  }
}

// ============================================
// 10. CONTROL FLOW WITH ASSIGNMENTS
// ============================================

function flowWithAssignments() {
  let value: string | number;
  
  value = "hello";
  // Here value is: string
  console.log(value.toUpperCase());
  
  value = 42;
  // Here value is: number
  console.log(value.toFixed(2));
  
  // TypeScript tracks through assignments!
}

// ============================================
// 11. NARROWING WITH OPTIONAL CHAINING
// ============================================

interface Company {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

function printAddress(company: Company) {
  // Optional chaining doesn't narrow, but...
  const address = company.address;
  
  if (address) {
    // Now narrowed to: { street: string; city: string }
    console.log(`${address.street}, ${address.city}`);
  }
}

// ============================================
// 12. EXHAUSTIVENESS CHECKING WITH never
// ============================================

type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting for review";
    case "approved":
      return "Request approved!";
    case "rejected":
      return "Request denied";
    default:
      // If we forget a case, this will error!
      const _exhaustive: never = status;
      return _exhaustive;
  }
}

// If we add a new status, TypeScript will catch it:
// type Status = "pending" | "approved" | "rejected" | "cancelled";
// Now handleStatus() will have a compile error!

// ============================================
// 13. TYPE ASSERTIONS (USE CAUTIOUSLY)
// ============================================

// When TypeScript can't narrow automatically
function handleEvent(event: Event) {
  // TypeScript doesn't know this is a MouseEvent
  // const x = event.clientX;  // ❌ Error
  
  // Use type assertion (be sure you're right!)
  const mouseEvent = event as MouseEvent;
  console.log(mouseEvent.clientX, mouseEvent.clientY);
}

// Safer: User-defined type guard
function isMouseEvent(event: Event): event is MouseEvent {
  return "clientX" in event;
}

function handleEventSafely(event: Event) {
  if (isMouseEvent(event)) {
    // Safely narrowed
    console.log(event.clientX, event.clientY);
  }
}

export {};

