<!--
  - KodeBlox Copyright 2020 Sayak Mukhopadhyay
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  - http: //www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
    <div>
        <ed-toolbar>
        </ed-toolbar>
        <v-main>
            <v-container fluid>
                <h1>Guide</h1>
                <p>
                    A guide to use Elite BGS efficiently and completely
                </p>
                <h3>Systems and Factions Search</h3>
                <p>
                  Search for any system or faction by going to the
                  <router-link :to="{name: 'systems'}">systems</router-link>
                  page or the
                  <router-link :to="{name: 'factions'}">factions</router-link>
                  page and start typing on the search bar. The table will be filtered dynamically as you search. You
                  must start the search with the starting letters. So, searching for
                  <code>Qa'</code> will give you a result. Searching for
                  <code>wakana</code> won't give you any, although who knows if there is a system called
                  <code>Wakana...</code>. In the results you can view the basic information of the system.
                </p>
              <v-img class="image-fit" src="@/assets/guide-system-search.png" alt="System Search"/>
              <p>
                To see more details, click on the system or faction name.
              </p>
              <v-img class="image-fit" src="@/assets/guide-system-view-link.png" alt="System View Button"/>
              <p>
                In the details page, you can find the basic details as well as the states of all the factions in the
                system and the influence chart for the last 10 days. You can also sort and filter using the column
                headers. In the faction, states, one can see the trend of the pending and recovering states.
              </p>
              <ul>
                <li>Red means that they are trending down</li>
                <li>Blue means that they are not trending</li>
                <li>Green means that they are trending up</li>
              </ul>
              <p>
                One can predict the possibility of a state from going active among multiple pending states by seeing the
                trend.
              </p>
              <v-img class="image-fit" src="@/assets/guide-faction-trend.png" alt="Faction Trend"/>
              <p>
                In the graphs you can switch on or off a faction by clicking on the faction in the legend.
              </p>
              <v-img class="image-fit" src="@/assets/guide-graph-switch.png" alt="Graph Switch"/>
              <h3>Log in</h3>
              <p>If you are in the
                <router-link :to="{name: 'home'}">home</router-link>
                page.
              </p>
              <v-img class="image-fit" src="@/assets/guide-login.png" alt="Login"/>
              <p>If you are on some other page, click the cog icon and select Login</p>
              <v-img class="image-fit" src="@/assets/guide-login-elsewhere.png" alt="Login from Elsewhere"/>
              <p>
                Logging in is only available through Discord OAuth, since most of the player community has a Discord
                server. It also helps in authorising an user for features as mentioned later.
              </p>
              <h3>Joining the Official Discord Server</h3>
              <p>
                Join the official Discord server by clicking on the Elite BGS Discord Server link in the
                <router-link :to="{name: 'about'}">About</router-link>
                section.
              </p>
              <v-img class="image-fit" src="@/assets/guide-profile.png" alt="Profile"/>
              <p>
                You can join the server by clicking on the
                <code>JOIN DISCORD SERVER</code> button.
              </p>
              <v-img class="image-fit" src="@/assets/guide-join-discord.png" alt="Join Discord"/>
              <h3>Logged in User Privileges</h3>
              <p>
                Although a user can get data for any system and faction without logging in, a logged in user has the
                benefit of having pinned factions and systems to monitor. These factions show up in the home page after
                logging in.
              </p>
              <v-img class="image-fit" src="@/assets/guide-loggedin.png" alt="Logged In"/>
              <p>
                You can add more factions and systems to monitor using the
                <code>+ ADD</code> button in the
                <router-link :to="{name: 'home'}">home</router-link>
                page.
              </p>
              <v-img class="image-fit" src="@/assets/guide-home-add.png" alt="Add Button in Home"/>
              <p>
                Or you can add by going to the
                <router-link :to="{name: 'systems'}">systems</router-link>
                page or the
                <router-link :to="{name: 'factions'}">factions</router-link>
                page, searching and selecting the system or faction and clicking on
                <code>Monitor System</code> or
                <code>Monitor Faction</code>.
              </p>
              <p>
                You will need to monitor factions and systems seperately for each to show up.
              </p>
              <v-img class="image-fit" src="@/assets/guide-system-add.png" alt="Add Button in Systems"/>
              <p>
                All added systems and factions will be listed in your
                <router-link :to="{name: 'profile-data'}">Profile</router-link>
                . You can delete using the
                <code>REMOVE</code> button next to a system or faction.
              </p>
              <v-img class="image-fit" src="@/assets/guide-remove-faction.png" alt="Remove Button for Factions"/>
              <p>
                A major feature of Elite BGS is that you can update system data manually. Elite BGS gets its data
                automatically through
                <a href="https://github.com/EDSM-NET/EDDN">EDDN</a> but that means one needs to actually make a jump
                into the system for the database to get updated. Now you
                can update the system data by seeing the System Map itself. Great for monitoring those fringe systems
                nobody visits.
                </p>
                <p>
                    To update the system data, you need to have access to the system edit functionality. This access is provided manually to
                    representatives of factions who are present in that particular system. If you are a representative, join the Official
                    Discord Server and request access. After due verification, access will be provided.
                </p>
                <p>
                    Once you get access, just go to the system view of your system. Press the
                    <code>EDIT</code> button. to bring up a modal.
                </p>
                <v-img class="image-fit" src="@/assets/guide-system-view-link.png" alt="View System Details" />
                <v-img class="image-fit" src="@/assets/guide-system-edit.png" alt="Edit Button for Systems" />
                <v-img class="image-fit" src="@/assets/guide-system-edit-modal.png" alt="Edit Modal for systems" />
                <p>
                    Editing a system involves updating all the factions data.
                </p>
                <ul>
                    <li>Influence must be in percentages value. Total sum of influence must add up to 100</li>
                    <li>Select a state from the drop down.</li>
                    <li>Turn on the switch if the faction is the one is control. Turning on any switch will turn of the rest. You cannot
                        turn off a switch.</li>
                    <li>Remove any unneeded pending and recovering states by clicking on the tags</li>
                    <li>Selecting the pending and recovering states.
                        <ul>
                            <li>Select a state from the drop down.</li>
                            <li>Select a trend for the state.</li>
                            <li>Click on the button
                                <code>ADD PENDING/ADD RECOVERING</code>
                            </li>
                        </ul>
                    </li>
                </ul>
                <p>
                    If a faction is not present in the system anymore, you can remove it by clicking the
                    <code>REMOVE FACTION</code> button. You cannot add a new faction due to security and the only way to add is through an EDDN message.
                </p>
                <p>
                    Click the
                    <code>SAVE</code> button to save your updates. If you make any mistake, you can press the
                    <code>RESET</code> button to revert all your changes.
                </p>
                <v-img class="image-fit" src="@/assets/guide-editing.png" alt="System Editing" />
                <p>
                    That's all folks. Happy Grinding!
                </p>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'

export default {
  name: 'Guide',
  components: {
    'ed-toolbar': Toolbar
  }
}
</script>

<style scoped>
.image-fit {
    width: max-content;
}
</style>
