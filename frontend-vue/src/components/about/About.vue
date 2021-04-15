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
                <v-row>
                    <v-col cols="12" lg="5" md="6">
                        <v-img :src="require('@/assets/BGSv1.svg')"
                               alt="Elite BGS Logo"
                               contain
                               height="50vh"
                        />
                    </v-col>
                    <v-col cols="12" lg="7" md="6">
                        <h1 class="display-3">Elite BGS</h1>
                        <p class="mt-6">
                            A tool to track and manage the Background Simulation (BGS) of Elite Dangerous. Visualise
                            influences and states using graphs and monitor factions and systems. Forget spreadsheets!
                        </p>
                        <v-btn class="mr-2" color="primary" :to="{name: 'guide'}">Guide</v-btn>
                        <v-btn color="primary" href="https://github.com/SayakMukhopadhyay/elitebgs" outlined
                               target="_blank">
                            Source
                        </v-btn>
                    </v-col>
                </v-row>
                <v-card class="my-5">
                    <v-card-title>
                        <span class="headline">For Commanders. By a Commander.</span>
                    </v-card-title>
                    <v-card-text>
                        <v-row dense>
                            <v-col class="d-flex justify-center flex-column" cols="12" lg="3" md="6">
                                <v-icon size="128">show_chart</v-icon>
                                <div class="text-center mt-2">
                                    <h2 class="mb-2">Graphs</h2>
                                    <div>Visualise influence in a dynamic graph that is automatically created and
                                        updated.
                                    </div>
                                </div>
                            </v-col>
                            <v-col class="d-flex justify-center flex-column" cols="12" lg="3" md="6">
                                <v-icon size="128" class="material-icons-outlined">
                                    screen_search_desktop
                                </v-icon>
                                <div class="text-center mt-2">
                                    <h2 class="mb-2">Monitor</h2>
                                    <div>Monitor factions and systems in your dashboard.</div>
                                </div>
                            </v-col>
                            <v-col class="d-flex justify-center flex-column" cols="12" lg="3" md="6">
                                <v-icon size="128">compare_arrows</v-icon>
                                <div class="text-center mt-2">
                                    <h2 class="mb-2">Pending and Recovering States</h2>
                                    <div>Now you can even check the pending and recovering states of your faction and
                                        that too with the current trend.
                                    </div>
                                </div>
                            </v-col>
                            <v-col class="d-flex justify-center flex-column" cols="12" lg="3" md="6">
                                <v-icon size="128">alarm</v-icon>
                                <div class="text-center mt-2">
                                    <h2 class="mb-2">Tick</h2>
                                    <div>Get the latest information about the BGS tick.</div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <h2>Reach me at</h2>
                <v-row>
                    <v-col cols="12" lg="3" md="6">
                        <v-card class="pt-5 card-img" href="https://github.com/SayakMukhopadhyay">
                            <v-img :src="require('@/assets/github-logo.svg')"
                                   alt="Github Logo"
                                   contain
                                   height="50%"
                                   width="50%"/>
                            <v-card-text>
                                Github Profile
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" lg="3" md="6">
                        <v-card class="pt-5 card-img" href="https://discord.gg/0uwCh6R62aQ0eeAX">
                            <v-img :src="require('@/assets/edcd-logo.svg')"
                                   alt="EDCD Logo"
                                   contain
                                   height="50%"
                                   width="50%"/>
                            <v-card-text>
                                EDCD Discord Server
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" lg="3" md="6">
                        <v-card class="pt-5 card-img" href="https://forums.frontier.co.uk/member.php/136073-Garud">
                            <v-img :src="require('@/assets/ed-logo.svg')"
                                   alt="Elite Dangerous Logo"
                                   contain
                                   height="50%"
                                   width="50%"/>
                            <v-card-text>
                                Frontier Forums
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" lg="3" md="6">
                        <v-card class="pt-5 card-img" href="https://discord.gg/YksSXke">
                            <v-img :src="require('@/assets/discord-logo.svg')"
                                   alt="Discord Logo"
                                   contain
                                   height="50%"
                                   width="50%"/>
                            <v-card-text>
                                Elite Shots Discord Server
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <h2>Brought to you By</h2>
                <v-row justify="center">
                    <v-col class="card-img" cols="12" lg="3" md="3" sm="12">
                        <v-img :src="require('@/assets/garud-logo.svg')"
                               alt="Garud Logo"
                               contain
                               height="50%"
                               width="50%"/>
                        <h3>CMDR Garud</h3>
                    </v-col>
                    <v-col class="card-img" cols="12" lg="3" md="2" sm="12">
                        <v-img :src="require('@/assets/ampersand.svg')"
                               alt="Ampersand"
                               contain
                               height="50%"
                               width="50%"/>
                    </v-col>
                    <v-col cols="12" lg="3" md="3" sm="12">
                        <a class="card-img" href="https://knightsofkarma.com" target="_blank">
                            <v-img :src="require('@/assets/kok-logo.svg')"
                                   alt="Knights of Karma Logo"
                                   contain
                                   height="50%"
                                   width="50%"/>
                            <h3>Knights of Karma</h3>
                        </a>
                    </v-col>
                </v-row>
                <owner-info/>
                <h2>
                  <router-link :to="{name: 'tandc'}">Terms and Conditions</router-link>
                </h2>
                <tandc-text/>
                <h2>
                  <router-link :to="{name: 'disclaimer'}">Disclaimer</router-link>
                </h2>
                <disclaimer-text/>
                <h2>
                  <router-link :to="{name: 'privacy-policy'}">Privacy Policy</router-link>
                </h2>
                <privacy-policy-text/>
            </v-container>
            <v-footer>
                <v-row class="pt-4 pl-4">
                    <h4>
                        The site is powered by
                    </h4>
                </v-row>
                <v-row style="width: 100%" justify="center" align="center">
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://www.mongodb.com/">
                            <v-img contain src="@/assets/mongodb-logo.svg" alt="MongoDB Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://expressjs.com/">
                            <v-img contain src="@/assets/express-logo.svg" alt="Express Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://vuejs.org/">
                            <v-img contain src="@/assets/vuejs-logo.svg" alt="Vue.js Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://nodejs.org/">
                            <v-img contain src="@/assets/nodejs-logo.svg" alt="Node.js Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://vuetifyjs.com/en/">
                            <v-img contain src="@/assets/vuetify-logo.svg" alt="Vuetify Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://www.w3.org/html/">
                            <v-img contain src="@/assets/html5-logo.svg" alt="HTML5 and CSS3 Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="http://sass-lang.com/">
                            <v-img contain src="@/assets/sass-logo.svg" alt="Sass Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href=" https://www.jetbrains.com/?from=elitebgs">
                            <v-img contain src="@/assets/jetbrains-logo.svg" alt="JetBrains Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://studio3t.com/">
                            <v-img contain src="@/assets/studio-3t-logo.png" alt="Studio 3T Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://eddb.io/">
                            <v-img contain src="@/assets/eddb-white-logo.svg" alt="EDDB Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://github.com/EDSM-NET/EDDN">
                            <v-img contain src="@/assets/eddn-logo.svg" alt="EDDN Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://www.bugsnag.com/open-source/">
                            <v-img contain src="@/assets/bugsnag-logo.svg" alt="Bugsnag Logo"/>
                        </a>
                    </v-col>
                    <v-col cols="12" lg="2" md="3" sm="6" xs="12">
                        <a href="https://www.cloudflare.com/">
                            <v-img contain src="@/assets/cloudflare-logo.svg" alt="Cloudflare Logo"/>
                        </a>
                    </v-col>
                </v-row>
                <v-row justify="center" align="center">
                    <v-col cols="12" md="6" sm="12">
                        <a rel="nofollow" href="https://affiliate.namecheap.com/?affId=122323">
                            Domain registered at
                            <img src="@/assets/namecheap-logo.svg" alt="Namecheap.com"/>
                        </a>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                        <a href="https://www.hetzner.com/">
                            Site hosted on
                            <img src="@/assets/hetzner-logo.svg" alt="Hetzner"/>
                        </a>
                    </v-col>
                </v-row>
                <div class="notice">
                    <p>
                        Elite BGS © 2021
                    </p>
                    <p>
                        All product names, logos, and brands are property of their respective owners. All company,
                        product
                        and service names used in this website are for identification purposes only. Use of these names,
                        logos, and brands does not imply endorsement or affiliation.
                    </p>
                </div>
            </v-footer>
        </v-main>
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import OwnerInfo from '@/components/about/OwnerInfo'
import TAndCText from '@/components/about/TAndCText'
import DisclaimerText from '@/components/about/DisclaimerText'
import PrivacyPolicyText from '@/components/about/PrivacyPolicyText'

export default {
  name: 'About',
  components: {
    'ed-toolbar': Toolbar,
    'owner-info': OwnerInfo,
    'tandc-text': TAndCText,
    'disclaimer-text': DisclaimerText,
    'privacy-policy-text': PrivacyPolicyText
  }
}
</script>

<style scoped>
.card-img {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-img .v-card__text {
    text-align: center;
}
</style>
