/**
 * TypeScript Decorators Examples
 * 
 * Demonstrates how decorators work and how they compile to JavaScript.
 * Note: Requires "experimentalDecorators": true in tsconfig.json
 */

// ============================================
// 1. CLASS DECORATOR
// ============================================

// Simple class decorator - receives the constructor
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  console.log(`Class ${constructor.name} has been sealed`);
}

@sealed
class BankAccount {
  balance: number = 0;
  
  deposit(amount: number) {
    this.balance += amount;
  }
}

// After compilation, this becomes:
// BankAccount = __decorate([sealed], BankAccount);

// ============================================
// 2. CLASS DECORATOR FACTORY
// ============================================

// Factory returns the actual decorator
function entity(tableName: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      static tableName = tableName;
    };
  };
}

@entity("users")
class User {
  constructor(public name: string) {}
}

// Access the static property
// console.log((User as any).tableName);  // "users"

// ============================================
// 3. METHOD DECORATOR
// ============================================

// Method decorator receives: target, propertyKey, descriptor
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
  
  @log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(2, 3);      // Logs: Calling add with args: [2, 3]
                     // Logs: add returned: 5

// ============================================
// 4. PROPERTY DECORATOR
// ============================================

// Property decorator receives: target, propertyKey
function observable(target: any, propertyKey: string) {
  let value: any;
  
  const getter = function () {
    return value;
  };
  
  const setter = function (newVal: any) {
    console.log(`Setting ${propertyKey} to:`, newVal);
    value = newVal;
  };
  
  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class Person {
  @observable
  name: string = "";
  
  @observable
  age: number = 0;
}

const person2 = new Person();
person2.name = "Alice";  // Logs: Setting name to: Alice
person2.age = 30;        // Logs: Setting age to: 30

// ============================================
// 5. PARAMETER DECORATOR
// ============================================

// Parameter decorator receives: target, propertyKey, parameterIndex
function required(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  // Store metadata about required parameters
  const existingRequired: number[] = 
    Reflect.getOwnMetadata("required", target, propertyKey) || [];
  existingRequired.push(parameterIndex);
  Reflect.defineMetadata("required", existingRequired, target, propertyKey);
}

class Greeter {
  greet(@required name: string) {
    return `Hello, ${name}!`;
  }
}

// ============================================
// 6. ACCESSOR DECORATOR
// ============================================

function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}

class Point {
  private _x: number;
  private _y: number;
  
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  
  @configurable(false)
  get x() { return this._x; }
  
  @configurable(false)
  get y() { return this._y; }
}

// ============================================
// 7. DECORATOR COMPOSITION
// ============================================

function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): decorator called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): decorator called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}

// Output order:
// first(): factory evaluated
// second(): factory evaluated
// second(): decorator called   ← Bottom decorator called first!
// first(): decorator called

// ============================================
// 8. PRACTICAL: VALIDATION DECORATOR
// ============================================

function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    // Check for null/undefined arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i] === null || args[i] === undefined) {
        throw new Error(`Argument ${i} cannot be null or undefined`);
      }
    }
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @validate
  createUser(name: string, email: string) {
    return { name, email };
  }
}

const userService = new UserService();
// userService.createUser(null, "test@example.com");  // Throws error!

// ============================================
// 9. PRACTICAL: MEMOIZATION DECORATOR
// ============================================

function memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function (...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}(${key})`);
      return cache.get(key);
    }
    
    console.log(`Cache miss for ${propertyKey}(${key})`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class MathOperations {
  @memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// ============================================
// 10. PRACTICAL: TIMING DECORATOR
// ============================================

function timing(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
  
  return descriptor;
}

class ApiService {
  @timing
  async fetchData(url: string) {
    const response = await fetch(url);
    return response.json();
  }
}

// ============================================
// 11. HOW DECORATORS COMPILE TO JAVASCRIPT
// ============================================

/*
TypeScript generates a __decorate helper function:

var __decorate = function (decorators, target, key, desc) {
    var c = arguments.length;
    var r = c < 3 ? target 
          : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) 
          : desc;
    var d;
    for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) {
            r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        }
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

For a decorated class:
  Greeter = __decorate([sealed], Greeter);

For a decorated method:
  __decorate([log], Greeter.prototype, "greet", null);

For a decorated property:
  __decorate([observable], Greeter.prototype, "name", void 0);
*/

// ============================================
// 12. ECMASCRIPT DECORATORS (TypeScript 5.0+)
// ============================================

/*
New ECMAScript decorator syntax (Stage 3):

function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name);
  
  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`Entering ${methodName}`);
    const result = target.call(this, ...args);
    console.log(`Exiting ${methodName}`);
    return result;
  }
  
  return replacementMethod;
}

Key differences:
- No need for experimentalDecorators flag
- Different function signature with context object
- Context provides: kind, name, static, private, access, addInitializer
- No parameter decorators (not in spec)
- No emitDecoratorMetadata support
*/

export {};

