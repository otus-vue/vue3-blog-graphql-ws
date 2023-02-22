import {createApp, h, provide} from 'vue'
import App from './App.vue'
import router from './router'

import ApolloClient from 'apollo-boost'
import {DefaultApolloClient} from "@vue/apollo-composable";

const apolloClient = new ApolloClient({
    // You should use an absolute URL here
    uri: 'http://localhost:4000/graphql'
})

const app = createApp({
    setup () {
        provide(DefaultApolloClient, apolloClient)
    },

    render: () => h(App),
})

app.use(router)

app.mount('#app')
