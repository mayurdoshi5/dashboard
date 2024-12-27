import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
import { ResizableDirective } from '../directives/resizable.directive';
import { Widget } from '../models/widget.model';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, DragDropModule, ResizableDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="widget"
      [style.width.px]="widget.width"
      [style.height.px]="widget.height"
      cdkDrag
      [cdkDragFreeDragPosition]="widget.position"
      (cdkDragMoved)="onDragMoved($event)"
      (cdkDragEnded)="onDragEnded($event)"
      resizable
      (resized)="onResize($event)">
      <div class="widget-header" cdkDragHandle>
        <h3>{{ widget.type }}</h3>
        <button class="remove-btn" (click)="onRemove()">✕</button>
      </div>
      <div class="widget-content">
        {{ widget.data?.content || 'Widget Content' }}
      </div>
    </div>
  `
})
export class WidgetComponent {
  @Input() widget!: Widget;
  @Output() dragMoved = new EventEmitter<CdkDragMove>();
  @Output() dragEnded = new EventEmitter<any>();
  @Output() removed = new EventEmitter<string>();
  @Output() resizeEnded = new EventEmitter<{ id: string; width: number; height: number, x?: number, y?: number }>();

  getTransformStyle(): string {
    return `translate(${this.widget.position.x}px, ${this.widget.position.y}px)`;
  }

  onDragMoved(event: CdkDragMove) {
    this.dragMoved.emit(event);
  }

  onDragEnded(event: any) {
    this.dragEnded.emit(event);
  }

  onResize(dimensions: { width: number; height: number, x?: number, y?: number }) {
    this.resizeEnded.emit({
      id: this.widget.id,
      ...dimensions
    });
  }

  onRemove() {
    this.removed.emit(this.widget.id);
  }
}