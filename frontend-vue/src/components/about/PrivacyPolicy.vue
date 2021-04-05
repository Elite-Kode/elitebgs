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
                <owner-info/>
                <h2>Privacy Policy</h2>
                <privacy-policy-text/>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import OwnerInfo from '@/components/about/OwnerInfo'
import PrivacyPolicyText from '@/components/about/PrivacyPolicyText'

export default {
  name: 'Disclaimer',
  components: {
    'ed-toolbar': Toolbar,
    'owner-info': OwnerInfo,
    'privacy-policy-text': PrivacyPolicyText
  }
}
</script>

<style scoped>

</style>
