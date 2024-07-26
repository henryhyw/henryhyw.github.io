<template>
  <div v-html="compiledMarkdown"></div>
</template>

<script>
import axios from 'axios';
import MarkdownIt from 'markdown-it';

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
      .get('/assets/markdown/projects.md') // Update the path to your Markdown file
      .then((response) => {
        this.markdownContent = response.data;
      });
  },
};
</script>