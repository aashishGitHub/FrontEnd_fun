# TypeScript Deep Dive: Advanced Concepts Explained

A comprehensive guide covering TypeScript's internal workings, type system, and compilation process.

---

## Table of Contents

1. [Type Inference](#1-type-inference)
2. [Structural vs Nominal Typing](#2-structural-vs-nominal-typing)
3. [Control Flow Analysis & Type Narrowing](#3-control-flow-analysis--type-narrowing)
4. [Union & Intersection Types](#4-union--intersection-types)
5. [Decorators Compilation](#5-decorators-compilation)
6. [Async/Await Downlevel Compilation](#6-asyncawait-downlevel-compilation)
7. [Module Resolution](#7-module-resolution)

---

## 1. Type Inference

### How TypeScript Infers Types

TypeScript uses a powerful **type inference system** that automatically deduces types based on context. This is called "contextual typing" and happens at several key points:

### Variable Initialization

When you assign a value during declaration, TypeScript infers the type from that value:

```typescript
let message = "Hello, World!";  // Inferred as string
let count = 42;                  // Inferred as number
let isActive = true;             // Inferred as boolean
let items = [1, 2, 3];           // Inferred as number[]
```

### Best Common Type Algorithm

When inferring types from multiple expressions (like arrays with mixed elements):

```typescript
let mixed = [0, 1, null];  // Inferred as (number | null)[]

// With objects of different types
class Animal {}
class Rhino extends Animal {}
class Elephant extends Animal {}

let zoo = [new Rhino(), new Elephant()];
// Inferred as (Rhino | Elephant)[] - NOT Animal[] unless explicitly stated
```

### Contextual Typing (Reverse Inference)

TypeScript can infer types based on the *context* where a value is expected:

```typescript
// The function parameter type is inferred from addEventListener's signature
window.addEventListener("click", (event) => {
    // 'event' is automatically inferred as MouseEvent
    console.log(event.clientX);  // TypeScript knows this exists
});
```

### Initialized vs. Uninitialized Variables

| Scenario | Type Inferred | Type Safety |
|----------|---------------|-------------|
| Initialized | Specific type | ✅ Full |
| Uninitialized | `any` | ❌ None |

**When Initialized:**
```typescript
let count = 10;        // Inferred as number
count = 20;            // ✅ OK
count = "twenty";      // ❌ Error: Type 'string' is not assignable to type 'number'
```

**When NOT Initialized:**
```typescript
let value;             // Inferred as 'any'
value = 10;            // No error
value = "Hello";       // No error - type safety is lost!
value = { foo: 123 };  // Still no error
```

### The `noImplicitAny` Compiler Flag

When enabled, TypeScript raises an error for variables that would implicitly be `any`:

```typescript
// With noImplicitAny: true
let data;  // ❌ Error: Variable 'data' implicitly has an 'any' type

// Solution 1: Initialize
let data = [];

// Solution 2: Explicit annotation
let data: string[];
```

### Widening vs. Narrowing

```typescript
// 'const' gives literal types (narrowing)
const x = "hello";    // Type: "hello" (literal type)

// 'let' gives widened types
let y = "hello";      // Type: string (widened)

// Object literal properties are widened
const obj = { x: 10 };  // Type: { x: number } not { x: 10 }
```

---

## 2. Structural vs Nominal Typing

### Structural Typing (TypeScript's Approach)

TypeScript uses **structural typing** (also called "duck typing"), where type compatibility is determined by the **shape** of types, not their names.

> "If it walks like a duck and quacks like a duck, TypeScript treats it as a duck!"

```typescript
interface Point2D {
  x: number;
  y: number;
}

interface Vector2D {
  x: number;
  y: number;
}

let point: Point2D = { x: 10, y: 20 };
let vector: Vector2D = { x: 5, y: 15 };

// ✅ Works! Same structure = compatible types
point = vector;
vector = point;
```

### Nominal Typing (Java/C# Approach)

In nominal typing systems, types are compatible **only if explicitly declared** to be so:

```java
// Java - Nominal Typing
class Point {
    int x;
    int y;
}

class Vector {
    int x;
    int y;
}

Point p = new Point();
Vector v = new Vector();

// ❌ Error in Java! Different names = incompatible
p = v;  // Compilation error!
```

### Key Differences

| Aspect | Structural Typing (TS) | Nominal Typing (Java/C#) |
|--------|------------------------|--------------------------|
| Compatibility basis | Shape/structure | Explicit declaration |
| Interface implementation | Implicit (if shape matches) | Explicit (`implements`) |
| Flexibility | High | Lower |
| Refactoring safety | Lower (accidental compatibility) | Higher |

### Simulating Nominal Types in TypeScript (Branded Types)

```typescript
// Using unique symbols for branding
type USD = number & { readonly brand: unique symbol };
type EUR = number & { readonly brand: unique symbol };

function usd(value: number): USD {
  return value as USD;
}

function eur(value: number): EUR {
  return value as EUR;
}

let dollars: USD = usd(100);
let euros: EUR = eur(85);

// ❌ Error! Different brands
dollars = euros;  // Type 'EUR' is not assignable to type 'USD'
```

### Excess Property Checking

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`(${p.x}, ${p.y})`);
}

// ✅ Works - object has at least the required properties
const point3D = { x: 1, y: 2, z: 3 };
logPoint(point3D);

// ❌ Error with object literals (excess property checking)
logPoint({ x: 1, y: 2, z: 3 });  
// Error: Object literal may only specify known properties
```

**Why the difference?** TypeScript applies excess property checking only to object literals to catch typos.

---

## 3. Control Flow Analysis & Type Narrowing

TypeScript's compiler performs **Control Flow Analysis (CFA)** to track how types change as code executes.

### Type Guards and Narrowing Mechanisms

#### 1. `typeof` Guards

```typescript
function process(value: string | number | boolean) {
  if (typeof value === "string") {
    // Narrowed to: string
    console.log(value.toUpperCase());
  } else if (typeof value === "number") {
    // Narrowed to: number
    console.log(value.toFixed(2));
  } else {
    // Narrowed to: boolean
    console.log(value ? "yes" : "no");
  }
}
```

#### 2. `instanceof` Guards

```typescript
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();  // TypeScript knows it's a Dog
  } else {
    animal.meow();  // TypeScript knows it's a Cat
  }
}
```

#### 3. Discriminated Unions (Tagged Unions)

```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
  }
}
```

#### 4. Truthiness Narrowing

```typescript
function printName(name: string | null | undefined) {
  if (name) {
    // Narrowed to: string (truthy)
    console.log(name.toUpperCase());
  } else {
    console.log("No name provided");
  }
}
```

#### 5. `in` Operator Narrowing

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();  // Narrowed to Fish
  } else {
    animal.fly();   // Narrowed to Bird
  }
}
```

### Manual Type Narrowing

#### User-Defined Type Guards (Recommended)

```typescript
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

// Custom type guard with 'is' syntax
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();  // TypeScript knows pet is Fish
  } else {
    pet.fly();   // TypeScript knows pet is Bird
  }
}
```

#### Assertion Functions (TypeScript 3.7+)

```typescript
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== "string") {
    throw new Error("Not a string!");
  }
}

function process(value: unknown) {
  assertIsString(value);
  // After assertion, value is narrowed to string
  console.log(value.toUpperCase());
}
```

#### Type Assertions (Use Cautiously)

```typescript
function handleValue(value: unknown) {
  // Less safe - bypasses type checking
  const strValue = value as string;
  console.log(strValue.toUpperCase());  // ⚠️ Runtime error if not string!
}
```

---

## 4. Union & Intersection Types

### Union Types (`|`)

A union type represents a value that can be **one of several types**:

```typescript
type StringOrNumber = string | number;

let value: StringOrNumber;
value = "hello";  // ✅ OK
value = 42;       // ✅ OK
value = true;     // ❌ Error: Type 'boolean' is not assignable
```

**Accessing Members of Union Types:**

```typescript
function process(value: string | number) {
  // ✅ Can only access members common to ALL types in union
  console.log(value.toString());  // Both have toString()
  
  // ❌ Cannot access type-specific members without narrowing
  console.log(value.toUpperCase());  // Error! number doesn't have this
  
  // ✅ Must narrow first
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

### Intersection Types (`&`)

An intersection type combines multiple types into one, requiring **all properties from all types**:

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: number;
  department: string;
}

type EmployeePerson = Person & Employee;

const worker: EmployeePerson = {
  name: "Alice",
  age: 30,
  employeeId: 12345,
  department: "Engineering"
};  // Must have ALL properties
```

**Intersection with Conflicting Types:**

```typescript
// When primitives are intersected - creates 'never' type
type Impossible = string & number;  // Type: never

// When objects have conflicting properties
interface A { prop: string; }
interface B { prop: number; }
type AB = A & B;
// AB.prop is type: string & number = never
```

### Function Overload Resolution

```typescript
// Overload signatures (public API)
function combine(a: string, b: string): string;
function combine(a: number, b: number): number;
function combine(a: string[], b: string[]): string[];

// Implementation signature (must handle all cases)
function combine(
  a: string | number | string[],
  b: string | number | string[]
): string | number | string[] {
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }
  throw new Error("Invalid arguments");
}

// Resolution examples
combine("Hello, ", "World!");  // Uses 1st overload → string
combine(10, 20);               // Uses 2nd overload → number
combine(["a"], ["b"]);         // Uses 3rd overload → string[]
combine("hello", 42);          // ❌ Error: No overload matches!
```

---

## 5. Decorators Compilation

### Legacy Decorators (`experimentalDecorators`)

**TypeScript Source:**

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${key} with:`, args);
    return original.apply(this, args);
  };
}

@sealed
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  @log
  greet() {
    return `Hello, ${this.greeting}`;
  }
}
```

**Compiled JavaScript (ES5):**

```javascript
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length;
    var r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
    var d;
    for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) {
            r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    __decorate([log], Greeter.prototype, "greet", null);
    Greeter = __decorate([sealed], Greeter);
    return Greeter;
}());
```

### Decorator Execution Order

```typescript
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string) {
    console.log("second(): called");
  };
}

class Example {
  @first()
  @second()
  method() {}
}

// Output:
// first(): factory evaluated
// second(): factory evaluated
// second(): called    ← Applied bottom-to-top!
// first(): called
```

### ECMAScript Decorators (TypeScript 5.0+)

| Feature | `experimentalDecorators` | ECMAScript Decorators |
|---------|--------------------------|----------------------|
| Stage | Stage 2 (old) | Stage 3 (standard) |
| Parameter decorators | ✅ Supported | ❌ Not supported |
| `emitDecoratorMetadata` | ✅ Works | ❌ Not supported |
| Decorator factories | Different signature | New context object |

**New ECMAScript Decorator Syntax:**

```typescript
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name);
  
  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = target.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }
  
  return replacementMethod;
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  
  @logged
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

---

## 6. Async/Await Downlevel Compilation

### ES5 Target Transformation

When targeting ES5, TypeScript transforms `async/await` using **generator functions** and **helper utilities**.

**TypeScript Source:**

```typescript
async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  const data = await response.json();
  return data.message;
}
```

**Compiled JavaScript (ES5):**

```javascript
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __generator = (this && this.__generator) || function (thisArg, body) {
    // ... state machine implementation
};

function fetchData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.message];
            }
        });
    });
}
```

### ES2017 Target (Native)

```javascript
// Almost identical to source!
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.message;
}
```

### Comparison

| Target | Output Size | Runtime Requirements | Performance |
|--------|-------------|---------------------|-------------|
| ES5 | ~50+ lines with helpers | Polyfills for Promise, generators | Slower |
| ES2015/ES6 | Medium (uses generators) | Native generators | Better |
| ES2017+ | Minimal (native) | Native async/await | Best |

### Optimizing Bundle Size

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "importHelpers": true  // Import from tslib instead of inlining
  }
}
```

