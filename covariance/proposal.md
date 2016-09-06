# Proposal

1. Strengthen input parameters assignability constraints from considering _bivariant_ to considering _contravariant_.
2. Introduce type variance annotations (`in` and `out`) in generic type argument positions
    1. `in` annotates _contravariant_ generic type arguments
    2. `out` annotates _covariant_ generic type arguments
    3. `in out` and `out in` annotate _bivariant_ generic type arguments
    4. generic type arguments without these annotations are considered _invariant_  
3. The annotated generic types annotated with `in` and `out` are internally represented by compiler constructed types (transformation rules are defined in the proposal)

Additionally, there're a few **optional** modifications being proposed: 

1. Allow type variance annotation (`in` and `out`) in generic type parameter positions to instruct compiler check for co/contravariance violations.
2. Introduce write-only properties (in addition to read-only), so that contravariant counterpart of read-write property could be extracted
3. Improve type inference system to make possible automatically infer type variance from usage

## Strengthen input parameters assignability constraints

Consider input parameters of a fanction ~~bivariant~~ contravariant.
Emit error if 

```ts
class Base { public a; }
class Derived extends Base { public b; }

function useDerived(derived: Derived) { derived.b; }

const useBase: (base: Base) => void = useDerived; // this must not be allowed
```

## Terminology

For any type `G` each type reference it uses in the declaration is broken down to:
- _covariant_ type positions:
    - return types of methods, call signatures, and construct signatures
    - type of read-only properties
    - return types of property getters
    - return types of read-only index signatures
- _contravariant_ type positions:
    - parameter types of methods, call signatures, and construct signatures
    - parameter types of property setters
    - accepting types of (_not supported_) write-only properties
    - index types of index signatures
    - accepting types of (_not supported_) write-only index signatures
- _invariant_ type positions:
    - property types of read-write properties
    - return types of index signatures

Note, _ivariant_ is considered to be both _covariant_ and _contravariant_ at the same time. 

## Constructing types 

Defenitions:
- within a generic type, _covariant type_ is one of the following types:
  - a generic type argument annotated with `out` modifier (or with both `in` and `out`)
  - a union type where one of its constituents is a _covariant type_
  - an intersection type where one of its constituents is a _covariant type_
- within a generic type, _contravariant type_ is one of the following types:
  - a generic type argument annotated with `in` modifier (or with both `in` and `out`)
  - a union type where one of its constituents is a _contravariant type_
  - an intersection type where one of its constituents is a _contravariant type_ 

```ts
<in T, out R> {
 T // contravariant
 R // covariant
 T | number // contravariant
 R & string // covariant 
}
```

- if a type member references a covariant type at contravariant type position, it is stripped out
  - `<out T> { ` ~~`read(x: T): void;`~~ `}`
  - read-write properties are splitted to two entities - a read-only property which is a covariant position and a write-only property wich is a contravariant position
  - `<out T> { ` ~~`prop: T`~~ `readonly prop: T; }`
- is a type member references a contravariant type at covariant position, the type is reset to `{}` type
  - `<in T> { call(): ` ~~`T`~~ `{} }`

## Examples

```ts
interface A<T> {
    read(): T;
    write(x: T): void;
}
/* constructed */ interface A<out T> {
    read(): T;
    //write(x: T): void; // filtered out
}
/* constructed */ interface A<in T> {
    read(): {}; // return type downgraded to {}
    write(x: T): void;
}

// Covariance

declare var adog: A<Dog>;
const aanimal1 = adog as A<Animal>;          // current
const aanimal2 = adog as A<out Animal>;      // proposed

adog.read(); // ok, returns a Dog
aanimal1.read(); // ok, returns a Dog which is an Animal
aanimal2.read(); // ok, returns a Dog which is an Animal

adog.write(new Animal());       // fails, accepts a Dog which is not what all Animals are
aanimal1.write(new Animal());   // ok, but must fail
aanimal2.write(new Animal());   // fails, method is filtered out

// Contravariance

declare var aanimal: A<Animal>;
const acat1 = aanimal as A<Cat>;
const acat2 = aanimal as A<in Cat>;

aanimal.read() as Cat; // fails, returns an Animal which is not a Cat
acat1.read() as Cat;   // ok, but must fail
acat2.read() as Cat;   // fails, method is filtered out

aanimal.write(new Cat()); // ok, accepts a Cat which is an Animal
acat1.write(new Cat());   // ok, accepts a Cat
acat2.write(new Cat());   // ok, accepts a Cat  
```

## Type transforms



```ts
interface A<T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): B<T>;
    readonly prop2: B<T>;
    readonly [index: string]: B<T>;
    (): B<T>;

    // contravariant positions
    write(x: B<T>): void;
    (x: B<T>): void;

    // invariant positions
    readWrite(x: B<T>): B<T>;
    prop3: B<T>;
    [index: string]: B<T>;
    (x: B<T>): B<T>; 
}

interface A<out T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): B<out T>;
    readonly prop2: B<out T>;
    readonly [index: string]: B<out T>;
    (): B<out T>;

    // contravariant positions
    //write(x: B<T>): void;
    //(x: B<T>): void;

    // invariant positions
    //readWrite(x: B<T>): B<T>;
    readonly prop3: B<out T>;   // transforms to readonly
    readonly [index: string]: B<out T>; // transforms to readonly
    //(x: B<T>): B<T>;
}

interface A<in T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): B<in out T>;    // only invariant part is returned
    readonly prop2: B<in out T>;    // use invariant 
    readonly [index: string]: B<in out T>;
    (): B<in out T>;

    // contravariant positions
    write(x: B<in T>): void;
    (x: B<in T>): void;

    // invariant positions
    readWrite(x: B<in T>): B<in out T>;
    readonly prop3: B<in out T>;
    readonly [index: string]: B<in out T>;
    (x: B<in T>): B<in out T>;
}

```
