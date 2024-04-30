#!/bin/sh

ENV_TEMPLATES=$( ls environment/*.template )

for template in ${ENV_TEMPLATES}
do
    env_file=.$( basename ${template} .template )
    service=${env_file##.env.}
    cp -n ${template} ${env_file}

    case ${service} in

    "common"|"social-app-backend")
        cp -n ${template} ${env_file}.docker
        ;;

    esac
done
