interface A {
    x: string;
}

interface B {
    x: string;
    y: string;
}


function copyB(value: B): B {
    return undefined;
}

var values: A[] = [];

values.map(value => copyB(value)) // fails as expected
values.map(copyB); // <-- expected to fail, but it does not