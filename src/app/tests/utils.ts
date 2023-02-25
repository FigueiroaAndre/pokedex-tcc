import { ComponentFixture } from "@angular/core/testing";

export function dispatchNewInputValue<T>(fixture: ComponentFixture<T>, input: HTMLInputElement, value: any): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}