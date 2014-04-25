For these modules to work, the following will be needed with the AMD loader configuration:

```
{
  packages: [ 'toolkit', 'demo', 'changes', 'tests' ],
  paths: {
    utils: 'toolkit/utils',
    components: 'toolkit/components',
    highlight: 'vendor/highlight',
    testIFrame: "tests/testIFrame"
  }
} 
'''
