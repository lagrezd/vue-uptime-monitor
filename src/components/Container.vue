<template>
    <main>
        <div v-for="apikey in apiKeys">
            <v-card>
                <v-card-title>
                    Ndds
                    <v-spacer></v-spacer>
                    <v-text-field
                        append-icon="search"
                        label="Rechercher"
                        single-line
                        hide-details
                        v-model="search"
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="headers"
                :items="items"
                :search="search"
                v-model="selected"
                loading="true"
                no-data-text="Pas encore de données récupérés !"
                no-results-text="Pas de résultats"
                item-key="friendlyname"
                select-all
                selected-key="friendlyname"
                class="elevation-1"
                :rows-per-page-items="pages">
                    <template slot="headerCell" scope="props">
                        <v-tooltip bottom>
                                <span slot="activator">
                                  {{ props.header.text }}
                                </span>
                            <span>
                                  {{ props.header.text }}
                                </span>
                        </v-tooltip>
                    </template>
                    <template slot="items" scope="props">
                        <td>
                            <v-checkbox
                                primary
                                hide-details
                                v-model="props.selected"
                            ></v-checkbox>
                        </td>
                        <!--td>{{ props.index }}</td-->
                        <td class="text-xs-left" v-if="props.item.status == 2">
                            <v-icon color="green darken-2">arrow_upward</v-icon>
                        </td>
                        <td class="text-xs-left" v-else>
                            <v-icon color="red darken-2">arrow_downward</v-icon>
                        </td>
                        <td class="text-xs-left"><a :href="props.item.url" target="_blank">{{ props.item.url }}</a></td>
                        <td class="text-xs-left">{{ props.item.friendlyname }}</td>
                        <td class="text-xs-right">{{ props.item.customuptimeratio }}</td>
                    </template>
                </v-data-table>
            </v-card>
            <!--div v-for="item in items">
                <uptime-stats :item="item" :apikey="apikey"></uptime-stats>
            </div-->
        </div>
    </main>
</template>

<script>
    import UptimeStats from './UptimeStats.vue'
    import {apiKeys, getApiRequest, getStatusFromCode} from '../uptimerobot.js'
    import bus from '../bus.js'

    export default {
        data () {
            return {
                apiKeys: apiKeys,
                dialog: false,
                drawer: false,
                items: [],
                item: {
                    friendlyname: "Chargement..",
                },
                navs: [
                    { icon: 'contacts', text: 'Contacts' },
                    { icon: 'history', text: 'Frequently contacted' },
                    { icon: 'content_copy', text: 'Duplicates' },
                    {
                        icon: 'keyboard_arrow_up',
                        'icon-alt': 'keyboard_arrow_down',
                        text: 'Labels',
                        model: true,
                        children: [
                            { icon: 'add', text: 'Create label' }
                        ]
                    },
                    {
                        icon: 'keyboard_arrow_up',
                        'icon-alt': 'keyboard_arrow_down',
                        text: 'More',
                        model: false,
                        children: [
                            { text: 'Import' },
                            { text: 'Export' },
                            { text: 'Print' },
                            { text: 'Undo changes' },
                            { text: 'Other contacts' }
                        ]
                    },
                    { icon: 'settings', text: 'Settings' },
                    { icon: 'chat_bubble', text: 'Send feedback' },
                    { icon: 'help', text: 'Help' },
                    { icon: 'phonelink', text: 'App downloads' },
                    { icon: 'keyboard', text: 'Go to the old version' }
                ],
                search: '',
                selected: [],
                pages: [12, 25, 50, 100 ,{ text: "Tous", value: -1 }],
                pagination: { sortBy: 'friendlyname', page: 1, rowsPerPage: 50, descending: false, totalItems: 1 },
                headers: [
                    /*{
                        text: '#',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },*/
                    { text: 'Etat', value: 'status', align: 'left' },
                    { text: 'URL', value: 'url', align: 'left' },
                    { text: 'Nom', value: 'friendlyname', align: 'left' },
                    { text: 'Auj.-Hier-Semaine', value: 'customuptimeratio', align: 'left' }
                ],
                showDetails: false,
                visible: false,
            }
        },
        props: {
            source: String
        },
        created() {
            var api_request = getApiRequest(this.apiKeys)
            //console.log(api_request)
            this.$http.get(api_request)
                .then(function(resp) {
                    if(resp.data.stat == "ok") {
                        this.items = resp.data.monitors.monitor;
                        /*this.items = resp.data.monitors.monitor;
                         console.log(this.items)*/
                        this.item = resp.data.monitors.monitor[0];
                        // console.log(JSON.stringify(uptimeData));
                        var uptime = this.item.customuptimeratio.split("-");
                        this.item.day = uptime[0];
                        this.item.month = uptime[1];
                        this.item.week = uptime[2];

                        //this.item.status = getStatusFromCode(this.item.status).toUpperCase();

                        var respTotal = 0;
                        for (var i = 0; i < this.item.responsetime.length; i++) {
                            respTotal = respTotal + parseInt(this.item.responsetime[i].value);
                        }
                        this.item.responseTimesAvg = (respTotal / this.item.responsetime.length).toFixed(2);

                        this.visible = true
                        bus.emit('loaded')
                    }
                    else {
                        console.log("Erreur API " + api_request)
                    }
                });
        },
        components: {
            UptimeStats
        }
    }
</script>

<style>
    main {
        padding-top: 70px;
    }
    .icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: currentColor;
        fill: currentColor;
    }

    .icon-close {
        width: 0.7857148498296738em;
    }

    .icon-twitter {
        width: 0.9285703301429749em;
    }

    .icon-github {
        width: 0.8571436107158661em;
    }
</style>
