
# Steps to migrate




    1. Go to folder src/json/sample. There are the json files that will be needed to migrate the entries 

    2. The files in the folder are named in the increasing order and they are needed to be executed in the same increasing manner one by one.

    3. You need to copy the 1st file content (i.e  src/json/sample/_01.json) and paste its content to the main  src/json/changes.json file

    4. Now run  "npm run dev"

    5. Now repeat those steps for all the remaining scripts in the folder src/json/sample



# Notes

    1. While copying the file, search for "environment" key and replace its value "dev" with the source environment and "sandbox_testing" with the destination environment


# Commands

    1. npm install

    2. After reading and undestanding the "Steps to migrate" and "Notes", to run the script use "npm run dev"

