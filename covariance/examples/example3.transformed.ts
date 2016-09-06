class A { private a; }
class B extends A { private b; }

class X<T> {
    private value: T;
    getString() { return this.value.toString(); }
    read() { return this.value; }
    write(v: T) { this.value = v; }
    compareTo(x: /* X<out T> */ XOut<T>) { return this.value === x.read(); }
    copyTo(x: /* X<in T> */ XIn<T>) { x.write(this.value); }
}

/* compiler constructed */
interface /* X<out T> */ XOut<T> {
    getString(): string;
    read(): T;
    //write(v: T) { this.value = v; }
    compareTo(x: XOut<T>): boolean;
    //copyTo(x: X<in T>): void;
}

/* compiler constructed */
interface /* X<in T> */ XIn<T> {
    getString(): string;
    //read(): T;
    write(v: T): void;
    //compareTo(x: X<out T>): boolean;
    copyTo(x: XIn<T>): void;
}

/* compiler constructed */
interface /* X<in out T> */ XInOut<T> {
    getString(): string;
    //read(): T;
    //write(v: T): void;
    //compareTo(x: X<out T>): boolean;
    //copyTo(x: XIn<T>): void;
}

