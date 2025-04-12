<script lang="ts">
import { on, emit, off } from '../composables/useeventbus';

export default {
  name: 'Clock',
  data() {
    return {
      date: '',
      time: '',
      timer: 0,
    };
  },
  mounted() {
    this.tick();
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
    this.timer = 0;
  },
  methods: {
    tick() {
      let date = new Date();
      let changed = false;
      const dateFormat = new Intl.DateTimeFormat('default', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeFormat = new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
      });
      if (this.date != dateFormat.format(date)) {
        this.changed = true;
        this.date = dateFormat.format(date);
      }

      if (this.time != timeFormat.format(date)) {
        this.changed = true;
        this.time = timeFormat.format(date);
      }

      if (changed) {
        emit('time_changed', {
          utc: new Date(
            Date.UTC(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours(),
              date.getUTCMinutes(),
              0,
            ),
          ),
          local: new Date(date.setSeconds(0).toJSON()),
        });
      }
    },
  },
};
</script>

<template>
  <div class="text-h1 text-center font-weight-thin">{{ time }}</div>
  <div class="text-subtitle-1 text-center text-uppercase">{{ date }}</div>
</template>
