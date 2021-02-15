/**
 * @see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
 **/

module.exports = {
  types: [
    {
      type: 'feat',
      section: 'Funcionalidades',
    },
    {
      type: 'fix',
      section: 'Correções de erros',
    },
    {
      type: 'perf',
      section: 'Melhorias de performance',
    },
    {
      type: 'chore',
      hidden: true,
    },
    {
      type: 'docs',
      hidden: true,
    },
    {
      type: 'style',
      hidden: true,
    },
    {
      type: 'refactor',
      hidden: true,
    },
    {
      type: 'test',
      hidden: true,
    },
  ],
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} [ci skip]',
};
