import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileUrl',
  standalone: true
})
export class FileUrlPipe implements PipeTransform {
  transform(file: File): string | null {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  }
}
