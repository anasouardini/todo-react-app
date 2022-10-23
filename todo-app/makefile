CommitMsg = "preview commit"

all:
	echo "use: commit/preview"

commit:
	git add * && git commit -m ${CommitMsg} && git push -u origin master

preview:
	rm -rf ../segfaulty.bitbucket.io/*
	cp -rf dist/* ../segfaulty.bitbucket.io
	cd ../segfaulty.bitbucket.io && git add * && git commit -m ${CommitMsg} && git push -u origin master