/**
 * TypeScript Module Resolution Examples
 * 
 * Demonstrates how TypeScript resolves module imports
 * with different moduleResolution strategies.
 */

// ============================================
// 1. RELATIVE VS NON-RELATIVE IMPORTS
// ============================================

// RELATIVE imports - resolved relative to importing file
// import { helper } from "./utils";
// import { Component } from "../components/Button";
// import config from "../../config";

// NON-RELATIVE imports - resolved via node_modules or baseUrl
// import React from "react";
// import { lodash } from "lodash";
// import { MyLib } from "@myorg/mylib";

// ============================================
// 2. NODE RESOLUTION STRATEGY
// ============================================

/*
For: import { x } from "moduleB"

TypeScript searches in this order:

1. /root/src/node_modules/moduleB.ts
2. /root/src/node_modules/moduleB.tsx
3. /root/src/node_modules/moduleB.d.ts
4. /root/src/node_modules/moduleB/package.json (types/main)
5. /root/src/node_modules/moduleB/index.ts
6. /root/src/node_modules/@types/moduleB.d.ts
7. /root/node_modules/moduleB... (walk up directories)
*/

// ============================================
// 3. PATH MAPPING (tsconfig.json)
// ============================================

/*
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components/*": ["components/*"],
      "@utils/*": ["shared/utils/*"],
      "@services/*": ["services/*"]
    }
  }
}

// Now you can import like this:
import { Button } from "@components/Button";
import { formatDate } from "@utils/date";
import { ApiService } from "@services/api";
*/

// ============================================
// 4. MODULE RESOLUTION STRATEGIES
// ============================================

/*
CLASSIC (Legacy):
- Searches relative to importing file
- Never looks in node_modules
- Mostly for backwards compatibility

NODE (CommonJS):
- Mimics Node.js resolution
- Searches node_modules
- Ignores package.json "exports"

NODE16 / NODENEXT (ESM):
- Full support for package.json "exports"
- Requires file extensions in ESM files
- Context-aware (CJS vs ESM)

BUNDLER (Modern):
- Designed for Vite, Webpack, etc.
- Supports package.json "exports"
- No extension requirements
*/

// ============================================
// 5. PACKAGE.JSON EXPORTS
// ============================================

/*
// node_modules/my-package/package.json
{
  "name": "my-package",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs",
      "require": "./dist/utils.cjs"
    }
  }
}

// Usage with node16/bundler resolution:
import { main } from "my-package";        // Uses "." export
import { helper } from "my-package/utils"; // Uses "./utils" export
*/

// ============================================
// 6. FILE EXTENSION REQUIREMENTS
// ============================================

/*
With moduleResolution: "node16" or "nodenext" in ESM:

// ❌ Error - missing extension
import { helper } from "./utils";

// ✅ OK - with .js extension (even for .ts files!)
import { helper } from "./utils.js";

With moduleResolution: "bundler":

// ✅ Both work!
import { helper } from "./utils";
import { helper } from "./utils.js";
*/

// ============================================
// 7. TYPE ROOTS AND TYPE ACQUISITION
// ============================================

/*
{
  "compilerOptions": {
    // Where to find type declarations
    "typeRoots": [
      "./types",           // Custom types
      "./node_modules/@types"  // DefinitelyTyped
    ],
    
    // Include specific type packages
    "types": ["node", "jest"]
  }
}
*/

// ============================================
// 8. DECLARATION FILES (.d.ts)
// ============================================

// Type declaration for a JavaScript module
// types/legacy-lib.d.ts
/*
declare module "legacy-lib" {
  export function doSomething(value: string): number;
  export const VERSION: string;
  export default class LegacyClass {
    constructor(options: { debug: boolean });
    process(data: unknown): void;
  }
}
*/

// ============================================
// 9. AMBIENT MODULE DECLARATIONS
// ============================================

// For modules without types
/*
// globals.d.ts
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.json" {
  const value: unknown;
  export default value;
}
*/

// ============================================
// 10. RECOMMENDED CONFIGURATIONS
// ============================================

/*
// For Node.js ESM projects:
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}

// For Vite/Next.js/modern bundlers:
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}

// For legacy CommonJS Node.js:
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node"
  }
}
*/

// Example exports for this module
export const moduleResolutionExample = "This demonstrates module resolution";

export function getResolutionStrategy(): string {
  return "Use 'bundler' for modern projects, 'NodeNext' for Node.js ESM";
}

