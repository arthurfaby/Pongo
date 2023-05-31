#!/bin/sh

su postgres
psql -h 0.0.0.0
CREATE DATABASE pongo;
