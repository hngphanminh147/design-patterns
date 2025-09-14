# Core Concept

### Definition

Ensure a class has only one instance and provide a global access point to it.

### Primary purpose

Coordinate access to a shared resource (e.g., configuration, connection pools, loggers) and guarantee only one instance exists within a given runtime.

### What problem does it solve?

Without a singleton, you can accidentally create multiple instances of something that should be unique (e.g., two DB connection pools), causing resource contention, duplicate work, or inconsistent state.

### Analogy (real-world)

Think of an air traffic control tower at an airport: one authoritative tower coordinates all planes. If every airline spun up their own tower, you’d have chaos.

# Structure & Components

### Key parts

#### Singleton (the class)

- Private constructor (prevents new from outside).

- A static store for the single instance.

- A static accessor (getInstance()) returning that instance.

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

1. Client calls ResourceManager.getInstance().

2. If the instance doesn’t exist, the class constructs it once.

3. Returns the same instance for all future calls.

4. Client invokes operations on that instance.

# Common pitfalls

1. Global state and tight coupling

   - Overusing singletons turns them into implicit globals → hard to test & mock.

   - Mitigation: Hide behind interfaces; inject (even if instance is a singleton).

2. Concurrency & race conditions during async init

   - Multiple await getInstance() calls may initialize twice if not guarded.

   - Mitigation: use a single initPromise (shown above).

3. Multiple processes = multiple “singletons”

   - Node cluster, PM2, containers, serverless cold starts → one instance per process, not truly global.

   - Mitigation: if true uniqueness is required, use distributed locks (Redis, etcd, ZooKeeper) or leader election.

4. Hot reload / test runners

   - Jest/hot-reload may clear module cache → re-instantiation.

   - Mitigation: structure init idempotently; in tests, reset via explicit dispose(); avoid side effects at import time.

5. Cyclic dependencies

   - A imports B and B imports A → undefined in one path.

   - Mitigation: extract shared contracts to a third module; invert dependencies.

# Use Cases

### Shines when

- Configuration/Secrets service: a single read-through cache of config (backed by GCP Secret Manager).

- Connection pools: Postgres/Redis/Kafka producer. One pool per process avoids resource sprawl.

- Centralized logging/metrics: a single logger or telemetry client.

### When not to use

- Multi-tenant or per-request state → use DI scopes (e.g., NestJS REQUEST scope) or factory per tenant.

- Business logic as singletons: limits testability and violates SRP.

- Distributed “only one in the whole cluster”: don’t fake it—do leader election or a distributed lock.

### Real-world examples

- NestJS providers are singleton-scoped by default per module (unless set to REQUEST or TRANSIENT).

- Redux store (client SPA) functions as an app-wide singleton instance.

- Java: java.util.logging.LogManager and many frameworks treat loggers/managers as singletons.

# Comparison & Trade-offs

#### Singleton vs. Static class

Singleton: can implement interfaces, be replaced/mocked, maintain instance state, support polymorphism.

Static class: no interfaces, harder to mock/replace; good for pure functions.

#### Singleton vs. Module pattern

Module export is a form of singleton in Node due to caching. But bundling, path aliases, or workers can break the guarantee.

#### Singleton vs. Service Locator (anti-pattern)

Service Locator hides dependencies behind a global accessor (often a singleton), violating DIP and harming testability. Prefer constructor injection.

#### Singleton vs. Monostate

Monostate: many instances, shared static state. Feels like a singleton but can be confusing; generally avoid.

### Pros

- Guarantees single point of coordination

- Reduced resource footprint (one pool/logger)

- Simple access (no wiring in tiny apps)

### Cons

- Hidden coupling, harder tests/mocks

- Lifecycle pain (init/dispose)

- Not cluster/distribution-safe

- Can violate SOLID (esp. DIP/SRP) if misused

# Advanced Insight

#### Variations

- Eager vs. lazy initialization (create at load or on first - use).
- Async singleton (with an init promise / mutex).
- Multiton (one instance per key, e.g., per tenant or region).
- Scoped singletons (per request, per module) in DI containers.

#### With SOLID

- SRP: keep the singleton’s reason to change minimal (e.g., “manage DB connections”).
- OCP: expose interfaces so callers can depend on abstractions.
- LSP/ISP: keep contracts small; provide narrow interfaces.
- DIP: inject the abstraction; singleton is merely the default provider.

#### Modern architectures

- Microservices: a process-local singleton is fine (e.g., one Kafka producer per service).
- Serverless: use lazy/init-once; expect cold starts; do not assume instance reuse.
- Distributed uniqueness: use Redis Redlock, etcd, or K8s leader election for “only one worker runs task X”.
