import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Widget, DashboardState } from '../models/widget.model';
import { WidgetDataService } from './widget-data.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly STORAGE_KEY = 'dashboard_state';
  private state = new BehaviorSubject<DashboardState>({ widgets: [] });

  constructor(private widgetDataService: WidgetDataService) {
    this.loadState();
  }

  private loadState(): void {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (savedState) {
      this.state.next(JSON.parse(savedState));
    } else {
      // Initialize with default widgets if no saved state exists
      const initialWidgets = this.widgetDataService.getInitialWidgets();
      this.state.next({ widgets: initialWidgets });
      this.saveState();
    }
  }

  private saveState(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state.value));
  }

  getState(): Observable<DashboardState> {
    return this.state.asObservable();
  }

  addWidget(widget: Widget): void {
    const currentState = this.state.value;
    this.state.next({
      widgets: [...currentState.widgets, widget]
    });
    this.saveState();
  }

  updateWidgetPosition(id: string, position: { x: number; y: number }): void {
    const currentState = this.state.value;
    const updatedWidgets = currentState.widgets.map(widget =>
      widget.id === id ? { ...widget, position } : widget
    );

    this.state.next({ widgets: updatedWidgets });
    console.log('Updated Widgets:', updatedWidgets);

    // Save state to localStorage
    this.saveState();
  }


  updateWidgetSize(id: string, dimensions: { width: number; height: number, x?: number, y?: number }): void {
    const currentState = this.state.value;
    const position = { x: dimensions.x!, y: dimensions.y! };
    const dim = { width: dimensions.width, height: dimensions.height };
    const updatedWidgets = currentState.widgets.map(widget =>
      widget.id === id ? { ...widget, ...dim } : widget
    );
    this.state.next({ widgets: updatedWidgets });
    this.saveState();
  }

  removeWidget(id: string): void {
    const currentState = this.state.value;
    this.state.next({
      widgets: currentState.widgets.filter(w => w.id !== id)
    });
    this.saveState();
  }
}