---

## 7. Module Resolution

### Module Resolution Strategies

**Node Resolution (Most Common):**

```typescript
// For: import { helper } from "utils"
// TypeScript looks in this order:

// 1. /root/src/node_modules/utils.ts
// 2. /root/src/node_modules/utils.tsx
// 3. /root/src/node_modules/utils.d.ts
// 4. /root/src/node_modules/utils/package.json (check "types" or "main")
// 5. /root/src/node_modules/utils/index.ts
// 6. /root/node_modules/utils... (walk up directories)
```

**Relative vs. Non-Relative Imports:**

```typescript
// Relative imports - resolved relative to importing file
import { Component } from "./components/Button";
import { utils } from "../shared/utils";

// Non-relative imports - resolved via baseUrl or node_modules
import { React } from "react";
import { lodash } from "lodash";
```

### Resolution Configuration

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["shared/utils/*"]
    },
    "rootDirs": ["src", "generated"],
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

### Module Resolution Comparison

| Strategy | Use Case | Package.json Exports | Extensionless Imports |
|----------|----------|---------------------|----------------------|
| `classic` | Legacy TS | ❌ Ignored | ❌ Requires extension |
| `node` | Node.js (CommonJS) | ❌ Limited | ✅ Works |
| `node16`/`nodenext` | Node.js (ESM) | ✅ Full support | ⚠️ Context-dependent |
| `bundler` | Webpack/Vite/etc. | ✅ Full support | ✅ Works |

