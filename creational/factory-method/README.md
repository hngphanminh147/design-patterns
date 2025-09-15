# Core Concept

### Definition

Factory Method defines an interface for creating an object but lets **subclasses** decide which concrete class to instantiate. It moves the new decision to a **“creator”** hook , enabling extension without modifying client logic.

### Primary purpose

- Decouple object creation from object usage.
- Support substituting concrete implementations (vendors/algorithms) by extending a creator instead of editing existing code.

### Analogy (real-world)

A **newsroom editor** (Creator) assigns an article to a **specialized reporter** (Product) based on topic. The editor follows the same workflow (interview → draft → review) but **chooses which reporter to “create”** (TechReporter, SportsReporter) depending on the story. The workflow stays; the **creation hook** varies.

# Structure & Components

### Participants

- **Product (interface/abstract class)** — the type clients depend on (e.g., Transport, MessageQueue, Parser).

- **ConcreteProductA/B** — concrete implementations.

- **Creator (abstract class)** — provides business operation(s) that use Product, and declares a factory method (e.g., protected abstract createProduct(): Product).

- **ConcreteCreatorA/B** — override the factory method to return a specific ConcreteProduct.

```
             +--------------------+
             |      Creator       |
             |--------------------|
             | + operation(): any |  <-- template-like operation using Product
             | # createProduct(): |  <-- factory method (hook)
             |     Product        |
             +----------+---------+
                        ^
     +------------------+------------------+
     |                                     |
+----+----------------+         +----------+--------------+
|  ConcreteCreatorA   |         |   ConcreteCreatorB      |
|---------------------|         |-------------------------|
| # createProduct():  |         | # createProduct():      |
|   ProductA          |         |   ProductB              |
+----------+----------+         +-----------+-------------+
           |                                |
     +-----+-----+                     +----+------+
     | ProductA  |                     | ProductB |
     +-----------+                     +----------+
            ^                                ^
            |                                |
            +------- Product (interface) ----+


```

### Sequence flow

1. Client calls `creator.operation()`.
2. Inside `operation`, the **factory method** `createProduct()` is invoked.
3. The concrete creator decides which **ConcreteProduct** to instantiate.
4. `operation` uses the product through the **Product** interface.

# Common Pitfalls

1. **Class explosion**: too many concrete creators for small variations. Consider a Strategy inside a single creator, or a Simple Factory.
2. **Doing business logic inside the factory method**: keep it focused on creation.
3. **Leaking concretes**: return concrete types in signatures; always return the Product interface.
4. **Confusing with Abstract Factory**: AF creates families of related products; FM creates one product per call.

# Use Cases

### Shines when

- **Framework hooks**: You provide a base service with `createX()` app developers subclass to integrate a specific vendor.
- **Testability**: Swap `ConcreteCreator` to produce fakes/in-memory implementations in tests without touching the algorithm.

- **Plug-and-play integrations**: HTTP client, serializer, storage backend—creator stays stable; products vary.

### When not to use it

- Only one concrete exists and won’t change → a simple **constructor** or **DI binding** is clearer.
- You need multiple related objects at once → consider **Abstract Factory**.
- You need step-by-step assembly of a complex object → use **Builder**.

### Real-world examples

- **SLF4J**: `LoggerFactory.getLogger(...)` returns a `Logger` implementation chosen at runtime.

- **JDBC**: `DriverManager.getConnection(...)` returns a vendor-specific `Connection` via registered drivers.

- **Java Concurrency**: `Executors.newFixedThreadPool(...) `(often cited as “static factory method”).

# Comparison &

### Factory Method vs Abstract Factory

- FM: one product; subclass decides the concrete.
- AF: creates families of related products via multiple factory methods.

### Factory Method vs Strategy

- FM: varies which class you instantiate.

- Strategy: varies behavior/algorithm at runtime via composition (often paired).

### Factory Method vs Builder

- FM: instant creation of a product;

- Builder: stepwise construction of a complex product.

# Trade-offs

### Pros

- Strong **OCP**: add new ConcreteCreator without modifying Creator.
- Improves testability via substitution.
- Centralizes creation logic; business logic stays clean.

### Cons

- More classes/indirection.
- Can be overkill vs a simple DI container mapping.
- If selection must happen at runtime based on data, subclassing alone may be insufficient—combine with **Strategy** or a **registry**.

# Advanced Insight

#### Variations

- **Parametric Factory Method** — `create(type: string): Product` still a factory method but implemented via a registry/switch.

- **Self-registering products** — products register constructors in a map used by the factory method (helps avoid switch-case sprawl).

- **Async Factory Method** — return `Promise<Product>` for resources requiring async bootstrap.

#### With SOLID

- **Single-responsibility principle**: Creator focuses on orchestration; factory method focuses on creation.
- **Open–closed principle**: Add new products by extending (new ConcreteCreator), not editing Creator.
- **Dependency inversion principle**: Creator depends on **Product abstractions**, not concretes.

### Modern adaptations

- **Pluggable storage/queue**: same service code, different backend chosen by environment via `ConcreteCreator`.
- **Tenant-aware creators**: subclass per tenant/region to select different concrete product (e.g., region-specific KMS/Blob store).
- **Framework DI**: In NestJS, you can emulate FM by exposing an abstract provider and wiring `useClass/useFactory` per env—conceptually similar.
