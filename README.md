Sky Global Web Toolkit
========================

Look and feel for sky.com

Soon you will find an exciting and wonderful array of widgets that can be inserted directly into your site!

See the [reference page](http://skyglobal.github.io/web-toolkit/) for a description of each component.

## Assets
Current assets can be found at http://skyglobal.github.io/web-toolkit/
- http://skyglobal.github.io/web-toolkit/stylesheets/styles.css

[You can contribute to the wiki!!!](https://github.com/bskyb-commerce/bskyb-commerce.github.io/wiki)

## Ruby Gem
You can include the Ruby gem in your project.

Just include this line in your gemfile:
  
  gem 'sky_web_toolkit', git: 'https://github.com/skyglobal/web-toolkit.git'
  
  
  
  if you are using rails then you will need to include:
    gem 'compass-rails'
    
  if your bundler is not set to auto require, then you will need to 
  require 'sky_web_toolkit'
  
  Then you just need to include this in your scss somewhere:
  @import "sky_web_toolkit";
  
### If you are using Sinatra...

Include the gem in your gemfile, you will need compass as well if you don't already have it

  gem 'compass'
  gem 'sky_web_toolkit', git: 'https://github.com/skyglobal/web-toolkit.git'

Perform a bundle exec to get the get the toolkit

  bundle exec comapss watch

create config.rb for compass with the locations of your css, sass, JavaScript and image asset files.  This file should require sky_web_toolkit

  require 'sky_web_toolkit'

  http_path = "/"
  
  css_dir = "lib/assets/stylesheets"
  
  sass_dir = "lib/assets/stylesheets"
  
  images_dir = "lib/public/images"
  
  javascripts_dir = "lib/assets/javascripts"
  
  output_style = :compressed

Create a scss file and import sky_web_tookit as above

  @import "sky_web_toolkit"

