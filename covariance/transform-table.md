_WIP_

Member | Invariant `I<T>` | Covariant `I<out T>` | Contravariant `I<in T>` | Bivariant `I<out in T>`  
-------|------------------|------------|-----------|--------------  
Property | `p: T` | __`readonly `__ `p: T` | `readonly p: {}` | `readonly p: {}`
Property of `X<T>` | `p: X<T>` | __`readonly `__ `p: X<out T>` | `readonly p: {}` | `readonly p: {}`
Property of `X<out T>` | `p: X<out T>` | __`readonly `__ `p: X<out T>` | `readonly p: {}` | `readonly p: {}`
Property of `X<in T>` | `p: X<in T>` | __`readonly `__ `p: X<in out T>` | `readonly p: {}` | `readonly p: {}`
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
