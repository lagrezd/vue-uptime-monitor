<template>
    <div>
        <v-data-table
            :headers="headers"
            item-key="friendlyname"
            :item="item"
            v-model="selected"
            :search="search"
            select-all
            class="elevation-1"
            v-if="visible">
            <template slot="headerCell" scope="props">
                <v-tooltip bottom>
                    <span slot="activator">{{ props.header.text }}</span>
                    <span>{{ props.header.text }}</span>
                </v-tooltip>
            </template>
            <template slot="apikey" scope="props">
                <td>
                    <v-checkbox
                        primary
                        hide-details
                        v-model="selected"
                    ></v-checkbox>
                </td>
                <td>#</td>
                <td>
                    <div class="thumbnail-small thumbnail-rounded up" v-if="item.status == 'UP'">
                        <svg class="icon icon-check" :class="item.status"><use xlink:href="#icon-check"></use></svg>
                    </div>
                    <div class="thumbnail-small thumbnail-rounded" v-else>
                        <svg class="icon icon-close" :class="item.status"><use xlink:href="#icon-close"></use></svg>
                    </div>
                </td>
                <td class="text-xs-right">{{ item.url }}</td>
                <td class="text-xs-right">{{ item.friendlyname }}</td>
                <td class="text-xs-right">{{ item.customuptimeratio }}</td>
            </template>
        </v-data-table>

        <!--v-data-table
            :items="items"
        >
            <template slot="headerCell" scope="props">
                <v-tooltip bottom>
                    <span slot="activator">{{ props.header.text }}</span>
                    <span>{{ props.header.text }}</span>
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
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.calories }}</td>
                <td class="text-xs-right">{{ props.item.fat }}</td>
                <td class="text-xs-right">{{ props.item.carbs }}</td>
                <td class="text-xs-right">{{ props.item.protein }}</td>
                <td class="text-xs-right">{{ props.item.sodium }}</td>
                <td class="text-xs-right">{{ props.item.calcium }}</td>
                <td class="text-xs-right">{{ props.item.iron }}</td>
            </template>
        </v-data-table-->

        <!--div>
        <div class="uptime-item-head clearfix" >
            <div class="media media-left">
                <div class="thumbnail-small thumbnail-rounded up" v-if="item.status == 'UP'">
                    <svg class="icon icon-check" :class="item.status"><use xlink:href="#icon-check"></use></svg>
                </div>
                <div class="thumbnail-small thumbnail-rounded" v-else>
                    <svg class="icon icon-close" :class="item.status"><use xlink:href="#icon-close"></use></svg>
                </div>
            </div>
        </div>
        <div class="media-body">
            <h2 class="h3 entry-title">
                <a :href="item.url" target="_blank">
                    {{ item.friendlyname }}
                    <span class="entry-meta">{{ item.url }}</span>
                </a>
            </h2>
            <div class="entry-meta">
                <span>Status: <strong>{{ item.status }}</strong></span>
                <span>Avg. Resoponse Time: <strong>{{ item. responseTimesAvg }}ms</strong></span>
                <button class="button-ghost" v-on:click="showDetails = !showDetails"> {{ showDetails ? "Hide" : "Details" }}</button>
            </div>

            <transition name="slide-fade">
                <div class="uptime-item-body" v-if="showDetails">

                </div>
            </transition>

            <!--bar-chart :responseTimes="item.responsetime"></bar-chart--><!--
            <div class="uptime">
                <div class="grid">
                    <div class="one-fourth">
                        <h3>Uptime</h3>
                    </div>
                    <div class="one-fourth">
                        <strong class="text-large">{{ item.day }}%</strong>
                    </div>
                </div>
            </div>
            <div>
                24hr
                <div class="one-fourth">
                    <strong class="text-large">{{ item.week }}%</strong>
                </div>
            </div>
            <div>
                week
                <div class="one-fourth">
                    <strong class="text-large"> {{ item.month }}%</strong>
                </div>
            </div>
            <div>
                30 days
            </div>
        </div-->
    </div>
</template>


<script>
    import {getApiRequest, getStatusFromCode} from './../uptimerobot.js'
    //import BarChart from './BarChart.vue'
    import bus from '../bus.js'

    export default {
        name: 'Uptime',
        props: ['apikey', 'item'],
        //components: { BarChart },
        data () {
            return {
                search: '',
                selected: [],
                headers: [
                    {
                        text: '#',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: 'Etat', value: 'calories' },
                    { text: 'URL', value: 'fat' },
                    { text: 'Nom', value: 'carbs' },
                    { text: 'Auj.-Hier-Semaine', value: 'protein' }
                ],
                showDetails: false,
                visible: false,
                item: {
                    friendlyname: "Loading..",
                }
            }
        },
        created() {

            var api_request = getApiRequest(this.apikey)
            console.log(api_request)
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

                        this.item.status = getStatusFromCode(this.item.status).toUpperCase();

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
        }
    }
</script>

<style>
    main {
        padding-top: 64px;
    }
</style>