# Core Concept

### Definition

Separates the construction of a complex object from its representation, so the same construction process can create different representations.

### Primary purpose

- Handle objects with **many optional/complex parts**.
- Avoid “telescoping constructors” (constructors with 10+ parameters).
- Provide a **step-by-step construction** API that is flexible and readable.

### Analogy (real-world)

Think of ordering a pizza:

- You start with the base.
- Add cheese, toppings, sauces, etc.
- Each step is optional, and you want flexibility in order.
- At the end, you “build” and get your pizza.

# Structure & Components

### Participants

- **Product** – the complex object to be built (e.g., Car, Report, Notification).
- **Builder** – abstract interface defining building steps (setPartA, setPartB).
- **ConcreteBuilder** – implements steps, keeps track of the constructed product, and returns it.
- **Director** _(optional)_ – orchestrates the order of steps for common configurations.
- **Client** – uses either the Builder directly or via the Director.

```
       +-----------+
       |  Director |
       +-----------+
             |
             v
+-----------------------+
|      Builder          |<----------------+
| + setPartA(): void    |                 |
| + setPartB(): void    |                 |
| + getResult(): Product|                 |
+-----------+-----------+                 |
            ^                             |
            |                             |
   +--------+---------+                   |
   | ConcreteBuilder  |                   |
   |------------------|                   |
   | - product: Prod  |                   |
   | + setPartA()     |                   |
   | + setPartB()     |                   |
   | + getResult()    |-------------------+
   +------------------+
            |
            v
       +---------+
       | Product |
       +---------+

```

### Sequence flow

1. Client chooses a **ConcreteBuilder**.
2. **(Optional)** Client gives it to **Director** to enforce a build sequence.
3. **Builder** step-by-step configures the **Product**.
4. Client calls getResult() to obtain the final object.

# Use Cases

### Shines when

- **Complex object assembly**: Reports, configuration objects, SQL queries.
- **Multiple representations**: Build HTML, PDF, and JSON versions from the same steps.
- **Optional/variable parameters**: APIs where only some fields are required.

### When not to use it

- Object has only 2–3 fields → a simple constructor or factory is clearer.
- If object assembly doesn’t need to vary → avoid the extra indirection.
- When immutability is critical (builder usually implies mutability during construction).

### Real-world examples

- Java: StringBuilder, StringBuffer.
- Lombok @Builder annotation → generates builder for complex POJOs.
- Node.js: Many client libraries (AWS SDK, Knex.js query builder).

# Comparison &

### Builder vs Factory Method

- Builder → builds step-by-step
- Factory Method → returns one object immediately.

### Builder vs Abstract Factory

- AF → families of related objects
- Builder → one complex object with many parts.

### Builder vs Prototype

- Prototype → clone existing object
- Builder → assemble from scratch.

# Trade-offs

### Pros

- Clean API for optional/complex parameters.
- Can vary representation with different builders.
- Improves readability (.setTitle(...).setBody(...).build()).

### Cons

- Extra classes/interfaces.
- Must reset builder to avoid state leakage.
- May feel heavy for simple objects.

# Advanced Insight

#### Variations & extensions

- **Fluent Builder** (most common in TS/Java): chainable calls.
- **Immutable Builder**: builder returns a new object each time → safe in functional contexts.
- **Nested Builders**: for hierarchical objects (e.g., HTML DOM, JSON structures).
- **Hybrid with Director**: pre-defined recipes for standard configurations.

#### With SOLID

- **Single-responsibility principle**: product focuses on representation, builder focuses on construction.
- **Open–closed principle**: add new builders without touching client or product.
- **Dependency inversion principle**: client depends on builder abstraction.

### Modern adaptations

- Cloud IaC DSLs: e.g., AWS CDK uses builder-like chaining (bucket.addLifecycleRule(...)).
- Database query builders: Knex.js, TypeORM.
- Microservices config builders: fluent APIs for building complex request payloads.
