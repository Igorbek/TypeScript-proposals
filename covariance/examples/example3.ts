class A { private a; }
class B extends A { private b; }

class X<T> {
    private value: T;
    read() { return this.value; }
    write(v: T) { this.value = v; }
}

const a = new A();
const xa = new X<A>();
