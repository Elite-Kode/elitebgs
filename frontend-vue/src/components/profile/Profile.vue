<template>
    <div>
        <profile-toolbar/>
        <v-main>
            <v-container fluid>
                <router-view/>
            </v-container>
        </v-main>
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
