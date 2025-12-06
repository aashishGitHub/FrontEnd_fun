/**
 * TypeScript Async/Await Compilation Examples
 * 
 * Demonstrates how async/await is transformed during
 * downlevel compilation to ES5 vs kept native in ES2017+.
 */

// ============================================
// 1. BASIC ASYNC FUNCTION
// ============================================

// This simple async function...
async function fetchUserData(userId: string): Promise<{ name: string; email: string }> {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return {
    name: data.name,
    email: data.email
  };
}

/*
COMPILED TO ES2017+ (Native):
-----------------------------
async function fetchUserData(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    return {
        name: data.name,
        email: data.email
    };
}

COMPILED TO ES5 (Downlevel):
----------------------------
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, /* ... */
};

function fetchUserData(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, fetch("/api/users/" + userId)];
                case 1:
                    response = _a.sent();
                    return [4, response.json()];
                case 2:
                    data = _a.sent();
                    return [2, {
                        name: data.name,
                        email: data.email
                    }];
            }
        });
    });
}
*/

// ============================================
// 2. MULTIPLE AWAIT STATEMENTS
// ============================================

async function processOrders(orderIds: string[]): Promise<void> {
  console.log("Starting to process orders...");
  
  for (const orderId of orderIds) {
    const order = await fetchOrder(orderId);
    await validateOrder(order);
    await processPayment(order);
    await shipOrder(order);
  }
  
  console.log("All orders processed!");
}

// Helper functions (stubs)
async function fetchOrder(id: string) {
  return { id, amount: 100, status: "pending" };
}
async function validateOrder(order: any) {
  return true;
}
async function processPayment(order: any) {
  return { transactionId: "txn-123" };
}
async function shipOrder(order: any) {
  return { trackingNumber: "ship-456" };
}

/*
ES5 Compilation creates a state machine:
- Each 'await' becomes a 'case' in a switch statement
- State is tracked via _a.label
- Generator yields at each await point
*/

// ============================================
// 3. ERROR HANDLING WITH TRY/CATCH
// ============================================

async function safeApiCall<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
    
  } catch (error) {
    console.error("API call failed:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/*
In ES5, try/catch is handled through the __generator helper:
- The 'trys' array tracks try block boundaries
- Errors are caught and rethrown appropriately
*/

// ============================================
// 4. ASYNC CLASS METHODS
// ============================================

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async delete(endpoint: string): Promise<void> {
    await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE"
    });
  }
}

// ============================================
// 5. ASYNC ARROW FUNCTIONS
// ============================================

const fetchWithTimeout = async (
  url: string,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// ============================================
// 6. PARALLEL VS SEQUENTIAL AWAIT
// ============================================

// SEQUENTIAL - slower, each await waits for the previous
async function sequentialFetch(urls: string[]): Promise<Response[]> {
  const results: Response[] = [];
  
  for (const url of urls) {
    const response = await fetch(url);  // Waits for each one
    results.push(response);
  }
  
  return results;
}

// PARALLEL - faster, all requests start immediately
async function parallelFetch(urls: string[]): Promise<Response[]> {
  // Start all fetches immediately
  const promises = urls.map(url => fetch(url));
  
  // Wait for all to complete
  return Promise.all(promises);
}

// PARALLEL WITH ERROR HANDLING - get all results even if some fail
async function parallelFetchWithSettled(urls: string[]) {
  const promises = urls.map(url => fetch(url));
  const results = await Promise.allSettled(promises);
  
  return results.map((result, index) => ({
    url: urls[index],
    status: result.status,
    value: result.status === "fulfilled" ? result.value : null,
    reason: result.status === "rejected" ? result.reason : null
  }));
}

// ============================================
// 7. ASYNC GENERATORS (ES2018+)
// ============================================

async function* fetchPages(baseUrl: string): AsyncGenerator<any[], void, void> {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasNextPage;
    page++;
  }
}

// Usage:
async function processAllPages() {
  for await (const items of fetchPages("/api/items")) {
    console.log(`Processing ${items.length} items`);
    // Process each page of items
  }
}

// ============================================
// 8. TOP-LEVEL AWAIT (ES2022 / ES Modules)
// ============================================

/*
With "module": "esnext" or "es2022", you can use top-level await:

// config.ts
const response = await fetch('/api/config');
export const config = await response.json();

// main.ts
import { config } from './config';
console.log(config.apiKey);  // Config is already loaded!
*/

// ============================================
// 9. COMPILATION TARGETS COMPARISON
// ============================================

/*
| Target    | async/await | Generators | Helpers Required |
|-----------|-------------|------------|------------------|
| ES5       | Transformed | Polyfilled | __awaiter, __generator |
| ES2015    | Transformed | Native     | __awaiter |
| ES2017+   | Native      | Native     | None |

Bundle Size Impact:
- ES5: ~800+ bytes for helpers (inline)
- ES2017: ~0 bytes (native support)

Use importHelpers: true with tslib to reduce size:
{
  "compilerOptions": {
    "target": "ES5",
    "importHelpers": true
  }
}

Then helpers are imported from tslib:
import { __awaiter, __generator } from "tslib";
*/

// ============================================
// 10. BEST PRACTICES
// ============================================

// ✅ Always handle errors
async function goodErrorHandling() {
  try {
    const data = await fetchUserData("123");
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;  // Re-throw or handle appropriately
  }
}

// ✅ Use Promise.all for parallel operations
async function goodParallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  return { user, posts, comments };
}

// ❌ Avoid: Sequential when parallel is possible
async function badSequential() {
  const user = await fetchUser();       // Wait...
  const posts = await fetchPosts();      // Wait...
  const comments = await fetchComments(); // Wait...
  return { user, posts, comments };      // 3x slower!
}

// Stub functions
async function fetchUser() { return { id: "1", name: "User" }; }
async function fetchPosts() { return [{ id: "1", title: "Post" }]; }
async function fetchComments() { return [{ id: "1", text: "Comment" }]; }

// ✅ Use AbortController for cancellation
async function cancellableFetch(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal });
  return response.json();
}

// Usage:
// const controller = new AbortController();
// cancellableFetch('/api/data', controller.signal);
// controller.abort();  // Cancel the request

export {};

