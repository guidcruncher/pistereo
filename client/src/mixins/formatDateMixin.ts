export default {
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const dateTimeFormat = new Intl.DateTimeFormat('default', options);
      return dateTimeFormat.format(date);
    },
    formatTinyDate(dateString) {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: 'numeric',
      };
      const dateTimeFormat = new Intl.DateTimeFormat('default', options);
      return dateTimeFormat.format(date);
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      return (
        date.getHours().toString().padStart(2, '0') +
        ':' +
        date.getMinutes().toString().padStart(2, '0')
      );
    },
  },
};
