# Creational Patterns

Creational design patterns focus on the process of **object creation**.

Their purpose is to:

- **Abstract object instantiation** (hide new calls and construction details).
- **Provide flexibility** in deciding what, when, and how to create objects.
- **Encapsulate complex creation logic** to make systems more maintainable and extensible.

They are useful when:

- You want to **decouple** clients from concrete classes.
- Object construction is **non-trivial** (expensive, has many variations, or must follow rules).

# Pattern Summaries

| Pattern              | Intent                                                                     | Key Participants                            | Pros                                                           | Cons                                                                  | Typical Use Cases                                          |
| -------------------- | -------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Abstract Factory** | Create **families** of related objects without specifying concrete classes | AbstractFactory, ConcreteFactory, Products  | Ensures consistency across product families; decouples clients | Adding a new product type requires updating all factories             | Cross-platform UI toolkits, cross-cloud service connectors |
| **Builder**          | Construct a **complex object step-by-step**                                | Builder, ConcreteBuilder, Director, Product | Handles optional/complex parameters cleanly; reusable process  | More classes; can be overkill for simple objects                      | Report/document generators, SQL/JSON builders, IaC DSLs    |
| **Factory Method**   | Defer instantiation to **subclasses via a method**                         | Creator, ConcreteCreator, Product           | Encapsulates creation logic; improves extensibility            | Many subclasses; runtime selection may be clumsy                      | Framework hooks, pluggable integrations, test doubles      |
| **Prototype**        | Clone an existing object (template/prefab)                                 | Prototype, ConcretePrototype, Client        | Fast object creation; avoids rebuilding complex objects        | Must implement deep copy correctly; resource duplication issues       | Game entities, config templates, document/message variants |
| **Singleton**        | Guarantee a **single instance** with global access                         | Singleton class with static instance        | Simple coordination; controlled global state                   | Can harm testability; multi-process issues; overuse = hidden coupling | Loggers, config services, DB pools, caches                 |
