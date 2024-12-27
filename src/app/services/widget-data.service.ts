import { Injectable } from '@angular/core';
import { Widget } from '../models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetDataService {
  getInitialWidgets(): Widget[] {
    return [
      {
        id: '1',
        type: 'Chart Widget',
        position: { x: 50, y: 50 },
        width: 400,
        height: 300,
        data: {
          type: 'line',
          title: 'Monthly Sales'
        }
      },
      {
        id: '2',
        type: 'Table Widget',
        position: { x: 500, y: 50 },
        width: 500,
        height: 400,
        data: {
          columns: ['Date', 'Revenue', 'Growth'],
          rows: 10
        }
      },
      {
        id: '3',
        type: 'Text Widget',
        position: { x: 50, y: 400 },
        width: 300,
        height: 200,
        data: {
          content: 'Welcome to your dashboard!'
        }
      }
    ];
  }
}