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
          <div class="col-lg-8 col-md-10 mx-auto">
            <h1 v-if="loading">Loading ...</h1>
            <template v-else v-for="post in result.posts" :key="post.id">
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
                  <a href="#">{{ post.author?.name ?? 'undefined' }}</a>
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
import {useQuery} from "@vue/apollo-composable";
import gql from "graphql-tag";
import {reactive, ref} from "vue";

const router = useRouter()
const route = useRoute()

// const enabled = ref(true)

const result = reactive({})
const loading = ref(true)

// const { result, loading } = useQuery(gql`query ($userId:ID!){
// posts { id title text author { name } createdAt }
// user(id:$userId) { id name avatar(size: S_512) }
// }`, { userId: 3 }, { enabled })
//
// console.log(result);

const socket = new WebSocket('ws://localhost:4000/ws')

console.log(socket)

socket.onopen = (event) => {
  console.log('open', event)
  socket.send(makeEvent('getPosts'))
}
socket.onclose = (event) => console.log('close', event)
socket.onmessage = (event) => {
  console.log('message', event)
  const data = JSON.parse(event.data)

  if (data.event === 'updatePosts') {
    result.posts = data.data.posts
    loading.value = false
  }
  if (data.event === 'addPost') {
    result.posts.push(data.data.newPost)
  }
}
socket.onerror = (event) => console.log('error', event)


function goToAbout() {
  router.push({ name: 'about' })
}

function makeEvent(eventName, data = {}) {
  return JSON.stringify({ event: eventName, data })
}
</script>
