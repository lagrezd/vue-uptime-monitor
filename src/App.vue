<template>
    <v-app id="inspire">
        <navbar></navbar>
        <toolbar></toolbar>
        <container></container>
    </v-app>
</template>

<script>
    import Navbar from './components/Navbar'
    import Toolbar from './components/Toolbar'
    import Container from './components/Container'

    export default {
        props: {
            source: String
        },
        components: {
            Navbar,
            Toolbar,
            Container
        }
    }
</script>
