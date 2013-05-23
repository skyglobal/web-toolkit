require 'compass'
Compass::Frameworks.register('sky_web_toolkit',
                             :stylesheets_directory => File.join(File.dirname(__FILE__), '..', 'sass'),
                             :templates_directory => File.join(File.dirname(__FILE__), '..', 'templates'))