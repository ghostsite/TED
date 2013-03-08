#!/usr/bin/ruby -w

require 'rubygems'
require 'nokogiri'

js = File.open("cn.js", "w")

caption = Nokogiri::XML(File.open("MESCaption.xml"))
message = Nokogiri::XML(File.open("MESMessage.xml"))

js.puts 'T({'

# Caption(Button, Menu, Other)

js.puts "\tCaption : {"

types = []
caption.root.children.each do |type|
	if !type.text?
		keys = []			
		type.children.each do |text|
			text.xpath('L').each_with_index do |x, i|
				keys.push "\t\t\t" + '"' + text['Key'].gsub('"', '\"') + '" : "' + x.text.gsub('"', '\"') + '"' if i == 2
			end
		end
		types.push "\t\t" + type.name + " : {\n" + keys.join(",\n") + "\n\t\t}"
	end
end

js.puts types.join(",\n")

js.puts "\t},\n"

# Message

js.puts "\tMessage : {"

keys = []
message.xpath('//Text').each do |text|
	text.xpath('L').each_with_index do |x, i|
		keys.push "\t\t" + '"' + text['Key'].gsub('"', '\"') + '" : "' + x.text.gsub('"', '\"') + '"' if i == 2
	end
end

js.puts keys.join(",\n")

js.puts "\t}"

# Ending

js.puts "});\n"

js.close

