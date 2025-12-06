/**
 * TypeScript Union & Intersection Types Examples
 * 
 * Demonstrates union (|) and intersection (&) types
 * and how they work during compile-time checks.
 */

// ============================================
// 1. BASIC UNION TYPES
// ============================================

// A value that can be one of several types
type StringOrNumber = string | number;

let value: StringOrNumber;
value = "hello";  // ✅ OK
value = 42;       // ✅ OK
// value = true;  // ❌ Error: Type 'boolean' is not assignable

// Union of literal types
type Direction = "north" | "south" | "east" | "west";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

let direction: Direction = "north";
let roll: DiceRoll = 6;
// roll = 7;  // ❌ Error: Type '7' is not assignable

// ============================================
// 2. ACCESSING UNION TYPE MEMBERS
// ============================================

function processUnion(value: string | number) {
  // ✅ Can access members common to ALL types
  console.log(value.toString());  // Both have toString()
  console.log(value.valueOf());   // Both have valueOf()
  
  // ❌ Cannot access type-specific members directly
  // console.log(value.toUpperCase());  // Error: number doesn't have this
  // console.log(value.toFixed());      // Error: string doesn't have this
  
  // ✅ Must narrow first
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// ============================================
// 3. UNION WITH OBJECTS
// ============================================

interface Bird {
  type: "bird";
  fly(): void;
  wingspan: number;
}

interface Fish {
  type: "fish";
  swim(): void;
  fins: number;
}

type Animal = Bird | Fish;

function handleAnimal(animal: Animal) {
  // Common property - accessible on both
  console.log(animal.type);
  
  // Discriminated union - use 'type' to narrow
  if (animal.type === "bird") {
    animal.fly();
    console.log(`Wingspan: ${animal.wingspan}`);
  } else {
    animal.swim();
    console.log(`Fins: ${animal.fins}`);
  }
}

// ============================================
// 4. BASIC INTERSECTION TYPES
// ============================================

// Combines multiple types - must have ALL properties
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

interface HasEmail {
  email: string;
}

type Person = HasName & HasAge & HasEmail;

const person: Person = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};  // Must have ALL three properties

// ============================================
// 5. INTERSECTION WITH INTERFACES
// ============================================

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

interface SoftDeletable {
  deletedAt?: Date;
  isDeleted: boolean;
}

// Combine multiple interfaces
type Entity<T> = T & Timestamped & Identifiable & SoftDeletable;

interface User {
  name: string;
  email: string;
}

type UserEntity = Entity<User>;

const userEntity: UserEntity = {
  // User properties
  name: "Bob",
  email: "bob@example.com",
  // Timestamped properties
  createdAt: new Date(),
  updatedAt: new Date(),
  // Identifiable property
  id: "user-123",
  // SoftDeletable properties
  isDeleted: false
};

// ============================================
// 6. INTERSECTION TYPE CONFLICTS
// ============================================

// Conflicting primitive types = never
type Impossible = string & number;
// Type is 'never' - no value can be both string AND number

// Conflicting object properties
interface A {
  prop: string;
}

interface B {
  prop: number;
}

type AB = A & B;
// AB has: { prop: string & number } = { prop: never }

// This is why you rarely intersect conflicting types!
// const ab: AB = { prop: ??? };  // No valid value exists

// ============================================
// 7. PRACTICAL: MIXINS WITH INTERSECTION
// ============================================

// Mixin functions that add behavior
function withTimestamps<T extends object>(obj: T): T & Timestamped {
  return {
    ...obj,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

function withId<T extends object>(obj: T): T & Identifiable {
  return {
    ...obj,
    id: crypto.randomUUID()
  };
}

// Compose mixins
const rawUser = { name: "Charlie", email: "charlie@example.com" };
const enhancedUser = withId(withTimestamps(rawUser));
// Type: { name: string; email: string } & Timestamped & Identifiable

console.log(enhancedUser.id);        // ✅ Has id
console.log(enhancedUser.createdAt); // ✅ Has timestamps
console.log(enhancedUser.name);      // ✅ Has original properties

// ============================================
// 8. UNION VS INTERSECTION COMPARISON
// ============================================

interface Cat {
  meow(): void;
}

interface Dog2 {
  bark(): void;
}

// Union: Cat OR Dog - can only use common members
type CatOrDog = Cat | Dog2;

function handleCatOrDog(pet: CatOrDog) {
  // pet.meow();  // ❌ Error - might be a Dog
  // pet.bark();  // ❌ Error - might be a Cat
}

// Intersection: Cat AND Dog - has all members from both
type CatAndDog = Cat & Dog2;

function handleCatAndDog(pet: CatAndDog) {
  pet.meow();  // ✅ OK - definitely has meow
  pet.bark();  // ✅ OK - definitely has bark
}

// A CatAndDog is a special pet that can do both!
const specialPet: CatAndDog = {
  meow() { console.log("Meow!"); },
  bark() { console.log("Woof!"); }
};

// ============================================
// 9. FUNCTION OVERLOADS WITH UNION TYPES
// ============================================

// Overload signatures (what callers see)
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;

// Implementation signature (must handle all overloads)
function format(value: string | number | Date): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value.toISOString();
  }
}

// TypeScript picks the right overload
const str = format("hello");    // Returns string
const num = format(42);         // Returns string
const date = format(new Date());// Returns string

// ============================================
// 10. CONDITIONAL TYPES WITH UNIONS
// ============================================

// Distribute over union types
type NonNullable2<T> = T extends null | undefined ? never : T;

type Example1 = NonNullable2<string | null | undefined>;
// Result: string (null and undefined are filtered out)

// Extract specific types from union
type ExtractStrings<T> = T extends string ? T : never;

type Mixed = string | number | boolean | "special";
type OnlyStrings = ExtractStrings<Mixed>;
// Result: string | "special"

// ============================================
// 11. DISCRIMINATED UNIONS PATTERN
// ============================================

// Result type pattern (like Rust's Result)
type Success<T> = {
  success: true;
  data: T;
};

type Failure = {
  success: false;
  error: string;
};

type Result<T> = Success<T> | Failure;

function divide(a: number, b: number): Result<number> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

const result = divide(10, 2);

if (result.success) {
  // Narrowed to Success<number>
  console.log(`Result: ${result.data}`);
} else {
  // Narrowed to Failure
  console.log(`Error: ${result.error}`);
}

// ============================================
// 12. UNION TYPE UTILITIES
// ============================================

// Get keys that exist in ALL union members
type CommonKeys<T> = T extends T ? keyof T : never;

interface A2 {
  a: string;
  common: number;
}

interface B2 {
  b: string;
  common: number;
}

type Keys = CommonKeys<A2 | B2>;
// Result: "common" (only key in both)

// Make all properties in union optional
type PartialUnion<T> = {
  [K in keyof T]?: T[K];
};

// ============================================
// 13. ADVANCED: DISTRIBUTIVE CONDITIONAL TYPES
// ============================================

type ToArray<T> = T extends any ? T[] : never;

// Distributes over union
type ArrayUnion = ToArray<string | number>;
// Result: string[] | number[] (NOT (string | number)[])

// Prevent distribution with tuple
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type SingleArray = ToArrayNonDistributive<string | number>;
// Result: (string | number)[]

export {};

