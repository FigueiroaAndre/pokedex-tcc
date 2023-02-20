# PokedexTcc

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.5.

## Tests

For each class that have been implemented in the declarative style with Rxjs, the same tests are being done at least three times but using diferent strategies:

- Subscribing: The tests focuses on using the subscribe method of [RxJS Observables](https://rxjs.dev/api/index/class/Observable) to test
- Marble: The tests focuses on using [Marble Diagrams](https://rxjs.dev/guide/testing/marble-testing) to test
- Observer-spy: The tests focuses on using [observer-spy library](https://github.com/hirezio/observer-spy) to test

Files with the extension `subscribing.spec.ts` represents unit tests using the `Subscribing` strategy

Files with the extension `marble.spec.ts` represents unit tests using the `Marble` strategy

Files with the extension `observer-spy.spec.ts` represents unit tests using the `Observer-spy` strategy

Files with just the extension `spec.ts` represents unit tests where these strategies are not appliable.

### Commands

- `npm run test` - Run all tests of the application, regardless of its strategy
- `npm run test:subscribing` - Run all tests of the application that uses `Subscribing` strategy
- `npm run test:marble` - Run all tests of the application that uses `Marble` strategy
- `npm run test:observer-spy` - Run all tests of the application that uses `Observer-spy` strategy

For each of these commands the suffix `:watch` can be added to rerun the tests whenever the files of the source code changes.
For instance, the command `npm run test:marble:watch` runs all tests of the application that uses `Marble` strategy whenever the source code of the application changes.
