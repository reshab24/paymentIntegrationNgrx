import { HostListener, Renderer2 } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {

 value: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
    ) { }

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
      const filteredValue: string = this.filterValue(value);
      this.updateTextInput(filteredValue, this.value !== filteredValue);
  }

  private updateTextInput(value: string, propagateChange: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    if (propagateChange) {
    }
    this.value = value;
  }

  filterValue(value): string {
      return value.replace(/[^0-9.]*/g, '');
  }

}
