import mitt, { type EventType, type Handler } from 'mitt';

export interface GlobalEvents extends Record<EventType, unknown> {}

const emitter = mitt<GlobalEvents>();

export function useEventBus() {
  return emitter;
}

export const { on, emit, off } = useEventBus();
