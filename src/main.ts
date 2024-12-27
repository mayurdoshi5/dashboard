import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DragDropModule, CdkDragMove } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DashboardService } from './app/services/dashboard.service';
import { Widget, createWidget } from './app/models/widget.model';
import { WidgetComponent } from './app/components/widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, WidgetComponent],
  template: `
    <div class="dashboard-container">
      <div class="canvas">
        <div class="dashboard-grid">
          <app-widget
            *ngFor="let widget of widgets; trackBy: trackByFn"
            [widget]="widget"
            (dragMoved)="onDragMoved($event)"
            (dragEnded)="onDragEnded($event, widget)"
            (removed)="removeWidget($event)"
            (resizeEnded)="onResizeEnded($event)">
          </app-widget>
        </div>
      </div>
    </div>
  `
})
export class App {
  widgets: Widget[] = [];

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getState().subscribe(state => {
      this.widgets = state.widgets;
    });
  }

  trackByFn(index: number, widget: Widget): string {
    return widget.id;
  }

  onDragMoved(event: CdkDragMove) {
    // Optional: Add any drag move handling if needed
     // Get the element being dragged
     const draggedElement = event.source.element.nativeElement;

     const canvas = document.querySelector('.canvas') as HTMLElement;
     // Get the viewport boundaries
     const viewportRect = canvas.getBoundingClientRect();
 
     // Get the dragged element's top position relative to the viewport
     const elementTop = draggedElement.getBoundingClientRect().top - viewportRect.top;
 
    // Calculate the dragged element's top position relative to the viewport

  // Prevent dragging above the viewport with a CSS class
  draggedElement.classList.toggle('no-top-drag', elementTop < 0);
  }

  onDragEnded(event: any, widget: Widget) {
    if (widget?.id) {
      const canvas = document.querySelector('.canvas') as HTMLElement;
      const canvasRect = canvas.getBoundingClientRect();
  
      // Get the position relative to the canvas
      const position = event.source.getFreeDragPosition();
      console.log('Position:', position);
      const adjustedPosition = {
        x: Math.max(0, Math.min(position.x, canvasRect.width - widget.width)),
        y: Math.max(0, Math.min(position.y, canvasRect.height - widget.height))
      };
  
      console.log('Adjusted Position:', adjustedPosition);
  
      // Update the widget position
      this.dashboardService.updateWidgetPosition(widget.id, adjustedPosition);
    }
  }
  
  

  onResizeEnded(event: { id: string; width: number; height: number, x?: number, y?: number }) {
    this.dashboardService.updateWidgetSize(event.id, {
      width: event.width,
      height: event.height,
      x: event.x,
      y: event.y
    });
  }

  removeWidget(id: string) {
    this.dashboardService.removeWidget(id);
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    DashboardService
  ]
});