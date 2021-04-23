<template>
  <div>
    <h1>Hosted Bot</h1>
    <p>
      I am hosting the bot for all to use. Click the invite in the overview tab. You must have Manage Server permission
      for the
      server.
    </p>
    <p>
      After inviting the bot, follow the steps in order:
    </p>
    <ol>
      <li>
        Run command
        <code>@BGSBot myguild set</code> to register your Discord guild(fancy term for a server). The command MUST be
        run by someone who has the
        <code>Administrator</code> permission in Discord.
      </li>
      <li>
        Next you need to add an admin role. An admin role is able to execute all commands. Find which role you want to
        add as an
        admin role. You can add many roles as admin roles. Next you need to find the id of the admin role(s). To do that
        prepend the mention of your role with
        <code>\</code>. Eg. if your role is admin, you need to use
        <code>\@admin</code> to see the id.
      </li>
      <li>
        With the role id, run the command
        <code>@BGSBot adminroles add &lt;id&gt;</code>. Replace
        <code>&lt;id&gt;</code> with the role found in the previous step. The command MUST be run by someone who has the
        <code>Administrator</code> permission in Discord. For eg. if Discord shows the id as
        <code>&lt;@&amp;123456789012345678&gt;</code>, run the command as
        <code>@BGSBot adminroles add 123456789012345678</code>.
      </li>
      <li>
        Now, add a BGS Manager role. A BGS Manager would be able to execute commands related to BGS but not the bot's
        administrative
        commands. Run the command
        <code>@BGSBot bgsrole set &lt;id&gt;</code>. You need to have an admin role that you set in the previous step to
        execute this command. Also, there can be
        only 1 role for BGS Manager. Use the numeric id only like
        <code>adminroles</code>.
      </li>
      <li>
        Optionally, set up a BGS Channel using the command
        <code>@BGSBot bgschannel set &lt;id&gt;</code>. Replace
        <code>&lt;id&gt;</code> with the channel id that you want to convert to a BGS reporting channel. Use the numeric
        id only like
        <code>adminroles</code>.
      </li>
      <li>
        Optionally, set up forbidden roles. Users having these roles won't be able to execute any command even if they
        have admin
        roles or bgs manager roles. Run the command
        <code>@BGSBot forbiddenroles add &lt;id&gt;</code>. Use the numeric id only like
        <code>adminroles</code>. You can add as many roles as you like.
      </li>
      <li>
        Optionally, set up automated BGS Reporting. For this, a BGS Channel must be set up. To set up automated BGS
        Reporting, use
        a time in UTC with the following command
        <code>@BGSBot bgsreport settime &lt;time in UTC&gt;</code>. The time must be of the format
        <code>HH:mm:ss</code>. For eg. if the time to show the report is 15:25:32 UTC everyday, run the command as
        <code>@BGSBot bgsreport settime 15:25:32</code>.
      </li>
      <li>
        Optionally, set up sorting of all output. Setting this up will enable sorting of all data in the order of System
        or Faction
        name or influence in either. To set up sorting use the following command
        <code>@BGSBot sort set &lt;type&gt; &lt;order&gt;</code>. The
        <code>type</code> must be either
        <code>influence</code> or
        <code>name</code> and the
        <code>order</code> must be either
        <code>increasing</code> or
        <code>decreasing</code>. For eg. to sort according to influence in descending/decreasing order use the following
        command
        <code>@BGSBot sort set influence decreasing</code>
      </li>
    </ol>
    <p>
      This concludes the set up of the bot.
    </p>
    <h1>Self Hosting</h1>
    <p>
      Coming Soon
      <sup>TM</sup>
    </p>
    <h1>Using the bot</h1>
    <p>
      The bot can be commanded to fetch data of systems and factions. The name is case insensitive but the entered name
      should
      reflect ingame name in English. The commands that the bot has currently are:
    </p>
    <ol>
      <li>
        <code>@BGSBot factionstatus get &lt;faction name in lower case&gt;</code>
        <br>For eg.
        <code>@BGSBot factionstatus get knights of karma</code>
      </li>
      <li>
        <code>@BGSBot systemstatus get &lt;system name in lower case&gt;</code>
        <br>For eg.
        <code>@BGSBot systemstatus get qa'wakana</code>
      </li>
    </ol>
    <p>
      To create BGS Reports you need to monitor factions and systems. A faction or a system can be monitored as primary
      or not.
      Primary factions would be having detailed data while non primary ones would be having concise ones in a compact
      format.
      Only primary monitored systems is currently available in BGS reports.
    </p>
    <p>
      To monitor a faction, command using:
    </p>
    <ol>
      <li>
        <code>@BGSBot monitorfactions add &lt;factionname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorfactions add knights of karma</code>
      </li>
      <li>
        <code>@BGSBot monitorfactions addprimary &lt;factionname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorfactions addprimary knights of karma</code>
      </li>
    </ol>
    <p>
      To monitor a system, command using:
    </p>
    <ol>
      <li>
        <code>@BGSBot monitorsystems add &lt;systemname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorsystems add qa'wakana</code>
      </li>
      <li>
        <code>@BGSBot monitorsystems addprimary &lt;systemname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorsystems addprimary qa'wakana</code>
      </li>
    </ol>
    <p>
      To generate a report type:
      <code>@BGSBot bgsreport get</code>
    </p>
    <h2>Administrative Commands</h2>
    <p>
      To remove or list any role or channel, use one of the following commands as suited:
    </p>
    <ol>
      <li>
        <code>@BGSBot adminroles list</code>
      </li>
      <li>
        <code>@BGSBot adminroles remove &lt;id&gt;</code>
        <br>For eg.
        <code>@BGSBot adminroles remove 123456789012345678</code>
      </li>
      <li>
        <code>@BGSBot bgsrole show</code>
      </li>
      <li>
        <code>@BGSBot bgsrole remove &lt;id&gt;</code>
        <br>For eg.
        <code>@BGSBot bgsrole remove 123456789012345678</code>
      </li>
      <li>
        <code>@BGSBot bgschannel show</code>
      </li>
      <li>
        <code>@BGSBot bgschannel remove &lt;id&gt;</code>
        <br>For eg.
        <code>@BGSBot bgschannel remove 123456789012345678</code>
      </li>
      <li>
        <code>@BGSBot forbiddenroles list</code>
      </li>
      <li>
        <code>@BGSBot forbiddenroles add &lt;id&gt;</code>
        <br>For eg.
        <code>@BGSBot forbiddenroles remove 123456789012345678</code>
      </li>
    </ol>
    <p>
      To remove or list the monitored factions or systems:
    </p>
    <ol>
      <li>
        <code>@BGSBot monitorfactions list</code>
      </li>
      <li>
        <code>@BGSBot monitorfactions remove &lt;factionname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorfactions remove knights of karma</code>
      </li>
      <li>
        <code>@BGSBot monitorsystems list</code>
      </li>
      <li>
        <code>@BGSBot monitorsystems remove &lt;systemname&gt;</code>
        <br>For eg.
        <code>@BGSBot monitorsystems remove qa'wakana</code>
      </li>
    </ol>
    <p>
      To unset or show the BGS Reporting time:
    </p>
    <ol>
      <li>
        <code>@BGSBot bgsreport showtime</code>
      </li>
      <li>
        <code>@BGSBot bgsreport unsettime</code>
      </li>
    </ol>
    <p>
      To remove or show the sorting setup:
    </p>
    <ol>
      <li>
        <code>@BGSBot sort show</code>
      </li>
      <li>
        <code>@BGSBot sort remove</code>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'BgsBotDocs'
}
</script>

<style scoped>

</style>
