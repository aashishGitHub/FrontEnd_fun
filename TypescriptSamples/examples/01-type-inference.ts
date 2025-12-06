/**
 * TypeScript Type Inference Examples
 * 
 * Demonstrates how TypeScript automatically infers types
 * when no explicit annotation is provided.
 */

// ============================================
// 1. BASIC TYPE INFERENCE
// ============================================

// TypeScript infers types from initialization values
let message = "Hello, World!";  // Inferred as: string
let count = 42;                  // Inferred as: number
let isActive = true;             // Inferred as: boolean
let items = [1, 2, 3];           // Inferred as: number[]

// Hover over variables to see inferred types!
console.log(typeof message);  // "string"
console.log(typeof count);    // "number"

// ============================================
// 2. CONST VS LET (WIDENING)
// ============================================

// 'const' gives literal types (narrower)
const literalString = "hello";    // Type: "hello" (literal type)
const literalNumber = 42;         // Type: 42 (literal type)

// 'let' gives widened types
let widenedString = "hello";      // Type: string (widened)
let widenedNumber = 42;           // Type: number (widened)

// This is why const is important for literal types in unions
const direction = "north" as const;  // Type: "north"
type Direction = "north" | "south" | "east" | "west";

// ============================================
// 3. ARRAY INFERENCE
// ============================================

// Homogeneous arrays
let numbers = [1, 2, 3];              // Inferred as: number[]
let strings = ["a", "b", "c"];        // Inferred as: string[]

// Mixed arrays use union types (Best Common Type)
let mixed = [1, "hello", true];       // Inferred as: (string | number | boolean)[]
let withNull = [1, 2, null];          // Inferred as: (number | null)[]

// Empty arrays infer as any[] - be explicit!
let emptyBad = [];                    // Type: any[] - avoid this!
let emptyGood: number[] = [];         // Type: number[] - explicit is better

// ============================================
// 4. OBJECT INFERENCE
// ============================================

// Object literal properties are inferred
const user = {
  name: "Alice",          // Inferred as: string
  age: 30,                // Inferred as: number
  isAdmin: false          // Inferred as: boolean
};
// user type: { name: string; age: number; isAdmin: boolean }

// Note: Properties are NOT literal types (they're widened)
const config = {
  theme: "dark",          // Type: string (not "dark")
  fontSize: 14            // Type: number (not 14)
};

// Use 'as const' for literal object types
const configLiteral = {
  theme: "dark",
  fontSize: 14
} as const;
// Type: { readonly theme: "dark"; readonly fontSize: 14 }

// ============================================
// 5. FUNCTION RETURN TYPE INFERENCE
// ============================================

// Return type is inferred from return statements
function add(a: number, b: number) {
  return a + b;  // Return type inferred as: number
}

function greet(name: string) {
  return `Hello, ${name}!`;  // Return type inferred as: string
}

function maybeNumber(flag: boolean) {
  if (flag) return 42;
  return null;
  // Return type inferred as: number | null
}

// Arrow functions also have inference
const multiply = (a: number, b: number) => a * b;  // Returns: number

// ============================================
// 6. CONTEXTUAL TYPING (REVERSE INFERENCE)
// ============================================

// Event handlers get parameter types from context
document.addEventListener("click", (event) => {
  // 'event' is automatically typed as MouseEvent
  console.log(event.clientX, event.clientY);
});

document.addEventListener("keydown", (event) => {
  // 'event' is automatically typed as KeyboardEvent
  console.log(event.key, event.code);
});

// Array methods have contextual typing
const doubled = [1, 2, 3].map((n) => n * 2);
// 'n' is inferred as number from the array type

const filtered = ["hello", "world", "foo"].filter((s) => s.length > 3);
// 's' is inferred as string

// ============================================
// 7. UNINITIALIZED VARIABLES = any
// ============================================

let uninitialized;              // Type: any (dangerous!)
uninitialized = 42;             // No error
uninitialized = "hello";        // No error - lost type safety!
uninitialized = { foo: "bar" }; // No error

// Solution 1: Initialize immediately
let initialized = 0;            // Type: number

// Solution 2: Explicit type annotation
let declaredOnly: number;       // Type: number
declaredOnly = 42;              // OK
// declaredOnly = "hello";      // Error: Type 'string' is not assignable

// ============================================
// 8. GENERIC TYPE INFERENCE
// ============================================

// TypeScript infers generic type arguments
function identity<T>(value: T): T {
  return value;
}

const str = identity("hello");     // T inferred as string
const num = identity(42);          // T inferred as number
const obj = identity({ x: 1 });    // T inferred as { x: number }

// Array generics
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = firstElement([1, 2, 3]);        // Type: number | undefined
const firstStr = firstElement(["a", "b"]);    // Type: string | undefined

// ============================================
// 9. BEST COMMON TYPE
// ============================================

class Animal {
  name = "Animal";
}

class Dog extends Animal {
  bark() { console.log("Woof!"); }
}

class Cat extends Animal {
  meow() { console.log("Meow!"); }
}

// TypeScript finds the best common type
let pets = [new Dog(), new Cat()];
// Type: (Dog | Cat)[] - NOT Animal[]!

// To get Animal[], be explicit:
let animals: Animal[] = [new Dog(), new Cat()];

// ============================================
// 10. PRACTICAL TIPS
// ============================================

// TIP 1: Enable noImplicitAny in tsconfig.json
// This catches uninitialized variables

// TIP 2: Use 'as const' for literal types
const COLORS = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]
type Color = typeof COLORS[number];  // "red" | "green" | "blue"

// TIP 3: Hover over variables to check inferred types

// TIP 4: When inference is wrong, add explicit types
interface User {
  id: number;
  name: string;
}

// Inference might not match your intention
const badUsers = [];  // any[]

// Be explicit for complex types
const goodUsers: User[] = [];

export {};

