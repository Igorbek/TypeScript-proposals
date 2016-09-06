# Covariance/Contravariance annotations proposal for TypeScript

## Background

There are an outstanding issue in the type system that the proposal tries to address. 
It is that assignability checking does not respect contravariant nature of function input parameters:

```ts
class Base { public a; }
class Derived extends Base { public b; }

function useDerived(derived: Derived) { derived.b; }

const useBase: (base: Base) => void = useDerived; // this must not be allowed
useBase(new Base());	// no compile error, runtime error
```

Currently, [TypeScript considers input parameters _bivariant_](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Type%20Compatibility.md#function-parameter-bivariance).
That's been designed in that way to avoid too strict assignability rules that would make language use much harder. Please see [links section](#links) for argumentation from TypeScript team.

## Proposal summary

Please see [proposal document](proposal.md) for details. 

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

## Table of Content

1. [Proposal](proposal.md)
    1. [Transform rules](transform-rules.md)
    2. [Transform example table](transform-table.md)
2. [Examples](examples/)
2. [Grammar](grammar.md)

## <a name="links"></a>Links

- Original suggestion/discussion: https://github.com/Microsoft/TypeScript/issues/1394
- Stricter TypeScript: https://github.com/Microsoft/TypeScript/issues/274
- Suggestion to turn off parameter covariance: https://github.com/Microsoft/TypeScript/issues/6102
