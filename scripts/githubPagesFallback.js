// Recover previously shared clean URLs; new links use the hash router directly.
export default function githubPagesFallback() {
  let base
  return {
    name: 'github-pages-spa-fallback',
    configResolved(config) { base = config.base },
    generateBundle() {
      const source = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>MELLOW BAKE</title><script>
var base=${JSON.stringify(base)};
var path=location.pathname;
var prefix=base.replace(/\\/$/,'');
while(prefix && (path===prefix || path.indexOf(prefix+'/')===0)) path=path.slice(prefix.length)||'/';
location.replace(base+'#'+path+location.search+location.hash);
</script></head><body><noscript>JavaScript를 켜고 MELLOW BAKE 홈으로 접속해 주세요.</noscript></body></html>`
      this.emitFile({ type: 'asset', fileName: '404.html', source })
    },
  }
}
