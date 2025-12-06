/**
 * TypeScript Structural Typing Examples
 * 
 * Demonstrates how TypeScript uses structural typing (duck typing)
 * where compatibility is based on shape, not names.
 */

// ============================================
// 1. BASIC STRUCTURAL TYPING
// ============================================

interface Point2D {
  x: number;
  y: number;
}

interface Vector2D {
  x: number;
  y: number;
}

// These are structurally identical - fully compatible!
const point: Point2D = { x: 10, y: 20 };
const vector: Vector2D = { x: 5, y: 15 };

// Assignments work both ways
let p: Point2D = vector;  // ✅ OK
let v: Vector2D = point;  // ✅ OK

// ============================================
// 2. CLASS AND INTERFACE COMPATIBILITY
// ============================================

interface Pet {
  name: string;
}

class Dog {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  bark() {
    console.log("Woof!");
  }
}

// Dog is compatible with Pet because it has 'name'
// Even though Dog doesn't explicitly implement Pet!
let pet: Pet = new Dog("Buddy");  // ✅ Works!

function greetPet(pet: Pet) {
  console.log(`Hello, ${pet.name}!`);
}

greetPet(new Dog("Max"));  // ✅ Works!

// ============================================
// 3. EXTRA PROPERTIES ARE OK (for variables)
// ============================================

interface Named {
  name: string;
}

const person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Extra properties are fine when passing variables
function sayHello(entity: Named) {
  console.log(`Hello, ${entity.name}!`);
}

sayHello(person);  // ✅ Works! Extra properties ignored

// ============================================
// 4. EXCESS PROPERTY CHECKING (Object Literals)
// ============================================

interface Config {
  host: string;
  port: number;
}

// ❌ Error with object literals - catches typos!
// const config: Config = {
//   host: "localhost",
//   port: 3000,
//   prto: 8080  // Error: Object literal may only specify known properties
// };

// ✅ Workaround 1: Assign to variable first
const settings = {
  host: "localhost",
  port: 3000,
  extra: "allowed"
};
const config1: Config = settings;  // Works

// ✅ Workaround 2: Type assertion
const config2 = {
  host: "localhost",
  port: 3000,
  extra: "allowed"
} as Config;

// ✅ Workaround 3: Index signature
interface FlexibleConfig {
  host: string;
  port: number;
  [key: string]: unknown;  // Allow any extra properties
}

const config3: FlexibleConfig = {
  host: "localhost",
  port: 3000,
  timeout: 5000  // ✅ OK now
};

// ============================================
// 5. FUNCTION COMPATIBILITY
// ============================================

type Handler = (name: string, age: number) => void;

// Functions with FEWER parameters are compatible
const simpleHandler: Handler = (name) => {
  console.log(name);
};  // ✅ OK - ignoring 'age' is fine

const noParamHandler: Handler = () => {
  console.log("No params needed");
};  // ✅ OK - ignoring all params is fine

// Functions with MORE required params are NOT compatible
// const badHandler: Handler = (name, age, extra) => {};  // ❌ Error

// ============================================
// 6. RETURN TYPE COMPATIBILITY
// ============================================

type Producer = () => { name: string };

// More specific return types are compatible
const detailedProducer: Producer = () => ({
  name: "Alice",
  age: 30,
  email: "alice@example.com"
});  // ✅ OK - returns superset of required properties

// ============================================
// 7. SIMULATING NOMINAL TYPES (Branded Types)
// ============================================

// Problem: Sometimes structural typing is too permissive
type UserId = number;
type ProductId = number;

let userId: UserId = 123;
let productId: ProductId = 456;

// This compiles but is logically wrong!
userId = productId;  // ✅ No error (both are just 'number')

// Solution: Branded types
type BrandedUserId = number & { readonly __brand: "UserId" };
type BrandedProductId = number & { readonly __brand: "ProductId" };

function createUserId(id: number): BrandedUserId {
  return id as BrandedUserId;
}

function createProductId(id: number): BrandedProductId {
  return id as BrandedProductId;
}

let safeUserId = createUserId(123);
let safeProductId = createProductId(456);

// Now TypeScript catches the error!
// safeUserId = safeProductId;  // ❌ Error: Type 'BrandedProductId' is not assignable

// ============================================
// 8. REAL-WORLD EXAMPLE: API RESPONSES
// ============================================

// API might return different shapes
interface ApiUser {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

// Your app might only need a subset
interface DisplayUser {
  username: string;
  email: string;
}

// Structural typing makes this seamless
function displayUserInfo(user: DisplayUser) {
  console.log(`${user.username} (${user.email})`);
}

const apiResponse: ApiUser = {
  id: 1,
  username: "alice",
  email: "alice@example.com",
  created_at: "2024-01-01"
};

// API response works directly - no transformation needed!
displayUserInfo(apiResponse);  // ✅ Works!

// ============================================
// 9. STRUCTURAL TYPING WITH GENERICS
// ============================================

interface Container<T> {
  value: T;
  getValue(): T;
}

// Any object with matching structure works
const numberContainer: Container<number> = {
  value: 42,
  getValue() { return this.value; }
};

// Class-based implementation also works
class Box<T> {
  constructor(public value: T) {}
  getValue(): T { return this.value; }
}

const box: Container<string> = new Box("hello");  // ✅ Works!

// ============================================
// 10. WHEN STRUCTURAL TYPING CAN BITE YOU
// ============================================

interface Rectangle {
  width: number;
  height: number;
}

interface Square {
  width: number;
  height: number;
}

// These are identical - but semantically different!
// A Square should have width === height

function createSquare(size: number): Square {
  return { width: size, height: size };
}

// This compiles but breaks the Square invariant!
const notReallySquare: Square = { width: 10, height: 20 };  // ❌ Logic bug!

// Solution: Use branded types or runtime validation
type SafeSquare = {
  width: number;
  height: number;
  readonly __brand: "Square";
};

function createSafeSquare(size: number): SafeSquare {
  return { width: size, height: size } as SafeSquare;
}

// Or use a class with validation
class ValidatedSquare {
  readonly width: number;
  readonly height: number;

  constructor(size: number) {
    this.width = size;
    this.height = size;
  }
}

export {};

