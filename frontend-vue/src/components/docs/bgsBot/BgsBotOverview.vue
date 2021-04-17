<template>
  <div>
    <h1>BGSBot</h1>
    <h3>
      A
      <a href="https://discordapp.com/">Discord</a> bot for Elite Dangerous player groups. Track your player faction in
      Discord.
    </h3>
    <h2>Invite</h2>
    <v-btn
      to="https://discordapp.com/oauth2/authorize?&client_id=332846508888031232&scope=bot&permissions=0"
      color="primary"
    > Invite
    </v-btn>
    the bot to your server.
    <h2>Help</h2>
    <p>To get a complete idea of how to use the bot, go to the
      <router-link :to="{name: 'bgsbot-api-docs'}">Docs</router-link>
      tab. Or you can type
      <code>@BGSBot help</code> and get help on the commands in Discord itself.
    </p>
  </div>
</template>

<script>
export default {
  name: 'BgsBotOverview'
}
</script>

<style scoped>

</style>
