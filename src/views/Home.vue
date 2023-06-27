<template>
  <PageTemplate>
    <template #header>
      <router-view></router-view>
      <PageHeader bg-image="/img/home-bg.jpg" @click="goToAbout()">
        <template #header> Clean Blog </template>
        <template #subheader> A Blog Theme by Start Bootstrap </template>
      </PageHeader>
    </template>

    <template #main>
      <div class="container">
        <div class="row">
          <h1 v-if="loading">Loading</h1>
          <div v-else class="col-lg-8 col-md-10 mx-auto">
            <template v-for="post in result.posts" :key="post.id">
              <div class="post-preview">
                <a href="post.html">
                  <h2 class="post-title">
                    {{ post.title }} - #{{ post.id }}
                  </h2>
                  <h3 class="post-subtitle">
                    {{ post.text }}
                  </h3>
                </a>
                <p class="post-meta">
                  Posted by
                  <a href="#">{{ post.author?.id ?? 'undefined' }}</a>
                  on {{ post.createdAt }}
                </p>
              </div>
              <hr />
            </template>

            <!-- Pager -->
            <div class="clearfix">
              <a class="btn btn-primary float-right" href="#"
                >Older Posts &rarr;</a
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageTemplate>
</template>

<script setup>
import PageTemplate from "./general/PageTemplate.vue";
import PageHeader from "./general/PageHeader.vue";
import {useRoute, useRouter} from "vue-router";

import gql from "graphql-tag";
import {useQuery} from "@vue/apollo-composable";
import {reactive, ref} from "vue";

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const result = reactive({})

// const { result, loading  } = useQuery(gql`
// query($postId: ID!) {
//   posts {
//     id
//     title
//     text
//     author {
//       name
//     }
//     createdAt
//   }
//
//   post(id: $postId) {
//     id title
//   }
// }
// `, {
//   postId: 3
// }, {
//   enabled,
//   pollInterval: 1000
// })

console.log(`result`, result)

const ws = new WebSocket("ws://localhost:4000/ws")

ws.onopen = () => {
  console.log("WS is open")

  ws.send(makeEvent('getPosts'))
}

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data)

  if (data.event === 'updatePosts') {
    result.posts = data.data.posts
    loading.value = false
  }

  if (data.event === 'addPost') {
    result.posts.push(data.data.newPost)
  }
}

function goToAbout() {
  router.push({ name: 'about' })
}

function makeEvent(eventName, data = {}) {
  return JSON.stringify({ event: eventName, data })
}
</script>
