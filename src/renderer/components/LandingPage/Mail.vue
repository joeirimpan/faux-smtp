<template>
  <div class="container">
        <div class="email-list">
            <table class="u-full-width">
                <caption><b>Fake Mails</b></caption>
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Subject</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody class="mail-info">
                    <tr v-for="mail in mails">
                        <td>
                            <span v-for="from in mail.from.value">
                                {{ from.name }} : {{ from.address }}
                            </span>
                        </td>
                        <td>
                            <span v-for="to in mail.to.value">
                                {{ to.name }} : {{ to.address }}
                            </span>
                        </td>
                        <td>{{ mail.subject }}</td>
                        <td>{{ mail.text }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      mails: [],
    };
  },
  mounted() {
    this.fetchEmails();
  },
  methods: {
    // Poll every 5 seconds for new emails
    fetchEmails() {
      fetch('http://localhost:5000/mails.json')
        .then(response => response.json())
        .then((mailsJSON) => { this.mails = mailsJSON; });
      setTimeout(this.fetchEmails, 5 * 1000);
    },
  },
};
</script>

<style scoped>
</style>
