# Proposal

## Grammar

*TypeArgument*:  
&emsp;~~*Type*~~  
&emsp;*TypeArgumentVariance*<sub>opt</sub> *Type*  
*TypeArgumentVariance*:  
&emsp;`in`  
&emsp;`out`  
&emsp;`in out`  
&emsp;`out in`


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

Member | Invariant `I<T>` | Covariant `I<out T>` | Contravariant `I<in T>` | Bivariant `I<out in T>`  
-------|------------------|------------|-----------|--------------  
Property | `p: T` | __`readonly `__ `p: T` | `readonly p: {}` | `readonly p: {}` 
Getter | `get p: T` | `get p: T` | `get p: {}` | `get p: {}`
Setter | `set p(v: T)` | ~~`set p(v: T)`~~ | `set p(v: T)` | ~~`set p(v: T)`~~
Readonly Property | `readonly p: T` | `readonly p: T` | `readonly p: {}` | `readonly p: {}`
Method returning `T` | `read(): T` | `read(): T` | `read(): {}`
Method accepting `T` | `write(v: T): void` | ~~`write(v: T): void`~~ | `write(v: T): void`
Method accepting and returning `T` | `readWrite(v: T): T` | ~~`readWrite(v: T): T`~~ | `readWrite(v: T): {}`
Indexer | `[n: string]: T` | __`readonly`__ `[n: string]: T` | __`readonly`__ `[n: string]: {}` 
Call returning `T` | `(): T` | `(): T` | `(): {}`
Call accepting `T` | `(v: T): void` | ~~`(v: T): void`~~ | `(v: T): void`
Call accepting and returning `T` | `(v: T): T` | ~~`(v: T): T`~~ | `(v: T): {}`
Types constructed with `T` in covariant position | `(): T[]` | `(): out T[]` | `(): out in T`
  | `(): X<T>` | `(): X<out T>` | `(): X<out in T>`
  | `X<out T>` | `X<out T>` | `{}`
  | `X<in T>` | `{}` | `X<in T>`
  | `read(): X<T>` | `read(): X<out T>` | `read(): X<in T>`
  | `write(x: X<T>): void` | `write(x: X<out T>): void` | `write(x: X<in T>): void`
  | `f(callback: () => T)` | ~~`f(callback: () => T)`~~ | `f(callback: () => T)`
  | `f(callback: Func<T>)` | ~~`f(callback: Func<out T>)`~~ | `f(callback: Func<in T>)`


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
