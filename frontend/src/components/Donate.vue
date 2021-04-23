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
        <ed-toolbar scroll-of-screen scroll-threshold="64"/>
        <v-main>
            <v-container fluid>
                <h1>Support Elite BGS</h1>
                <p>
                    Hi,
                    <br> Thank you for showing interest in Elite BGS. Looking forward to suggestions and feedback. But
                    as you
                    might know, running this website is a costly process. If you like my work, please consider making a
                    donation
                    through the following channels.
                </p>
                <v-row>
                    <v-col cols="6">
                        <a class="patreon-button" href="https://www.patreon.com/bePatron?u=6593507"/>
                    </v-col>
                    <v-col cols="6">
                        <a class="paypal-button" href="https://www.paypal.me/SayakMukhopadhyay"/>
                    </v-col>
                </v-row>
                <p>
                    Please make sure to leave message with your registered Discord User ID so that I can find my
                    benefactors
                    easily.
                </p>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'

export default {
  name: 'ImageItem',
  components: {
    'ed-toolbar': Toolbar
  }
}
</script>

<style scoped>
a.patreon-button {
    background-image: url(../assets/patreon-button.png);
    display: block;
    width: 217px;
    height: 51px;
    margin: auto;
}

a.paypal-button {
    background-image: url(https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_200x51.png);
    display: block;
    width: 200px;
    height: 51px;
    margin: auto;
}
</style>
