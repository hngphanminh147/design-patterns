# Core Concept

### Definition

Provide an interface to create families of related objects (products) without specifying their concrete classes.

### Primary purpose

Let the client construct a consistent set of components that are guaranteed to work together (same “family”), while keeping the client decoupled from vendor-specific or environment-specific implementations.

### Analogy (real-world)

Buying furniture for a room: you pick a style (Scandinavian, Industrial), then get a matching set (sofa, table, lamp) that fits together. You don’t want to mix random pieces and hope they match. Similarly, abstract factory ensures you get a coordinated set of related components (e.g., cloud resources from the same provider) that interoperate.

# Structure & Components

### Participants

- AbstractFactory – declares creation methods for each abstract product (e.g., createQueue(), createBlobStore(), createSecretVault()).

- ConcreteFactoryA/B – provide implementations that return concrete products from the same family (AWS vs GCP).

- AbstractProductX – interfaces for each product kind (e.g., MessageQueue, BlobStore).

- ConcreteProductX_A/B – concrete implementations (e.g., SqsQueue, PubSubQueue).

- Client – uses only the abstract types; never references concretes.

```
               +------------------------+
               |     AbstractFactory    |
               |------------------------|
               | + createQueue(): MQ    |
               | + createStore(): Store |
               | + createVault(): Vault |
               +-----------+------------+
                           ^
        +------------------+------------------+
        |                                     |
+---------------------+             +---------------------+
|  ConcreteFactoryA   |             |  ConcreteFactoryB   |
|---------------------|             |---------------------|
| + createQueue(): MQ |             | + createQueue(): MQ |
| + createStore(): St |             | + createStore(): St |
| + createVault(): V  |             | + createVault(): V  |
+----------+----------+             +----------+----------+
           |                                   |
     +-----+-----+                       +-----+-----+
     |  MQ_A     |                       |  MQ_B     |    (Product family)
     +-----------+                       +-----------+
     |  St_A     |                       |  St_B     |
     +-----------+                       +-----------+
     |  V_A      |                       |  V_B      |
     +-----------+                       +-----------+

Client --> uses AbstractFactory to get products; products are compatible within family A or B
```

### Sequence flow

1. Client selects a ConcreteFactory (e.g., from config: AWS or GCP).

2. Client asks factory to create products (queue, store, vault).

3. Each product returned is compatible (same family).

4. Client works only with abstract product interfaces.

# Use Cases

### Shines when

- Cross-cloud portability: choose AWS or GCP resource families at runtime/compile-time.

- Theming/Skins: UI component kits (Button/TextInput/Dialog) for Light vs Dark vs High-Contrast themes (same API, different look & feel).

- Database vendor families: dialect-specific implementations (e.g., Connection, QueryBuilder, Migrator) for Postgres vs MySQL, used together consistently.

### When not to use it

- Only one product type or one implementation is expected → Factory Method or simple DI binding is enough.

- Products are unrelated (no need for “family cohesion”) → separate small factories or Strategy.

- You need to add new product types frequently → AF makes that painful (must touch all factories).

### Real-world examples

- Java: javax.xml.parsers.DocumentBuilderFactory, javax.xml.transform.TransformerFactory, javax.net.ssl.SSLSocketFactory.

- .NET: DbProviderFactory for ADO.NET providers.

- UI toolkits: Swing “Look & Feel”, Qt styles—swap a whole family of widgets at once.

# Comparison & Trade-offs

#### Abstract Factory vs Factory Method

FM creates one product; AF creates families of products via multiple factory methods.

### Abstract Factory vs Builder

Builder assembles one complex object step-by-step; AF returns multiple related objects ready to use.

### Abstract Factory vs Strategy/State

Strategy/State swap algorithms/behaviors for a single role; AF swaps whole sets of components.

### Pros

- Strong decoupling
- Consistent families
- Easy provider swap
- Test doubles are trivial.

### Cons

- More interfaces/boilerplate
- Harder to add new product kinds
- Can be overengineering.

# Advanced Insight

#### Variations & extensions

- Async Abstract Factory: methods return Promise<Product> if initialization is expensive.

- Registry/Plugin AF: register concrete factories by key (e.g., "aws" -> AwsFactory), load at runtime (env/feature flag).

- Prototype-based AF: factory clones pre-registered prototypes instead of new.

- Multiton: one factory per key (tenant/region), each producing a consistent product family.

- Functional AF (TS): use object literals with function fields instead of classes—great for lightweight DI.

#### With SOLID

- DIP: client depends on abstractions (interfaces) → ✅
- OCP: adding a new family (new concrete factory) is open; adding a new product kind forces edits → partially closed.
- SRP: factories do only creation; products do behavior → ✅

### Modern adaptations

- Microservices: pick a provider factory per service/tenant/region; combine with Feature Flags or K8s env for safe rollout.
- Serverless: choose factory on cold start; reuse instances across invocations where possible.
- Combine with Bridge: product interfaces can be bridges (e.g., BlobStore abstraction) while AF selects the concrete bridge implementations as a family.
