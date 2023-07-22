#!/usr/bin/env ruby

def git(*args)
  ret = IO.popen(["git", *args], "rb", err: [:child, :out], &:read).chomp
  unless $?.success?
    abort "git #{args.join(" ")} failed"
  end
end

plan = [[]]
DATA.each_line do |line|
  line.chomp!
  line.sub!(/\s*#.*$/, "")
  next if line.empty?

  if line == "BREAK"
    plan << []
    next
  end

  plan.last << line
end

puts "Plan:"
pp plan
plan.each do |branches|
  git *%W"merge --no-ff --no-rerere", *branches
end

__END__
ky/outbox-fetch