### Practical Configuration Examples

```json
// For Node.js ESM projects
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}

// For Vite/Next.js/modern bundlers
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}

// For legacy CommonJS Node.js
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
```

### Import Extension Requirements

```typescript
// With moduleResolution: "node16" or "nodenext" in ESM mode
import { helper } from "./utils.js";  // ✅ Extension REQUIRED
import { helper } from "./utils";     // ❌ Error!

// With moduleResolution: "bundler"
import { helper } from "./utils";     // ✅ Extension optional
import { helper } from "./utils.js";  // ✅ Also works
```

---

## Quick Reference Cheat Sheet

| Topic | Key Concept |
|-------|-------------|
| **Type Inference** | Based on initialization; uninitialized = `any` |
| **Structural Typing** | Shape matters, not name |
| **Control Flow Analysis** | Narrows types via `typeof`, `instanceof`, discriminants |
| **Union Types** | Value is ONE of several types (`A \| B`) |
| **Intersection Types** | Value has ALL properties (`A & B`) |
| **Decorators** | Transform to `__decorate` helper calls |
| **Async/Await Downlevel** | Compiles to `__awaiter`/`__generator` state machines |
| **Module Resolution** | `bundler` for modern tooling, `node16`/`nodenext` for Node.js ESM |

---

## References

- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Unions and Intersections](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
- [TypeScript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TypeScript Handbook - Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

