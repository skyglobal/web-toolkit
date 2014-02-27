module.exports = {
   "cross-browser": {
       options: {
           base: "_site",
           port: 9999
       }
   },
   app: {
       options: {
           port: 4000,
           base: "_site",
           hostname: '0.0.0.0'
       }
   }
};