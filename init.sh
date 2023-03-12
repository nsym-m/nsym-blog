#!/bin/zsh

cd articles

mkdir $1
echo "---
title: \"\"
createdAt: \"$(date +'%Y-%m-%d %H:%m:%S')\"
updatedAt: \"\"
published: false
---" >$1/index.md

code $1/index.md
