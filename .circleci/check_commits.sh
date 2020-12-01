#!/bin/sh

# CircleCI runs this script to check that there are no extra merge commits
# in the feature branch that is being merged, and that the branch was rebased
# on top of the latest default branch.
# More details: https://stackoverflow.com/q/64435110

head=$(git remote show origin | awk '/HEAD branch/ {print $NF}')
current="$(git rev-parse --abbrev-ref HEAD)"

if ! git merge-base --is-ancestor "origin/${head}" "origin/${current}"; then
   printf "Forgotten to rebase '%s' on top of %s.\nExiting with error!\n" "$current" "$head"
   exit 1
fi

if [ "$(git rev-list --count --merges "origin/${head}..origin/${current}")" -ne 0 ]; then
    printf "There are merge commits on '%s' branch.\nExiting with error!\n" "$current"
    exit 1
fi

echo Branch up-to-date and commits ok.
