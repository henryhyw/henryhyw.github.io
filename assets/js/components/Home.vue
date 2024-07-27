<template>
  <div v-html="compiledMarkdown"></div>
</template>

<script>
export default {
  data() {
    return {
      markdownContent: '',
    };
  },
  computed: {
    compiledMarkdown() {
      const md = window.markdownit();
      return md.render(this.markdownContent);
    },
  },
  mounted() {
    window.axios
      .get('/assets/markdown/index.md') // Update the path to your Markdown file
      .then((response) => {
        this.markdownContent = response.data;
      });
  },
};
</script>