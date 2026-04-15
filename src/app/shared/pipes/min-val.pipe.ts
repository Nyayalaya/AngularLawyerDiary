import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minVal', standalone: true })
export class MinValPipe implements PipeTransform {
  transform(values: number[]): number {
    return Math.min(...values);
  }
}