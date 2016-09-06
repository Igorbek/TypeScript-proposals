type C<T> = {
    read(): T;
    write(x: T): void;
}

// Synthesized shapes of C
type COut<T> = /* C<out T> */ {
    read(): T;
}

type CIn<T> = /* C<in T> */ {
    read(): {};
    write(x: T): void;
}

type CInOut<T> = /* C<in ou T> */ {
    read(): {};
}

class Animal { private a; }
class Cat extends Animal { private c; }
class Tiger extends Cat { private t; }
class Dog extends Animal { private d; }


const cat = new Cat();
const animal: Animal = cat;
const dog: Dog = animal;        // compile error

declare const cCat: C<Cat>;

const cAnimal: C<Animal> = cCat;    // ok now, must not be allowed
cAnimal.write(dog);                 // runtime error
const cOutAnimal: /* C<out Animal> */ COut<Animal> = cCat;
cOutAnimal.write(dog);              // compile error

const cInAnimal: /* C<in Animal> */ CIn<Animal> = cCat;    // must not be allowed
cInAnimal.write(dog);               // runtime error  

const cTiger: C<Tiger> = cCat;          // compile error
const cOutTiger: /* C<out T> */ COut<Tiger> = cCat;    // compile error
const cInTiger: /* C<in T> */ CIn<Tiger> = cCat;      // ok
cInTiger.write(new Tiger());            // ok
const tiger: Tiger = cInTiger.read();   // compile error
const something: {} = cInTiger.read();  // ok

const c: /* C<in out T> */ CInOut<Animal> = cCat; // ok
