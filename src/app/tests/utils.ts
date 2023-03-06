import { ComponentFixture } from "@angular/core/testing";
import { createAction } from "@ngrx/store";

export function dispatchNewInputValue<T>(fixture: ComponentFixture<T>, input: HTMLInputElement, value: any): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

export const INITIAL_ACTION = createAction('@ngrx/store/init')();