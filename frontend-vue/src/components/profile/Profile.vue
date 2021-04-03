<template>
    <div>
        <profile-toolbar/>
        <v-content>
            <v-container fluid>
                <router-view/>
            </v-container>
        </v-content>
    </div>
</template>

<script>
import ProfileToolbar from '@/components/profile/ProfileToolbar'

export default {
  name: 'Profile',
  components: {
    'profile-toolbar': ProfileToolbar
  }
}
</script>
