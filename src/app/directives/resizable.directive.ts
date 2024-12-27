import { Directive, ElementRef, Renderer2, HostListener, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[resizable]',
  standalone: true,
})
export class ResizableDirective implements AfterViewInit {
  @Output() resized = new EventEmitter<{ width: number; height: number; x: number; y: number }>();

  private resizing = false;
  private startX = 0;
  private startY = 0;
  private initialWidth = 0;
  private initialHeight = 0;
  private initialLeft = 0;
  private initialTop = 0;
  private resizeDirection: string = '';
  private minWidth = 50;
  private minHeight = 50;
  private parentRect: DOMRect | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.setupResizeHandles();
  }

  ngAfterViewInit() {
    this.updateParentRect();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.updateParentRect();
  }

  private updateParentRect() {
    const parent = document.querySelector('.canvas') as HTMLElement;
    if (parent) {
      this.parentRect = parent.getBoundingClientRect();
    }
  }

  private setupResizeHandles() {
    const directions = [ 'bottom', 'right', 'bottom-right'];

    directions.forEach((direction) => {
      const handle = this.renderer.createElement('div');
      this.renderer.addClass(handle, 'resize-handle');
      this.renderer.addClass(handle, direction);
      this.renderer.setStyle(handle, 'position', 'absolute');
      this.renderer.setStyle(handle, 'background-color', 'rgba(0,0,0,0.3)');
      this.renderer.setStyle(handle, 'z-index', '1');
      this.renderer.setStyle(handle, 'cursor', this.getCursor(direction));
      this.setHandlePosition(handle, direction);
      this.renderer.appendChild(this.el.nativeElement, handle);

      this.renderer.listen(handle, 'mousedown', (e: MouseEvent) => {
        this.startResize(e, direction);
      });
    });
  }

  private getCursor(direction: string): string {
    switch (direction) {
      case 'top': return 'n-resize';
      case 'bottom': return 's-resize';
      case 'left': return 'w-resize';
      case 'right': return 'e-resize';
      case 'top-left': return 'nw-resize';
      case 'top-right': return 'ne-resize';
      case 'bottom-left': return 'sw-resize';
      case 'bottom-right': return 'se-resize';
      default: return 'default';
    }
  }

  private setHandlePosition(handle: any, direction: string) {
    switch (direction) {
      case 'top': this.renderer.setStyle(handle, 'top', '-5px'); this.renderer.setStyle(handle, 'left', '50%'); this.renderer.setStyle(handle, 'transform', 'translateX(-50%)'); break;
      case 'bottom': this.renderer.setStyle(handle, 'bottom', '-5px'); this.renderer.setStyle(handle, 'left', '50%'); this.renderer.setStyle(handle, 'transform', 'translateX(-50%)'); break;
      case 'left': this.renderer.setStyle(handle, 'left', '-5px'); this.renderer.setStyle(handle, 'top', '50%'); this.renderer.setStyle(handle, 'transform', 'translateY(-50%)'); break;
      case 'right': this.renderer.setStyle(handle, 'right', '-5px'); this.renderer.setStyle(handle, 'top', '50%'); this.renderer.setStyle(handle, 'transform', 'translateY(-50%)'); break;
      case 'top-left': this.renderer.setStyle(handle, 'top', '-5px'); this.renderer.setStyle(handle, 'left', '-5px'); break;
      case 'top-right': this.renderer.setStyle(handle, 'top', '-5px'); this.renderer.setStyle(handle, 'right', '-5px'); break;
      case 'bottom-left': this.renderer.setStyle(handle, 'bottom', '-5px'); this.renderer.setStyle(handle, 'left', '-5px'); break;
      case 'bottom-right': this.renderer.setStyle(handle, 'bottom', '-5px'); this.renderer.setStyle(handle, 'right', '-5px'); break;
    }
    this.renderer.setStyle(handle, 'width', '10px');
    this.renderer.setStyle(handle, 'height', '10px');
  }

  private startResize(e: MouseEvent, direction: string) {
    this.resizing = true;
    this.resizeDirection = direction;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.initialWidth = this.el.nativeElement.offsetWidth;
    this.initialHeight = this.el.nativeElement.offsetHeight;
    this.initialLeft = this.el.nativeElement.offsetLeft;
    this.initialTop = this.el.nativeElement.offsetTop;

    e.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.resizing || !this.parentRect) return;

    let deltaX = e.clientX - this.startX;
    let deltaY = e.clientY - this.startY;

    let newWidth = this.initialWidth;
    let newHeight = this.initialHeight;
    let newLeft = this.initialLeft;
    let newTop = this.initialTop;
    let adjustedPosition = {x: 0, y: 0};
    if (this.resizeDirection.includes('right')) {
      newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
    }
    if (this.resizeDirection.includes('left')) {
      newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
      newLeft = this.initialLeft + deltaX; // Key change for left resize

    }
    if (this.resizeDirection.includes('bottom')) {
      newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
    }
    if (this.resizeDirection.includes('top')) {
      newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
      newTop = this.initialTop + deltaY; // Key change for top resize
    }

    if (this.resizeDirection.includes('top-left')) {
      newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
      newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
      newLeft = this.initialLeft + deltaX; // Key change
      newTop = this.initialTop + deltaY; // Key change
    
    } else if (this.resizeDirection.includes('top-right')) {
      newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
      newHeight = Math.max(this.minHeight, this.initialHeight - deltaY);
      newTop = this.initialTop + deltaY; // Key change
      newTop = Math.max(0, Math.min(this.parentRect.height - newHeight, newTop));
    } else if (this.resizeDirection.includes('bottom-left')) {
      newWidth = Math.max(this.minWidth, this.initialWidth - deltaX);
      newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
      newLeft = this.initialLeft + deltaX; // Key change
      newLeft = Math.max(0, Math.min(this.parentRect.width - newWidth, newLeft));
    } else if (this.resizeDirection.includes('bottom-right')) {
      newWidth = Math.max(this.minWidth, this.initialWidth + deltaX);
      newHeight = Math.max(this.minHeight, this.initialHeight + deltaY);
    }

    this.el.nativeElement.style.width = `${newWidth}px`;
    this.el.nativeElement.style.height = `${newHeight}px`;
    this.el.nativeElement.style.left = `${newLeft}px`;
    this.el.nativeElement.style.top = `${newTop}px`;

    this.resized.emit({ width: newWidth, height: newHeight, 
      x: newLeft, y: newTop });
  }


  @HostListener('window:mouseup')
  onMouseUp() {
    this.resizing = false;
  }
}