export interface Position {
  x: number;
  y: number;
}

export interface Widget {
  id: string;
  type: string;
  position: Position;
  width: number;
  height: number;
  data?: any;
}

export interface DashboardState {
  widgets: Widget[];
}

export const DEFAULT_WIDGET_SIZE = {
  width: 300,
  height: 200
};

export const createWidget = (type: string, position: Position): Widget => ({
  id: Date.now().toString(),
  type,
  position,
  ...DEFAULT_WIDGET_SIZE
});