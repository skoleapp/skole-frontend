#!/bin/sh

# CI runs this script to check that there are no extra merge commits
# in the feature branch that is being merged, and that the branch was rebased
# on top of the latest default branch.
# More details: https://stackoverflow.com/q/64435110/9835872

head=$(git remote show origin | awk '/HEAD branch/ {print $NF}')
current="$(git rev-parse HEAD)"

if ! git merge-base --is-ancestor "origin/${head}" "$current"; then
    printf "Forgotten to rebase on top of %s.\nExiting with error!\n" "$head"
    exit 1
fi

if [ "$(git rev-list --count --merges "origin/${head}..${current}")" -ne 0 ]; then
    printf "There are merge commits on the branch.\nExiting with error!\n"
    exit 1
fi

echo Branch up-to-date and commits ok.
