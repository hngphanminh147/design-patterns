# Core Concept

### Definition

A **creational** pattern where you create new objects by **cloning existing ones** (the “prototypes”) instead of instantiating classes directly.

### Primary purpose

- Construct objects quickly when their setup is expensive or complex.
- Produce variants by copying a template and applying small overrides.
- Decouple clients from concrete class constructors.

### Analogy (real-world)

Think **document templates**: you keep a “base contract” and make copies, filling in only what differs (names, dates). The template guarantees a consistent starting state; cloning is faster than drafting from scratch.

# Structure & Components

### Participants

- **Prototype** (interface) – declares clone() (and often supports parameterized overrides).
- **ConcretePrototype** – implements clone(); decides shallow/deep copy semantics.
- **PrototypeRegistry** _(optional)_ – stores named prototypes; clients ask it for clones.
- **Client** – requests a clone and optionally applies overrides.

```
+-------------------+           +----------------------+
|     Prototype     |<----------|     Client           |
|-------------------|  clone()  |----------------------|
| + clone(): this   |           | uses only Prototype  |
+---------+---------+           +----------+-----------+
          ^                                 |
          |                                 |
+---------+----------+                      |
| ConcretePrototypeA |                      |
|--------------------|                      |
| + clone(): this    |                      |
+--------------------+                      |
                                            v
                                 +---------------------+
                                 |  PrototypeRegistry  |
                                 |---------------------|
                                 | + register(key,p)   |
                                 | + create(key): P    |
                                 +---------------------+

```

### Sequence flow

1. Client chooses a prototype (direct reference or via registry).
2. Client calls clone() on it.
3. Client optionally mutates the copy.
4. Client uses the cloned instance.

# Common Pitfalls

1. Accidental shallow copy → shared nested state (arrays, maps) between clones.

   - Fix: explicitly copy nested structures.

2. Copying non-clonable resources (open sockets, DB connections).

   - Fix: exclude/reattach resources; store only config/state in the prototype.

3. Circular references in object graphs.

   - Fix: custom clone logic or graph-aware cloning; avoid naive JSON cloning.

4. Method/this loss with naive JSON.parse(JSON.stringify(...)).

   - Fix: implement clone() or use structuredClone (Node 18+/modern browsers) but still handle special types (Map/Set/Date) explicitly if needed.

5. Confusing with JS prototype chain.

   - The GoF Prototype pattern is about cloning objects; the JS prototype chain is a language-level inheritance mechanism.

# Use Cases

### Shines when

- **Game dev / simulation**: spawn many entities from a **prefab** (enemy types, projectiles) with small changes.
- **Config templates**: per-tenant/per-environment configs (e.g., Kafka consumer configs) cloned from a baseline.
- **Document/message templates**: pre-filled alerts, emails, API payloads with minor overrides.

### When not to use it

- Construction is trivial or you already have a clean Builder/Factory.
- Objects carry non-copyable runtime resources (connections).
- You frequently add mandatory fields—factories or builders may express that more clearly.

### Real-world examples

- **Unity “Prefab”** system (conceptually prototype-based).
- **.NET** `ICloneable` (controversial because of shallow-vs-deep ambiguity).
- **JavaScript** ecosystems frequently use template objects cloned and extended (e.g., config objects in tooling).

# Comparison &

### Prototype vs Factory Method / Abstract Factory

- Prototype: start from an existing instance, clone, then tweak.
- Factory Method/AF: construct new instances via classes (no cloning).

### Prototype vs Builder

- Builder: step-by-step construction of one complex object.
- Prototype: duplicate a configured object quickly.

### Prototype vs Flyweight

- Flyweight: share the same instance across clients to save memory.
- Prototype: create new instances (copies), each independent.

# Trade-offs

### Pros

- Very fast instantiation for complex objects.
- Encapsulates cloning logic near the data.
- Great for many similar variants (prefabs, templates).

### Cons

- Requires careful, correct cloning (deep vs shallow).
- Can hide invariants-clients might mutate copies in unexpected ways.
- Easy to misuse with runtime resources.

# Advanced Insight

#### Variations & extensions

- **Prototype Registry**: keyed prototypes (by tenant, region, SKU).

- **Copy-on-Write**: clone shares backing data until mutation (structural sharing).

- **Hybrid with Builder**: clone a base, then run a **mini-builder** for tweaks.

#### With SOLID

- **Single-responsibility principle**: `clone()` concerns copying state; keep business logic elsewhere.
- **Open–closed principle**: add new prototypes or override clone() in subclasses without changing clients.
- **Liskov Substitution Principle**: `clone()` must return the same runtime type (`this`) so subtype contracts hold.
- **Dependency inversion principle**: clients depend on the **Prototype interface**, not concrete constructors.

### Modern adaptations

- **Microservices**: clone baseline deployment specs/alert policies per environment.
- **Feature flags**: clone a default flag set, then override for a segment.
- **IaC**: use a base stack config as a prototype; programmatic clones for regions (careful—tools like CDK/TF already have their own abstractions).
