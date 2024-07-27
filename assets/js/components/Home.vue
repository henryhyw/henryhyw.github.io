<template>
  <div v-html="compiledMarkdown"></div>
</template>

<script type="module">
import axios from 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
import MarkdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it/dist/markdown-it.min.js';

export default {
  data() {
    return {
      markdownContent: '',
    };
  },
  computed: {
    compiledMarkdown() {
      const md = new MarkdownIt();
      return md.render(this.markdownContent);
    },
  },
  mounted() {
    axios
      .get('/assets/markdown/index.md') // Update the path to your Markdown file
      .then((response) => {
        this.markdownContent = response.data;
      });
  },
};
</script>