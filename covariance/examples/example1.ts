type B<T> = C<T>|A<T>;
type BOut<T> = COut<T>|AOut<T>;
type BIn<T> = CIn<T>|AIn<T>;
type BInOut<T> = CInOut<T>|AInOut<T>;

interface C<T> {
    read(): T;
    write(x: T): void;
}
interface COut<T> {
    read(): T;
}
interface CIn<T> {
    read(): {};
    write(x: T): void;
}
interface CInOut<T> {
    read(): {};
}

interface A<T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): B<T>;
    //readonly prop2: B<T>;
    //readonly [index: string]: B<T>;
    (): B<T>;

    // contravariant positions
    write(x: B<T>): void;
    (x: B<T>): void;

    // invariant positions
    readWrite(x: B<T>): B<T>;
    prop3: B<T>;
    [index: string]: B<T> | any;
    (x: B<T>): B<T>; 
}

interface AOut<T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): BOut<T>;
    //readonly prop2: B<out T>;
    //readonly [index: string]: B<out T>;
    (): BOut<T>;

    // contravariant positions
    //write(x: B<T>): void;
    //(x: B<T>): void;

    // invariant positions
    //readWrite(x: B<T>): B<T>;
    //readonly prop3: B<out T>;   // transforms to readonly
    //readonly [index: string]: B<out T>; // transforms to readonly
    //(x: B<T>): B<T>;
}

interface AIn<T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): BInOut<T>;    // only invariant part is returned
    //readonly prop2: B<in out T>;    // use invariant 
    //readonly [index: string]: B<in out T>;
    (): BInOut<T>;

    // contravariant positions
    write(x: BIn<T>): void;
    (x: BIn<T>): void;

    // invariant positions
    readWrite(x: BIn<T>): BInOut<T>;
    //readonly prop3: B<in out T>;
    //readonly [index: string]: B<in out T>;
    (x: BIn<T>): BInOut<T>;
}

interface AInOut<T> {
    // bivariant positions
    func(): void;
    func(x: number): string;
    prop: boolean;

    // covariant positions
    read(): BInOut<T>;    // only invariant part is returned
    //readonly prop2: B<in out T>;    // use invariant 
    //readonly [index: string]: B<in out T>;
    (): BInOut<T>;

    // contravariant positions
    //write(x: B<in T>): void;
    //(x: B<in T>): void;

    // invariant positions
    //readWrite(x: B<in T>): B<in out T>;
    //readonly prop3: B<in out T>;
    //readonly [index: string]: B<in out T>;
    //(x: B<in T>): B<in out T>;
}

class Animal { private x; }
class Dog extends Animal { private y; }
class Cat extends Animal { private z; }

declare var aDog: A<Dog>;
aDog.write(null as A<Dog>);
const aAnimalOutDog: AOut<Animal> = aDog;
aAnimalOutDog.read();
const aCatOutDog: AOut<Cat> = aDog; // fails, as expected
//aCatOutDog.

declare var aAnimal: A<Animal>;
const aDogInAnimal: AIn<Dog> = aAnimal;

aAnimal.write(<C<Dog>>null);
aDogInAnimal.write(<C<Dog>>null);
aDogInAnimal.write(<C<Cat>>null);