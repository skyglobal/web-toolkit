module Jekyll
  class VersionNumberTag < Liquid::Tag
    require 'json'
    def initialize(tag_name, text, tokens)
      super
      package_json = open("package.json")
      json = package_json.read
      parsed = JSON.parse(json)
      @version_number = parsed["version"]

    end

    def render(context)
      @version_number
    end
  end
end

Liquid::Template.register_tag('version_number', Jekyll::VersionNumberTag)