#!/bin/bash
tree ./view/src/> view-file-tree.txt 
tree ./server -I "node_modules" > server-file-tree.txt
