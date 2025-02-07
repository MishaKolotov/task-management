import { Signal, } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface HasTitle {
  title: string;
}

export function uniqueValidator<T extends HasTitle>(
  itemsSignal: Signal<T[]>
): ValidatorFn {
  return ({ value }: AbstractControl): ValidationErrors | null => {
    if (!value) {
      return  null;
    }

    const items = itemsSignal();

    if (items.some((item) => item.title === value.trim())) {
      return { isDuplicated: true };
    }

    return null;
  };
}
