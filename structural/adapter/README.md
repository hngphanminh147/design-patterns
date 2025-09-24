# Core Concept

### Definition

**Adapter** converts the interface of an existing object (**Adaptee**) into another interface (**Target**) clients expect, so classes that otherwise couldn’t work together can collaborate.

### Primary purpose

Bridge **incompatible interfaces** without changing their source code (e.g., third-party SDKs, legacy APIs), preserving client code that depends on a stable Target interface.

### Analogy (real-world)

A power plug adapter lets a US plug (adaptee) work with a EU socket (target). The wall doesn’t change and the device doesn’t change—only the adapter mediates differences.

# Structure & Components

### Participants

- **Target** – interface your app expects (e.g., PaymentPort).

- **Adaptee** – existing/foreign interface (e.g., StripeSdk, PaypalSdk).

-- **Adapter** – implements Target, holds a reference to **_Adaptee_**, translates calls, types, and errors.

- **Client** – uses **Target** only, unaware of **Adaptee**.

#### Client

- Calls Singleton.getInstance() instead of new.

```
+-------------------------------------+
|     <<Singleton>>                   |
|   ResourceManager                   |
+-------------------------------------+
| - static instance                   |
| - constructor() // private          |
+-------------------------------------+
| + getInstance(): ResourceManager    |
| + doWork(): void                    |
+-------------------------------------+

Client ---> ResourceManager.getInstance() ---> same object every time
```

### Sequence flow

1. **Client** calls `Target.request()`.
2. **Adapter** translates to `Adaptee.specific()` (map params, units, sync/async, errors).
3. **Adapter** returns results in **Target** format.

# Common pitfalls

- Shallow mapping only (ignoring edge fields → data loss).

- Leaky abstraction (returning SDK codes/messages upstream).

- Async mismatches (callback → Promise, stream → buffer).

- Stateful adapter sharing mutable state across requests; prefer stateless or isolate state.

- Performance: avoid unnecessary copies; watch large payload transforms.

# Use Cases

### Shines when

- Integrating **multiple vendors** under a single port (payments, storage, SMS, email).

- **Legacy ↔ modern migrations** (wrap legacy API to match new service interface).

- **Sync↔Async bridging** (callback-style SDK adapted to Promise API via `util.promisify`).

- **Type conversions** (binary↔text, streaming↔batch, units & locales).

### When not to use

- You only need to simplify a subsystem without changing interface → **Facade**, not Adapter.

- You need to extend behavior without changing interface → **Decorator**, not Adapter.

- The mismatch is **semantic**, not syntactic (different business meaning) → needs domain translation/Anti-corruption Layer (DDD), which is broader than a thin Adapter.

### Real-world examples

- **Java**: `InputStreamReader` adapts byte streams to char readers; `Arrays.asList()` adapts array to `List`.

- **.NET**: `IFormatProvider` adapters; `HttpMessageHandler` chains often adapt interfaces.

- **Node/TS**: `util.promisify` (callback→Promise), RxJS `from(fetch())` (Promise→Observable).

- **Spring**: `HandlerMethodArgumentResolver` adapts web request details to controller params.

# Comparison & Trade-offs

#### Adapter vs Facade

- Adapter: convert one interface to another expected interface (client stays same).

- Facade: provide a simplified interface to a complex subsystem (client changes to use facade).

#### Adapter vs Bridge

- Adapter: post-hoc integration of incompatible interfaces.

- Bridge: design-time separation of abstraction and implementation to vary independently.

#### Adapter vs Decorator

- Adapter: changes interface.

- Decorator: preserves interface, adds responsibilities.

#### Adapter vs Strategy

- Adapter: shape conversion.

- Strategy: algorithm substitution behind the same interface (often works nicely with an Adapter).

# Trade-offs

### Pros

- Reuse existing code without modification.

- Decouple client from third-party/legacy changes.

- Enables incremental migration between vendors.

### Cons

- Another layer to maintain; potential performance overhead.

- Risk of leaky abstractions/partial mappings.

- If mismatches are semantic, adapter alone is insufficient.

# Advanced Insight

#### Variations

- **Class Adapter** (via multiple inheritance; e.g., C++): Adapter inherits both Target and Adaptee.

- **Object Adapter** (composition; TS/Java/C#): Adapter contains Adaptee (shown above).

- **Two-way Adapter**: implements both interfaces, allowing each side to view the other as native.

- **Default Interface Adapter**: empty no-op base class (e.g., Java’s `MouseAdapter`) to avoid implementing all methods.

#### With SOLID

- **Single-responsibility principle**: isolates translation logic in one place.
- **Open–closed principle**: add new adapters without changing clients.
- **Liskov Substitution Principle**: adapter must honor Target’s contract semantics, not just shape.
- **Dependency inversion principle**: clients depend on Target abstraction; adapters bind concretes at edges.

### Modern adaptations

- **Microservices**: implement **Anti-corruption Layer** at bounded-context boundaries (often a richer, domain-aware Adapter).

- **Cloud vendor ports**: `BlobStore`, `Queue`, `KMS` ports with adapters for AWS/GCP/Azure.

- **Observability**: adapt metrics/logging/tracing SDKs to a unified telemetry interface.
