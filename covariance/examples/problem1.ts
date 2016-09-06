class Base { public a; }
class Derived extends Base { public b; }

function useDerived(derived: Derived) { derived.b; }

const useBase: (base: Base) => void = useDerived; // this must not be allowed
useBase(new Base());	// no compile error, runtime error
